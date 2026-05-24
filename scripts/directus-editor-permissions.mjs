/**
 * Editor-safe Directus permissions for the Firedron customer role.
 *
 * Editors may change translatable copy only. Structural data (URLs, sort order,
 * technical keys, languages) stays admin-only.
 */
import { SCHEMA } from "./directus-page-schema.mjs";

/**
 * Collections the editor must not manage (no create/update/delete).
 * `languages` still needs read access for the translations UI to load tabs.
 */
export const EDITOR_RESTRICTED_COLLECTIONS = ["languages"];

/** Parent collections: read + update translations alias only (no create/delete). */
export function buildEditorParentRules() {
  /** @type {{ collection: string, action: string, fields: string[] }[]} */
  const rules = [];

  for (const def of SCHEMA) {
    rules.push({ collection: def.collection, action: "read", fields: ["*"] });

    if (def.translations?.length) {
      rules.push({
        collection: def.collection,
        action: "update",
        // Singletons have no structural plain fields – full update is safe.
        // List collections keep href/sort/keys locked via field-scoped update.
        fields: def.singleton ? ["*"] : ["translations"],
      });
    }
  }

  return rules;
}

function getJunctionWritableFields(def) {
  const copyFields = def.translations.map((field) => field.name);
  const parentFk = `${def.collection}_id`;

  return [...copyFields, "languages_code", parentFk];
}

/** Junction collections: read/create/update copy fields (no delete). */
export function buildEditorJunctionRules() {
  /** @type {{ collection: string, action: string, fields: string[] }[]} */
  const rules = [];

  for (const def of SCHEMA) {
    if (!def.translations?.length) {
      continue;
    }

    const junction = `${def.collection}_translations`;
    const writableFields = getJunctionWritableFields(def);

    rules.push({ collection: junction, action: "read", fields: ["*"] });
    rules.push({ collection: junction, action: "create", fields: writableFields });
    rules.push({ collection: junction, action: "update", fields: writableFields });
  }

  return rules;
}

/** Read-only access to languages – required for translation tabs, not shown in sidebar. */
export function buildEditorLanguagesRules() {
  return [{ collection: "languages", action: "read", fields: ["*"] }];
}

/** Full replace set for the Firedron Editor policy. */
export function buildEditorPermissionRules() {
  return [
    ...buildEditorParentRules(),
    ...buildEditorJunctionRules(),
    ...buildEditorLanguagesRules(),
  ];
}

/** API read-only access for all Firedron content collections. */
export function getApiReadableCollections(allCollections) {
  return allCollections.filter(
    (collection) =>
      collection.startsWith("fd_") || collection === "languages",
  );
}
