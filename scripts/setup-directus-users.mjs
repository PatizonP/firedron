#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import https from "node:https";
import { pathToFileURL } from "node:url";
import {
  buildEditorPermissionRules,
  EDITOR_RESTRICTED_COLLECTIONS,
  getApiReadableCollections,
} from "./directus-editor-permissions.mjs";

const insecureAgent = new https.Agent({ rejectUnauthorized: false });

const API_POLICY_NAME = "Firedron API Policy";
const EDITOR_POLICY_NAME = "Firedron Editor Policy";
const APP_USER_EMAIL = "firedron-app@dofec.cz";
const EDITOR_USER_EMAIL = "firedron-editor@dofec.cz";

/** Default Directus Data Studio UI language for the whole instance. */
export const DEFAULT_DIRECTUS_UI_LANGUAGE = "cs-CZ";

function loadEnv() {
  const fromProcess = {
    DIRECTUS_URL: process.env.DIRECTUS_URL,
    DIRECTUS_ADMIN_EMAIL: process.env.DIRECTUS_ADMIN_EMAIL,
    DIRECTUS_ADMIN_PASSWORD: process.env.DIRECTUS_ADMIN_PASSWORD,
    DIRECTUS_APP_USER_PASSWORD: process.env.DIRECTUS_APP_USER_PASSWORD,
    DIRECTUS_EDITOR_USER_PASSWORD: process.env.DIRECTUS_EDITOR_USER_PASSWORD,
  };

  if (
    fromProcess.DIRECTUS_ADMIN_EMAIL &&
    fromProcess.DIRECTUS_ADMIN_PASSWORD
  ) {
    return {
      DIRECTUS_URL: fromProcess.DIRECTUS_URL,
      DIRECTUS_ADMIN_EMAIL: fromProcess.DIRECTUS_ADMIN_EMAIL,
      DIRECTUS_ADMIN_PASSWORD: fromProcess.DIRECTUS_ADMIN_PASSWORD,
      DIRECTUS_APP_USER_PASSWORD: fromProcess.DIRECTUS_APP_USER_PASSWORD,
      DIRECTUS_EDITOR_USER_PASSWORD: fromProcess.DIRECTUS_EDITOR_USER_PASSWORD,
    };
  }

  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  const parsed = {};

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    parsed[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }

  return {
    DIRECTUS_URL: parsed.DIRECTUS_URL ?? fromProcess.DIRECTUS_URL,
    DIRECTUS_ADMIN_EMAIL:
      fromProcess.DIRECTUS_ADMIN_EMAIL ?? parsed.DIRECTUS_ADMIN_EMAIL,
    DIRECTUS_ADMIN_PASSWORD:
      fromProcess.DIRECTUS_ADMIN_PASSWORD ?? parsed.DIRECTUS_ADMIN_PASSWORD,
    DIRECTUS_APP_USER_PASSWORD: fromProcess.DIRECTUS_APP_USER_PASSWORD,
    DIRECTUS_EDITOR_USER_PASSWORD: fromProcess.DIRECTUS_EDITOR_USER_PASSWORD,
  };
  } catch {
    return fromProcess;
  }
}

function getBaseUrl(rawUrl) {
  let baseUrl = rawUrl.replace(/\/admin\/?$/, "").replace(/\/$/, "");
  if (baseUrl.includes("://zon04.vas-server.cz")) {
    baseUrl = baseUrl.replace(
      "://zon04.vas-server.cz",
      "://directus.zon04.vas-server.cz",
    );
  }
  return baseUrl;
}

async function request(baseUrl, token, urlPath, init = {}) {
  const response = await fetch(`${baseUrl}${urlPath}`, {
    ...init,
    agent: insecureAgent,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      `${init.method ?? "GET"} ${urlPath} failed (${response.status}): ${JSON.stringify(payload)}`,
    );
  }

  return payload;
}

