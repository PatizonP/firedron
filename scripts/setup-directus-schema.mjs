#!/usr/bin/env node

/**
 * Creates editor-friendly Fire Drone collections with native Directus translations.
 * Replaces the legacy fire_drone_content JSON blob collection.
 */

import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { applyCollectionDisplays } from "./directus-collection-displays.mjs";
import {
  ensureFolderStructure,
  hideLegacyCollections,
  organizeCollections,
} from "./directus-collection-groups.mjs";
import { syncDirectusUiLanguage, syncFiredronPermissions } from "./setup-directus-users.mjs";
import {
  DEPRECATED_GROUP_FIELD_KEYS,
  LEGACY_ABOUT_MIGRATION,
  LEGACY_GLOBAL_MIGRATION,
  LEGACY_HOME_MIGRATION,
  LEGACY_INVEST_MIGRATION,
  SCHEMA,
} from "./directus-page-schema.mjs";
import { applySchemaLabels, CS, EN } from "./directus-schema-labels.mjs";

const insecureAgent = new https.Agent({ rejectUnauthorized: false });

function loadEnv() {
  const fromProcess = {
    DIRECTUS_URL: process.env.DIRECTUS_URL,
    DIRECTUS_ADMIN_EMAIL: process.env.DIRECTUS_ADMIN_EMAIL,
    DIRECTUS_ADMIN_PASSWORD: process.env.DIRECTUS_ADMIN_PASSWORD,
  };

  if (
    fromProcess.DIRECTUS_URL &&
    fromProcess.DIRECTUS_ADMIN_EMAIL &&
    fromProcess.DIRECTUS_ADMIN_PASSWORD
  ) {
    return fromProcess;
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
      DIRECTUS_URL: parsed.DIRECTUS_URL ?? "https://zon04.vas-server.cz/admin/",
      DIRECTUS_ADMIN_EMAIL: parsed.DIRECTUS_ADMIN_EMAIL,
      DIRECTUS_ADMIN_PASSWORD: parsed.DIRECTUS_ADMIN_PASSWORD,
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

async function request(baseUrl, token, path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
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
      `${init.method ?? "GET"} ${path} failed (${response.status}): ${JSON.stringify(payload)}`,
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

async function collectionExists(baseUrl, token, collection) {
  try {
    await request(baseUrl, token, `/collections/${collection}`);
    return true;
  } catch {
    return false;
  }
}

async function createCollection(baseUrl, token, collection, { singleton = false, icon = "article" } = {}) {
  if (await collectionExists(baseUrl, token, collection)) {
    console.log(`  collection exists: ${collection}`);
    return;
  }

  await request(baseUrl, token, "/collections", {
    method: "POST",
    body: JSON.stringify({
      collection,
      meta: {
        collection,
        icon,
        singleton,
        display_template: singleton ? "{{id}}" : "{{id}}",
      },
      schema: {},
      fields: [
        {
          field: "id",
          type: "integer",
          meta: { hidden: true, readonly: true, interface: "input" },
          schema: { is_primary_key: true, has_auto_increment: true },
        },
      ],
    }),
  });
  console.log(`  created collection: ${collection}`);
}

async function addField(baseUrl, token, collection, fieldDef) {
  try {
    await request(baseUrl, token, `/fields/${collection}`, {
      method: "POST",
      body: JSON.stringify(fieldDef),
    });
  } catch (error) {
    if (String(error.message).includes("already exists")) {
      return;
    }
    throw error;
  }
}

async function patchField(baseUrl, token, collection, field, patch) {
  await request(baseUrl, token, `/fields/${collection}/${field}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  }).catch(() => {});
}

const TRANSLATIONS_ALIAS_OPTIONS = {
  languageField: "name",
  languageDirectionField: "direction",
  defaultLanguage: "cs-CZ",
  defaultOpenSplitView: true,
};

async function deleteField(baseUrl, token, collection, field) {
  await request(baseUrl, token, `/fields/${collection}/${field}`, {
    method: "DELETE",
  }).catch(() => {});
}

/** Flatten translation forms: remove broken group fields and show all copy fields. */
async function repairTranslationFormLayout(baseUrl, token, schema) {
  for (const def of schema) {
    if (!def.translations?.length) {
      continue;
    }

    const translationsCollection = `${def.collection}_translations`;

    if (!(await collectionExists(baseUrl, token, translationsCollection))) {
      continue;
    }

    for (const groupKey of DEPRECATED_GROUP_FIELD_KEYS) {
      await deleteField(baseUrl, token, translationsCollection, groupKey);
    }

    const fieldsResponse = await request(
      baseUrl,
      token,
      `/fields/${translationsCollection}?limit=-1`,
    );

    for (const field of fieldsResponse.data ?? []) {
      if (field.field.startsWith("grp_")) {
        await deleteField(baseUrl, token, translationsCollection, field.field);
      }
    }

    for (const field of def.translations) {
      await patchField(baseUrl, token, translationsCollection, field.name, {
        meta: {
          group: null,
          hidden: false,
          sort: field.sort ?? null,
        },
      });
    }
  }

  console.log("Flattened translation forms (removed field groups)");
}

async function upsertRelation(baseUrl, token, payload) {
  const { collection, field, meta, schema } = payload;
  const relations = await request(baseUrl, token, "/relations");
  const existing = relations.data?.find(
    (relation) => relation.collection === collection && relation.field === field,
  );

  if (existing) {
    await request(baseUrl, token, `/relations/${collection}/${field}`, {
      method: "PATCH",
      body: JSON.stringify({ meta, schema }),
    }).catch(async () => {
      if (existing.meta?.id) {
        await request(baseUrl, token, `/items/directus_relations/${existing.meta.id}`, {
          method: "PATCH",
          body: JSON.stringify(meta),
        });
      }
    });
    return;
  }

  await request(baseUrl, token, "/relations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function repairTranslations(baseUrl, token, collection) {
  const translationsCollection = `${collection}_translations`;

  if (!(await collectionExists(baseUrl, token, translationsCollection))) {
    return;
  }

  const parentFk = `${collection}_id`;
  const languageFk = "languages_code";

  await patchField(baseUrl, token, translationsCollection, parentFk, {
    meta: {
      special: ["m2o"],
      interface: "select-dropdown-m2o",
      hidden: true,
    },
  });

  await patchField(baseUrl, token, translationsCollection, languageFk, {
    meta: {
      special: ["m2o"],
      interface: "select-dropdown-m2o",
      hidden: true,
      options: { template: "{{name}} ({{code}})" },
    },
  });

  await upsertRelation(baseUrl, token, {
    collection: translationsCollection,
    field: parentFk,
    related_collection: collection,
    meta: {
      one_field: "translations",
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: languageFk,
    },
    schema: { on_delete: "SET NULL" },
  });

  await upsertRelation(baseUrl, token, {
    collection: translationsCollection,
    field: languageFk,
    related_collection: "languages",
    meta: {
      one_field: null,
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: parentFk,
    },
    schema: { on_delete: "SET NULL" },
  });

  await patchField(baseUrl, token, collection, "translations", {
    meta: {
      interface: "translations",
      special: ["translations"],
      options: TRANSLATIONS_ALIAS_OPTIONS,
    },
  });
}

async function setupTranslations(baseUrl, token, collection, translatableFields) {
  const translationsCollection = `${collection}_translations`;

  if (!(await collectionExists(baseUrl, token, translationsCollection))) {
    await request(baseUrl, token, "/collections", {
      method: "POST",
      body: JSON.stringify({
        collection: translationsCollection,
        meta: {
          collection: translationsCollection,
          hidden: true,
          icon: "import_export",
          note: `Translations for ${collection}`,
        },
        schema: {},
        fields: [
          {
            field: "id",
            type: "integer",
            meta: { hidden: true, readonly: true, interface: "input" },
            schema: { is_primary_key: true, has_auto_increment: true },
          },
        ],
      }),
    });
  }

  const parentFk = `${collection}_id`;
  const languageFk = "languages_code";

  await addField(baseUrl, token, translationsCollection, {
    field: parentFk,
    type: "integer",
    meta: {
      special: ["m2o"],
      interface: "select-dropdown-m2o",
      hidden: true,
    },
    schema: { is_nullable: true },
  });

  await addField(baseUrl, token, translationsCollection, {
    field: languageFk,
    type: "string",
    meta: {
      special: ["m2o"],
      interface: "select-dropdown-m2o",
      hidden: true,
      options: { template: "{{name}} ({{code}})" },
    },
    schema: { is_nullable: true, foreign_key_table: "languages", foreign_key_column: "code" },
  });

  for (const field of translatableFields) {
    await addField(baseUrl, token, translationsCollection, {
      field: field.name,
      type: field.type ?? "string",
      meta: {
        interface: field.interface ?? (field.type === "text" ? "input-multiline" : "input"),
        required: field.required ?? false,
        width: field.width ?? "full",
        note: field.note,
        options: field.options,
        group: null,
        sort: field.sort ?? null,
      },
      schema: { is_nullable: field.required ? false : true },
    });

    await patchField(baseUrl, token, translationsCollection, field.name, {
      meta: { group: null, sort: field.sort ?? null },
    });
  }

  await upsertRelation(baseUrl, token, {
    collection: translationsCollection,
    field: parentFk,
    related_collection: collection,
    meta: {
      one_field: "translations",
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: languageFk,
    },
    schema: { on_delete: "SET NULL" },
  });

  await upsertRelation(baseUrl, token, {
    collection: translationsCollection,
    field: languageFk,
    related_collection: "languages",
    meta: {
      one_field: null,
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: parentFk,
    },
    schema: { on_delete: "SET NULL" },
  });

  await addField(baseUrl, token, collection, {
    field: "translations",
    type: "alias",
    meta: {
      interface: "translations",
      special: ["translations"],
      options: TRANSLATIONS_ALIAS_OPTIONS,
    },
  });

  await repairTranslations(baseUrl, token, collection);
}

async function addPlainFields(baseUrl, token, collection, fields) {
  for (const field of fields) {
    await addField(baseUrl, token, collection, {
      field: field.name,
      type: field.type ?? "string",
      meta: {
        interface: field.interface ?? "input",
        required: field.required ?? false,
        width: field.width ?? "half",
        note: field.note,
        options: field.options,
      },
      schema: {
        is_nullable: field.required ? false : true,
        default_value: field.default_value,
      },
    });
  }
}

async function ensureSingletonItem(baseUrl, token, collection) {
  const existing = await request(baseUrl, token, `/items/${collection}`);

  if (existing.data?.id) {
    return existing.data.id;
  }

  const created = await request(baseUrl, token, `/items/${collection}`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });

  return created.data.id;
}

async function upsertTranslation(baseUrl, token, collection, parentId, languageCode, values) {
  const translationsCollection = `${collection}_translations`;
  const parentFk = `${collection}_id`;

  const filter = {
    _and: [
      { [parentFk]: { _eq: parentId } },
      { languages_code: { _eq: languageCode } },
    ],
  };

  const existing = await request(
    baseUrl,
    token,
    `/items/${translationsCollection}?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1`,
  );

  const payload = {
    [parentFk]: parentId,
    languages_code: languageCode,
    ...values,
  };

  if (existing.data?.length) {
    await request(
      baseUrl,
      token,
      `/items/${translationsCollection}/${existing.data[0].id}`,
      { method: "PATCH", body: JSON.stringify(values) },
    );
    return;
  }

  await request(baseUrl, token, `/items/${translationsCollection}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function upsertItemByKey(baseUrl, token, collection, keyField, keyValue, plainValues = {}) {
  const filter = { [keyField]: { _eq: keyValue } };
  const existing = await request(
    baseUrl,
    token,
    `/items/${collection}?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1`,
  );

  if (existing.data?.length) {
    if (Object.keys(plainValues).length) {
      await request(
        baseUrl,
        token,
        `/items/${collection}/${existing.data[0].id}`,
        { method: "PATCH", body: JSON.stringify(plainValues) },
      );
    }
    return existing.data[0].id;
  }

  const created = await request(baseUrl, token, `/items/${collection}`, {
    method: "POST",
    body: JSON.stringify({ [keyField]: keyValue, ...plainValues }),
  });

  return created.data.id;
}

async function readLegacyTranslation(baseUrl, token, collection, languageCode) {
  try {
    const response = await request(
      baseUrl,
      token,
      `/items/${collection}?fields=*,translations.*&limit=1`,
    );
    const item = response.data?.id ? response.data : response.data?.[0];
    if (!item?.translations?.length) {
      return null;
    }

    return (
      item.translations.find((row) => row.languages_code === languageCode) ??
      item.translations[0]
    );
  } catch {
    return null;
  }
}

async function migrateLegacyPageContent(baseUrl, token, languageCode) {
  const globalTargetId = await ensureSingletonItem(baseUrl, token, "fd_page_global");
  const globalSource = await readLegacyTranslation(
    baseUrl,
    token,
    LEGACY_GLOBAL_MIGRATION.source,
    languageCode,
  );

  if (globalSource) {
    const globalValues = {};
    for (const [oldKey, newKey] of Object.entries(LEGACY_GLOBAL_MIGRATION.map)) {
      if (globalSource[oldKey] !== undefined && globalSource[oldKey] !== null) {
        globalValues[newKey] = globalSource[oldKey];
      }
    }
    if (Object.keys(globalValues).length) {
      await upsertTranslation(
        baseUrl,
        token,
        "fd_page_global",
        globalTargetId,
        languageCode,
        globalValues,
      );
    }
  }

  const homeTargetId = await ensureSingletonItem(baseUrl, token, "fd_page_home");
  const homeValues = {};

  for (const { source, map } of LEGACY_HOME_MIGRATION) {
    const legacy = await readLegacyTranslation(baseUrl, token, source, languageCode);
    if (!legacy) continue;

    for (const [oldKey, newKey] of Object.entries(map)) {
      if (legacy[oldKey] !== undefined && legacy[oldKey] !== null) {
        homeValues[newKey] = legacy[oldKey];
      }
    }
  }

  if (Object.keys(homeValues).length) {
    await upsertTranslation(baseUrl, token, "fd_page_home", homeTargetId, languageCode, homeValues);
  }

  const aboutTargetId = await ensureSingletonItem(baseUrl, token, "fd_page_about");
  const aboutValues = {};

  for (const { source, map } of LEGACY_ABOUT_MIGRATION) {
    const legacy = await readLegacyTranslation(baseUrl, token, source, languageCode);
    if (!legacy) continue;

    for (const [oldKey, newKey] of Object.entries(map)) {
      if (legacy[oldKey] !== undefined && legacy[oldKey] !== null) {
        aboutValues[newKey] = legacy[oldKey];
      }
    }
  }

  if (Object.keys(aboutValues).length) {
    await upsertTranslation(
      baseUrl,
      token,
      "fd_page_about",
      aboutTargetId,
      languageCode,
      aboutValues,
    );
  }

  const investTargetId = await ensureSingletonItem(baseUrl, token, "fd_page_invest");
  const investSource = await readLegacyTranslation(
    baseUrl,
    token,
    LEGACY_INVEST_MIGRATION.source,
    languageCode,
  );

  if (investSource) {
    const investValues = {};
    for (const [oldKey, newKey] of Object.entries(LEGACY_INVEST_MIGRATION.map)) {
      if (investSource[oldKey] !== undefined && investSource[oldKey] !== null) {
        investValues[newKey] = investSource[oldKey];
      }
    }
    if (Object.keys(investValues).length) {
      await upsertTranslation(
        baseUrl,
        token,
        "fd_page_invest",
        investTargetId,
        languageCode,
        investValues,
      );
    }
  }

  console.log(`Migrated legacy section content into page collections (${languageCode})`);
}

async function ensureLanguages(baseUrl, token) {
  const languagesExist = await collectionExists(baseUrl, token, "languages");

  if (!languagesExist) {
    await request(baseUrl, token, "/collections", {
      method: "POST",
      body: JSON.stringify({
        collection: "languages",
        meta: {
          collection: "languages",
          icon: "translate",
          display_template: "{{name}} ({{code}})",
          sort_field: "sort",
        },
        schema: {},
        fields: [
          {
            field: "code",
            type: "string",
            meta: { interface: "input", required: true, width: "half" },
            schema: { is_primary_key: true, length: 10, is_nullable: false },
          },
          {
            field: "name",
            type: "string",
            meta: { interface: "input", required: true, width: "half" },
            schema: { is_nullable: false },
          },
          {
            field: "direction",
            type: "string",
            meta: {
              interface: "select-dropdown",
              options: {
                choices: [
                  { text: "LTR", value: "ltr" },
                  { text: "RTL", value: "rtl" },
                ],
              },
            },
            schema: { default_value: "ltr", is_nullable: false },
          },
          {
            field: "sort",
            type: "integer",
            meta: { interface: "input", hidden: true },
            schema: { is_nullable: true },
          },
        ],
      }),
    });

    await request(baseUrl, token, "/items/languages", {
      method: "POST",
      body: JSON.stringify([
        { code: "cs-CZ", name: "Čeština", direction: "ltr", sort: 1 },
        { code: "en-US", name: "English", direction: "ltr", sort: 2 },
      ]),
    });
    return;
  }

  await addField(baseUrl, token, "languages", {
    field: "sort",
    type: "integer",
    meta: { interface: "input", hidden: true },
    schema: { is_nullable: true },
  });

  await request(baseUrl, token, "/collections/languages", {
    method: "PATCH",
    body: JSON.stringify({
      meta: {
        hidden: true,
        display_template: "{{name}} ({{code}})",
        sort_field: "sort",
        note: "Admin only – jazyky webu. Editor je nevidí, ale potřebuje read pro překlady.",
      },
    }),
  }).catch(() => {});

  for (const [code, sort] of [
    ["cs-CZ", 1],
    ["en-US", 2],
  ]) {
    await request(baseUrl, token, `/items/languages/${code}`, {
      method: "PATCH",
      body: JSON.stringify({ sort }),
    }).catch(() => {});
  }
}

async function setupSchema(baseUrl, token) {
  await ensureLanguages(baseUrl, token);

  for (const def of SCHEMA) {
    console.log(`Setting up ${def.collection}...`);
    await createCollection(baseUrl, token, def.collection, {
      singleton: def.singleton ?? false,
      icon: def.icon,
    });

    if (def.plain?.length) {
      await addPlainFields(baseUrl, token, def.collection, def.plain);
    }

    if (def.translations?.length) {
      await setupTranslations(baseUrl, token, def.collection, def.translations);
    }
  }

  console.log("Repairing translations relations...");
  await repairTranslationFormLayout(baseUrl, token, SCHEMA);
  for (const def of SCHEMA) {
    if (def.translations?.length) {
      await repairTranslations(baseUrl, token, def.collection);
    }
  }

  // Hide legacy JSON collection from editors
  if (await collectionExists(baseUrl, token, "fire_drone_content")) {
    await request(baseUrl, token, "/collections/fire_drone_content", {
      method: "PATCH",
      body: JSON.stringify({ meta: { hidden: true, note: "Deprecated – use fd_* collections" } }),
    }).catch(() => {});
    console.log("Hidden legacy fire_drone_content collection");
  }

  console.log("Applying bilingual labels...");
  await applySchemaLabels(baseUrl, token, SCHEMA, {
    request,
    patchField,
    collectionExists,
  });

  console.log("Applying list view displays...");
  await applyCollectionDisplays(baseUrl, token, {
    request,
    patchField,
    collectionExists,
  });

  console.log("Creating firedron folder structure...");
  await ensureFolderStructure(baseUrl, token, { collectionExists, request });
  await organizeCollections(baseUrl, token, { request });
}

async function seedContent(baseUrl, token) {
  const globalId = await ensureSingletonItem(baseUrl, token, "fd_page_global");
  await upsertTranslation(baseUrl, token, "fd_page_global", globalId, CS, {
    site_title: "DOFEC",
    site_description: "DOFEC autonomous drone fire-fighting platform.",
    footer_copyright: "© 2026 DOFEC All rights reserved",
    a11y_open_menu: "Otevřít menu",
    a11y_close_menu: "Zavřít menu",
    a11y_mobile_nav_label: "Mobilní menu",
    a11y_logo_label: "DOFEC",
  });

  const navItems = [
    { sort: 1, href: "/about-us", label: "About us" },
    { sort: 2, href: "/invest", label: "Invest" },
    { sort: 3, href: "#career", label: "Career" },
    { sort: 4, href: "#contact", label: "Contact" },
  ];

  for (const item of navItems) {
    const id = await upsertItemByKey(baseUrl, token, "fd_nav_item", "sort", item.sort, {
      href: item.href,
    });
    await upsertTranslation(baseUrl, token, "fd_nav_item", id, CS, { label: item.label });
  }

  const homeId = await ensureSingletonItem(baseUrl, token, "fd_page_home");
  await upsertTranslation(baseUrl, token, "fd_page_home", homeId, CS, {
    hero_eyebrow: "Fire Fighting with Autonomous Drones",
    hero_title: "Get eyes on the scene faster to keep your team and people safe",
    hero_description:
      "An autonomous drone can help firefighters make informed decisions faster, deploy the right resources, and stay safe in real time.",
    hero_primary_cta: "Demo video",
    hero_secondary_cta: "Contact us",
    hero_image_alt: "DOFEC autonomous drone hero visual",
    autonomous_title: "100% Autonomous",
    autonomous_description:
      "With impressive capabilities, the drone can locate, track, and extinguish fires with minimal human input while continuously relaying thermal intelligence back to command units.",
    autonomous_callout_label: "Rotor performance: 124kW",
    fire_split_description:
      "Fire fighting teams can formulate an effective strategy to extinguish the fire and save as many lives as possible. This feature has the potential to be highly beneficial for search and rescue missions, as well as providing real-time updates on the situation.",
    fire_split_right_image_alt: "DOFEC drone rendered on the side information card",
    effective_left_title: "Effective",
    effective_left_description: "Krátký text o tom jak jsou effektivní, že prorazí sklo atd.",
    effective_left_cta: "Play video",
    effective_right_title: "Locate and intervention",
    effective_right_description:
      "DOFEC™ is equipped with a launcher that can fire fire-extinguishing capsules during flight. In addition to its fire-fighting abilities, the drone also features onboard cameras. These cameras enable it to locate people and animals not visible to normal RGB cameras, which helps to gather crucial information about the disaster-struck area.",
    quote_video_quote:
      "Důležitý citát,který je obsažen ve videu a vysvětluje buď misi značky nebo důležité USP dronu, případně celé služby, kterou nabízíme.",
    quote_video_author: "Konrád Španěl | Ředitel ZHS PRAHA",
    quote_video_thumbnail_alt: "Produktové video DOFEC – dočasný náhled",
    quote_video_play_label: "Přehrát představení produktu",
    faster_title: "Faster is Better",
    faster_accent: "(and safer)",
    faster_description:
      "Text o tom, jak hasiči přijedou a dron jde hnedka do vzduchu jak rychle je připraven do akce, kolik to ušetří času a co všechno to přinese za benefity\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla quis diam. Praesent id justo in neque elementum ultrices.",
    faster_multiplier: "3×",
    faster_cta_label: "Play video",
    faster_right_title: "Integrated",
    faster_right_description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nulla quis diam. Praesent id justo in neque elementum ultrices.",
    faster_integrated_image_alt: "Integrated device view",
    timeline_title: "Before, during, and after the fire",
    timeline_description:
      "DOFEC supports prevention, active intervention, and post-fire monitoring with one continuous autonomous workflow.",
    timeline_cta: "Play video",
    timeline_background_alt: "Forest fire response background",
    timeline_drone_alt: "DOFEC drone overlay",
    timeline_quote_quote:
      "Důležitý citát,který je obsažen ve videu a vysvětluje buď misi značky nebo důležité USP dronu, případně celé služby, kterou nabízíme.",
    timeline_quote_author: "Konrád Španěl | Ředitel ZHS PRAHA",
    exploded_image_alt: "Exploded drone system with labeled components",
    contact_title: "Stay in touch",
    contact_description:
      "Are you interested in DOFEC? We can contact you online or visit your team and present DOFEC in action.",
    contact_primary_cta: "Kontaktovat",
    contact_secondary_cta: "Chci nabídku do mailu",
  });

  for (const [index, hotspot] of [
    { key: "hotspot-one", label: "Rotor performance: 124kW" },
    { key: "hotspot-two", label: "Autonomy engine: area tracking" },
  ].entries()) {
    const id = await upsertItemByKey(baseUrl, token, "fd_home_autonomous_hotspot", "hotspot_key", hotspot.key, {
      sort: index + 1,
    });
    await upsertTranslation(baseUrl, token, "fd_home_autonomous_hotspot", id, CS, { label: hotspot.label });
  }

  for (const [index, slide] of [
    { key: "fire-scene-1", alt: "Fire response mission with flames and responders" },
    { key: "fire-scene-2", alt: "Firefighting action at night" },
    { key: "fire-scene-3", alt: "Thermal-guided intervention support" },
  ].entries()) {
    const id = await upsertItemByKey(baseUrl, token, "fd_home_carousel_slide", "slide_key", slide.key, {
      sort: index + 1,
    });
    await upsertTranslation(baseUrl, token, "fd_home_carousel_slide", id, CS, { image_alt: slide.alt });
  }

  for (const [index, ann] of [
    { key: "ann-1", label: "Advanced sensor suite" },
    { key: "ann-2", label: "Thermal imaging module" },
    { key: "ann-3", label: "Capsule release system" },
    { key: "ann-4", label: "Mission computer" },
    { key: "ann-5", label: "Autonomous flight control" },
    { key: "ann-6", label: "High-thrust rotor platform" },
  ].entries()) {
    const id = await upsertItemByKey(baseUrl, token, "fd_home_exploded_annotation", "annotation_key", ann.key, {
      sort: index + 1,
    });
    await upsertTranslation(baseUrl, token, "fd_home_exploded_annotation", id, CS, { label: ann.label });
  }

  const aboutId = await ensureSingletonItem(baseUrl, token, "fd_page_about");
  await upsertTranslation(baseUrl, token, "fd_page_about", aboutId, CS, {
    meta_title: "About us | DOFEC",
    meta_description: "Learn more about the DOFEC team, mission, and field experience.",
    hero_title: "About us",
    cta_title: "Call to actions",
    cta_primary_label: "Call to Action",
    cta_secondary_label: "Call to Action",
    list_title: "Odrážky a seznam",
    quote_title: "Citace",
    quote_quote:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt ante vitae massa. Nunc auctor. Cras elementum. Duis condimentum augue id magna semper rutrum. Nullam dapibus fermentum ipsum. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam.",
    quote_author: "Konrád Španěl | Ředitel ZHS PRAHA",
    exploded_title: "Obrázek",
    gallery_title: "Galerie",
    contact_title: "Stay in touch",
    contact_description:
      "Are you interested in DOFEC™? We can contact you online and tell you more or come to you in person and present DOFEC™ in action.",
    contact_primary_cta: "Kontaktovat",
    contact_secondary_cta: "Chci nabídku do mailu",
  });

  const lorem =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.";

  for (const [index, block] of [
    "Headline H1",
    "Headline H2",
    "Headline H3",
    "Headline H4",
    "Headline H5",
    "Small text",
  ].entries()) {
    const id = await upsertItemByKey(baseUrl, token, "fd_about_text_block", "sort", index + 1, {});
    await upsertTranslation(baseUrl, token, "fd_about_text_block", id, CS, {
      title: block,
      body: lorem,
    });
  }

  const listColumns = [
    Array(5).fill("Lorem ipsum dolor sit amet"),
    Array(5).fill("Consectetuer adipiscing elit"),
    Array(5).fill("Lorem ipsum dolor sit amet"),
    Array(5).fill("Consectetuer adipiscing elit"),
  ];

  for (const [columnIndex, column] of listColumns.entries()) {
    for (const [sort, text] of column.entries()) {
      const filter = {
        _and: [
          { column_index: { _eq: columnIndex } },
          { sort: { _eq: sort + 1 } },
        ],
      };
      const existing = await request(
        baseUrl,
        token,
        `/items/fd_about_list_item?filter=${encodeURIComponent(JSON.stringify(filter))}&limit=1`,
      );
      let id = existing.data?.[0]?.id;
      if (!id) {
        const created = await request(baseUrl, token, "/items/fd_about_list_item", {
          method: "POST",
          body: JSON.stringify({ column_index: columnIndex, sort: sort + 1 }),
        });
        id = created.data.id;
      }
      await upsertTranslation(baseUrl, token, "fd_about_list_item", id, CS, { text });
    }
  }

  const investId = await ensureSingletonItem(baseUrl, token, "fd_page_invest");
  await upsertTranslation(baseUrl, token, "fd_page_invest", investId, CS, {
    meta_title: "Invest | DOFEC",
    meta_description: "Download investor documents for DOFEC.",
    hero_title: "Invest",
    hero_description: "Some description",
  });

  for (const [index, doc] of [
    {
      href: "/documents/investor-deck.pdf",
      title: "Investor Deck",
      description: "Company overview, product summary, and market opportunity.",
    },
    {
      href: "/documents/financial-highlights.pdf",
      title: "Financial Highlights",
      description: "Key financial metrics and annual performance highlights.",
    },
    {
      href: "/documents/legal-corporate.pdf",
      title: "Legal & Corporate",
      description: "Basic legal and corporate documents for due diligence.",
    },
  ].entries()) {
    const id = await upsertItemByKey(baseUrl, token, "fd_invest_document", "href", doc.href, {
      sort: index + 1,
    });
    await upsertTranslation(baseUrl, token, "fd_invest_document", id, CS, {
      title: doc.title,
      description: doc.description,
      download_label: "Download document",
    });
  }

  console.log("Seeded Czech translations (cs-CZ)");
}

async function main() {
  const { DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD } = loadEnv();
  if (!DIRECTUS_ADMIN_EMAIL || !DIRECTUS_ADMIN_PASSWORD) {
    throw new Error("Missing Directus credentials");
  }

  const baseUrl = getBaseUrl(DIRECTUS_URL);
  const token = await login(baseUrl, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD);

  console.log("Creating schema...");
  await setupSchema(baseUrl, token);
  console.log("Migrating legacy content...");
  await migrateLegacyPageContent(baseUrl, token, CS);
  console.log("Seeding content...");
  await seedContent(baseUrl, token);
  console.log("Hiding legacy collections...");
  await hideLegacyCollections(baseUrl, token, { collectionExists, request });
  console.log("Syncing API read permissions...");
  await syncFiredronPermissions(baseUrl, token).catch((error) => {
    console.warn(String(error.message));
  });
  console.log("Setting Czech as default Directus UI language...");
  await syncDirectusUiLanguage(baseUrl, token).catch((error) => {
    console.warn(String(error.message));
  });
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
