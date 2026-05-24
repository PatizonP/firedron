import { collectionTranslations } from "./directus-schema-labels.mjs";
import {
  COLLECTION_PLACEMENT,
  LEGACY_COLLECTIONS,
  PAGE_FOLDERS,
  ROOT_FOLDER,
} from "./directus-page-schema.mjs";

/**
 * @param {Function} collectionExists
 * @param {Function} request
 */
export async function ensureFolderStructure(baseUrl, token, { collectionExists, request }) {
  const rootLabels = collectionTranslations({
    cs: "Fire Drone",
    en: "Fire Drone",
    noteCs: "Obsah webu DOFEC / Fire Drone",
    noteEn: "DOFEC / Fire Drone website content",
  });

  if (!(await collectionExists(baseUrl, token, ROOT_FOLDER))) {
    await request(baseUrl, token, "/collections", {
      method: "POST",
      body: JSON.stringify({
        collection: ROOT_FOLDER,
        meta: {
          collection: ROOT_FOLDER,
          icon: "folder",
          hidden: false,
          ...rootLabels,
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
  } else {
    await request(baseUrl, token, `/collections/${ROOT_FOLDER}`, {
      method: "PATCH",
      body: JSON.stringify({
        meta: {
          icon: "folder",
          hidden: false,
          ...rootLabels,
        },
      }),
    }).catch(() => {});
  }

  for (const folder of PAGE_FOLDERS) {
    const labels = collectionTranslations(folder.labels);

    if (!(await collectionExists(baseUrl, token, folder.collection))) {
      await request(baseUrl, token, "/collections", {
        method: "POST",
        body: JSON.stringify({
          collection: folder.collection,
          meta: {
            collection: folder.collection,
            icon: folder.icon,
            group: folder.parent,
            hidden: false,
            ...labels,
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
    } else {
      await request(baseUrl, token, `/collections/${folder.collection}`, {
        method: "PATCH",
        body: JSON.stringify({
          meta: {
            icon: folder.icon,
            group: folder.parent,
            hidden: false,
            ...labels,
          },
        }),
      }).catch(() => {});
    }
  }
}

/**
 * @param {Function} request
 */
export async function organizeCollections(baseUrl, token, { request }) {
  for (const [collection, placement] of Object.entries(COLLECTION_PLACEMENT)) {
    await request(baseUrl, token, `/collections/${collection}`, {
      method: "PATCH",
      body: JSON.stringify({
        meta: {
          group: placement.group,
          sort: placement.sort,
          hidden: false,
        },
      }),
    }).catch(() => {});
  }

  console.log("Organized collections under firedron/ page folders");
}

/**
 * @param {Function} collectionExists
 * @param {Function} request
 */
export async function hideLegacyCollections(baseUrl, token, { collectionExists, request }) {
  for (const collection of LEGACY_COLLECTIONS) {
    if (!(await collectionExists(baseUrl, token, collection))) {
      continue;
    }

    const translationsCollection = `${collection}_translations`;
    const hasTranslations = await collectionExists(baseUrl, token, translationsCollection);

    await request(baseUrl, token, `/collections/${collection}`, {
      method: "PATCH",
      body: JSON.stringify({
        meta: {
          hidden: true,
          group: null,
          note: "Deprecated – use fd_page_* collections under firedron/",
        },
      }),
    }).catch(() => {});

    if (hasTranslations) {
      await request(baseUrl, token, `/collections/${translationsCollection}`, {
        method: "PATCH",
        body: JSON.stringify({ meta: { hidden: true } }),
      }).catch(() => {});
    }
  }

  console.log("Hidden legacy per-section collections");
}