async function login(baseUrl, email, password) {
  const payload = await request(baseUrl, null, "/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return payload.data.access_token;
}

async function findRoleByName(baseUrl, token, name) {
  const filter = { name: { _eq: name } };
  const payload = await request(
    baseUrl,
    token,
    `/roles?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1&fields=id,name`,
  );
  return payload.data?.[0] ?? null;
}

async function ensureRole(baseUrl, token, name, { appAccess, adminAccess }) {
  const existing = await findRoleByName(baseUrl, token, name);
  if (existing) {
    console.log(`  role exists: ${name} (${existing.id})`);
    return existing.id;
  }

  const payload = await request(baseUrl, token, "/roles", {
    method: "POST",
    body: JSON.stringify({
      name,
      icon: name.includes("API") ? "api" : "edit",
      app_access: appAccess,
      admin_access: adminAccess,
    }),
  });

  console.log(`  created role: ${name} (${payload.data.id})`);
  return payload.data.id;
}

async function getAllCollectionNames(baseUrl, token) {
  const payload = await request(
    baseUrl,
    token,
    "/collections?fields=collection&limit=-1",
  );

  return payload.data.map((entry) => entry.collection);
}

async function listPolicyPermissions(baseUrl, token, policyId) {
  const filter = { policy: { _eq: policyId } };
  const payload = await request(
    baseUrl,
    token,
    `/permissions?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=-1&fields=id,collection,action`,
  );
  return payload.data ?? [];
}

async function deletePolicyPermissions(baseUrl, token, policyId) {
  const permissions = await listPolicyPermissions(baseUrl, token, policyId);

  for (const permission of permissions) {
    await request(baseUrl, token, `/permissions/${permission.id}`, {
      method: "DELETE",
    });
  }

  return permissions.length;
}

async function createPermissionRule(baseUrl, token, policyId, { collection, action, fields }) {
  await request(baseUrl, token, "/permissions", {
    method: "POST",
    body: JSON.stringify({
      policy: policyId,
      collection,
      action,
      fields,
      permissions: {},
      validation: {},
      presets: {},
    }),
  });
}

export async function syncFiredronPermissions(baseUrl, adminToken) {
  const apiPolicy = await findPolicyByName(baseUrl, adminToken, API_POLICY_NAME);
  const editorPolicy = await findPolicyByName(
    baseUrl,
    adminToken,
    EDITOR_POLICY_NAME,
  );

  if (!apiPolicy || !editorPolicy) {
    throw new Error(
      "Firedron policies missing – run node scripts/setup-directus-users.mjs first",
    );
  }

  const allCollections = await getAllCollectionNames(baseUrl, adminToken);
  const apiCollections = getApiReadableCollections(allCollections);
  console.log(`Syncing API read permissions for ${apiCollections.length} collections...`);

  const removedApiPermissions = await deletePolicyPermissions(
    baseUrl,
    adminToken,
    apiPolicy.id,
  );
  if (removedApiPermissions) {
    console.log(`  cleared ${removedApiPermissions} existing API permission(s)`);
  }

  for (const collection of apiCollections) {
    await createPermissionRule(baseUrl, adminToken, apiPolicy.id, {
      collection,
      action: "read",
      fields: ["*"],
    });
  }

  const editorRules = buildEditorPermissionRules();
  console.log(
    `Syncing editor permissions (${editorRules.length} rules; restricted: ${EDITOR_RESTRICTED_COLLECTIONS.join(", ")})...`,
  );

  const removedEditorPermissions = await deletePolicyPermissions(
    baseUrl,
    adminToken,
    editorPolicy.id,
  );
  if (removedEditorPermissions) {
    console.log(`  cleared ${removedEditorPermissions} existing editor permission(s)`);
  }

  for (const rule of editorRules) {
    await createPermissionRule(baseUrl, adminToken, editorPolicy.id, rule);
  }

  console.log("Synced Firedron API + Editor permissions");
}

/** Project default + all user profiles → Czech admin UI. */
export async function syncDirectusUiLanguage(
  baseUrl,
  adminToken,
  language = DEFAULT_DIRECTUS_UI_LANGUAGE,
) {
  await request(baseUrl, adminToken, "/settings", {
    method: "PATCH",
    body: JSON.stringify({ default_language: language }),
  });

  const users = await request(
    baseUrl,
    adminToken,
    "/users?fields=id,email,language&limit=-1",
  );

  let updated = 0;

  for (const user of users.data ?? []) {
    if (user.language === language) {
      continue;
    }

    await request(baseUrl, adminToken, `/users/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ language }),
    });
    updated += 1;
  }

  console.log(
    `Directus UI language set to ${language} (project default${updated ? `, ${updated} user(s) updated` : ""})`,
  );
}

async function findPolicyByName(baseUrl, token, name) {
  const filter = { name: { _eq: name } };
  const payload = await request(
    baseUrl,
    token,
    `/policies?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1&fields=id,name`,
  );
  return payload.data?.[0] ?? null;
}

async function ensurePolicy(baseUrl, token, name, { appAccess, adminAccess }) {
  const existing = await findPolicyByName(baseUrl, token, name);
  if (existing) {
    console.log(`  policy exists: ${name} (${existing.id})`);
    return existing.id;
  }

  const payload = await request(baseUrl, token, "/policies", {
    method: "POST",
    body: JSON.stringify({
      name,
      icon: name.includes("API") ? "api" : "edit",
      app_access: appAccess,
      admin_access: adminAccess,
    }),
  });

  console.log(`  created policy: ${name} (${payload.data.id})`);
  return payload.data.id;
}

async function linkPolicyToRole(baseUrl, token, roleId, policyId) {
  const filter = {
    _and: [{ role: { _eq: roleId } }, { policy: { _eq: policyId } }],
  };

  try {
    const existing = await request(
      baseUrl,
      token,
      `/access?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1&fields=id`,
    );

    if (existing.data?.length) {
      return;
    }
  } catch {
    // Some Directus versions restrict filtering /access; try create anyway.
  }

  await request(baseUrl, token, "/access", {
    method: "POST",
    body: JSON.stringify({ role: roleId, policy: policyId }),
  });
}

async function findUserByEmail(baseUrl, token, email) {
  const filter = { email: { _eq: email } };
  const payload = await request(
    baseUrl,
    token,
    `/users?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1&fields=id,email,role,status`,
  );
  return payload.data?.[0] ?? null;
}

async function ensureUser(baseUrl, token, { email, password, roleId, firstName }) {
  const existing = await findUserByEmail(baseUrl, token, email);

  if (existing) {
    await request(baseUrl, token, `/users/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        role: roleId,
        status: "active",
        language: DEFAULT_DIRECTUS_UI_LANGUAGE,
        ...(password ? { password } : {}),
      }),
    });
    console.log(`  updated user: ${email} (${existing.id})`);
    return existing.id;
  }

  const payload = await request(baseUrl, token, "/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      role: roleId,
      status: "active",
      first_name: firstName,
      language: DEFAULT_DIRECTUS_UI_LANGUAGE,
    }),
  });

  console.log(`  created user: ${email} (${payload.data.id})`);
  return payload.data.id;
}

