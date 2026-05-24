/**
 * List-view display templates so editors see actual copy instead of "translations [1]".
 */

/** @typedef {{ collectionTemplate: string, translationsTemplate: string }} CollectionDisplay */

/** @type {Record<string, CollectionDisplay>} */
export const COLLECTION_DISPLAYS = {
  fd_page_global: {
    collectionTemplate: "{{translations}}",
    translationsTemplate: "{{site_title}}",
  },
  fd_page_home: {
    collectionTemplate: "{{translations}}",
    translationsTemplate: "{{hero_title}}",
  },
  fd_page_about: {
    collectionTemplate: "{{translations}}",
    translationsTemplate: "{{hero_title}}",
  },
  fd_page_invest: {
    collectionTemplate: "{{translations}}",
    translationsTemplate: "{{hero_title}}",
  },
  fd_nav_item: {
    collectionTemplate: "{{sort}} · {{translations}} · {{href}}",
    translationsTemplate: "{{label}}",
  },
  fd_home_autonomous_hotspot: {
    collectionTemplate: "{{hotspot_key}} · {{translations}}",
    translationsTemplate: "{{label}}",
  },
  fd_home_carousel_slide: {
    collectionTemplate: "{{slide_key}} · {{translations}}",
    translationsTemplate: "{{image_alt}}",
  },
  fd_home_exploded_annotation: {
    collectionTemplate: "{{annotation_key}} · {{translations}}",
    translationsTemplate: "{{label}}",
  },
  fd_about_text_block: {
    collectionTemplate: "{{sort}} · {{translations}}",
    translationsTemplate: "{{title}}",
  },
  fd_about_list_item: {
    collectionTemplate: "sloupec {{column_index}} · {{sort}} · {{translations}}",
    translationsTemplate: "{{text}}",
  },
  fd_invest_document: {
    collectionTemplate: "{{sort}} · {{translations}} · {{href}}",
    translationsTemplate: "{{title}}",
  },
};

/**
 * @param {string} baseUrl
 * @param {string} token
 * @param {{ request: Function, patchField: Function, collectionExists: Function }} helpers
 */
export async function applyCollectionDisplays(baseUrl, token, { request, patchField, collectionExists }) {
  for (const [collection, config] of Object.entries(COLLECTION_DISPLAYS)) {
    if (!(await collectionExists(baseUrl, token, collection))) {
      continue;
    }

    await request(baseUrl, token, `/collections/${collection}`, {
      method: "PATCH",
      body: JSON.stringify({
        meta: {
          display_template: config.collectionTemplate,
        },
      }),
    }).catch(() => {});

    await patchField(baseUrl, token, collection, "translations", {
      meta: {
        display: "translations",
        display_options: {
          template: config.translationsTemplate,
        },
      },
    });
  }

  console.log("Applied collection list displays (translations preview text)");
}