async function ensureStaticToken(baseUrl, token, userId) {
  const staticToken = crypto.randomBytes(32).toString("hex");

  await request(baseUrl, token, `/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ token: staticToken }),
  });

  return staticToken;
}

async function main() {
  const env = loadEnv();
  const appPassword =
    env.DIRECTUS_APP_USER_PASSWORD ??
    process.argv[2] ??
    (() => {
      throw new Error("Set DIRECTUS_APP_USER_PASSWORD or pass as argv[2]");
    })();
  const editorPassword =
    env.DIRECTUS_EDITOR_USER_PASSWORD ??
    process.argv[3] ??
    (() => {
      throw new Error("Set DIRECTUS_EDITOR_USER_PASSWORD or pass as argv[3]");
    })();

  const baseUrl = getBaseUrl(env.DIRECTUS_URL);
  const adminToken = await login(
    baseUrl,
    env.DIRECTUS_ADMIN_EMAIL,
    env.DIRECTUS_ADMIN_PASSWORD,
  );

  console.log("Creating roles and policies...");
  const apiRoleId = await ensureRole(baseUrl, adminToken, "Firedron API", {
    appAccess: false,
    adminAccess: false,
  });
  const editorRoleId = await ensureRole(baseUrl, adminToken, "Firedron Editor", {
    appAccess: true,
    adminAccess: false,
  });

  const apiPolicyId = await ensurePolicy(baseUrl, adminToken, API_POLICY_NAME, {
    appAccess: false,
    adminAccess: false,
  });
  const editorPolicyId = await ensurePolicy(
    baseUrl,
    adminToken,
    EDITOR_POLICY_NAME,
    { appAccess: true, adminAccess: false },
  );

  await linkPolicyToRole(baseUrl, adminToken, apiRoleId, apiPolicyId);
  await linkPolicyToRole(baseUrl, adminToken, editorRoleId, editorPolicyId);

  console.log("Setting permissions...");
  await syncFiredronPermissions(baseUrl, adminToken);

  console.log("Setting Czech as default Directus UI language...");
  await syncDirectusUiLanguage(baseUrl, adminToken);

  console.log("Creating users...");
  const appUserId = await ensureUser(baseUrl, adminToken, {
    email: APP_USER_EMAIL,
    password: appPassword,
    roleId: apiRoleId,
    firstName: "Firedron App",
  });
  const editorUserId = await ensureUser(baseUrl, adminToken, {
    email: EDITOR_USER_EMAIL,
    password: editorPassword,
    roleId: editorRoleId,
    firstName: "Firedron Editor",
  });

  console.log("Creating app static token...");
  const staticToken = await ensureStaticToken(
    baseUrl,
    adminToken,
    appUserId,
  );

  console.log("\n=== Done ===");
  console.log(JSON.stringify({
    appUser: APP_USER_EMAIL,
    appUserPassword: appPassword,
    editorUser: EDITOR_USER_EMAIL,
    editorUserPassword: editorPassword,
    directusToken: staticToken,
    appUserId,
    editorUserId,
  }, null, 2));
}

const isMainModule =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMainModule) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
