/**
 * Page-oriented Directus schema for the Fire Drone CMS.
 * One singleton collection per site area + list collections for repeatable items.
 */

/** @typedef {{ name: string, type?: string, interface?: string, required?: boolean, note?: string, sort?: number, width?: string, options?: object }} TranslationField */

/** @typedef {{ collection: string, singleton?: boolean, icon?: string, plain?: TranslationField[], translations?: TranslationField[] }} CollectionDef */

export const ROOT_FOLDER = "firedron";

/** Orphan group fields from an earlier schema – removed by repairTranslationFormLayout. */
export const DEPRECATED_GROUP_FIELD_KEYS = [
  "grp_01_hero",
  "grp_02_autonomous",
  "grp_03_fire_split",
  "grp_04_effective_locate",
  "grp_05_quote_video",
  "grp_06_faster_integrated",
  "grp_07_timeline",
  "grp_08_timeline_quote",
  "grp_09_exploded",
  "grp_10_contact",
  "grp_01_seo",
  "grp_02_cta",
  "grp_03_list",
  "grp_04_quote",
  "grp_05_media",
  "grp_06_contact",
  "grp_01_invest_hero",
  "grp_02_documents",
  "grp_global",
];

export const PAGE_FOLDERS = [
  {
    collection: "firedron_shared",
    parent: ROOT_FOLDER,
    icon: "public",
    labels: {
      cs: "Společné",
      en: "Shared",
      noteCs: "Texty společné pro celý web",
      noteEn: "Site-wide shared content",
    },
  },
  {
    collection: "firedron_home",
    parent: ROOT_FOLDER,
    icon: "home",
    labels: {
      cs: "Homepage",
      en: "Homepage",
      noteCs: "Veškerý obsah úvodní stránky",
      noteEn: "All homepage content",
    },
  },
  {
    collection: "firedron_about",
    parent: ROOT_FOLDER,
    icon: "info",
    labels: {
      cs: "O nás",
      en: "About us",
      noteCs: "Veškerý obsah stránky O nás",
      noteEn: "All About us page content",
    },
  },
  {
    collection: "firedron_invest",
    parent: ROOT_FOLDER,
    icon: "paid",
    labels: {
      cs: "Invest",
      en: "Invest",
      noteCs: "Veškerý obsah investiční stránky",
      noteEn: "All Invest page content",
    },
  },
];

/** Sidebar placement: Directus `meta.group` + sort order. */
export const COLLECTION_PLACEMENT = {
  fd_page_global: { group: "firedron_shared", sort: 1 },
  fd_nav_item: { group: "firedron_shared", sort: 2 },
  fd_page_home: { group: "firedron_home", sort: 1 },
  fd_home_autonomous_hotspot: { group: "firedron_home", sort: 2 },
  fd_home_carousel_slide: { group: "firedron_home", sort: 3 },
  fd_home_exploded_annotation: { group: "firedron_home", sort: 4 },
  fd_page_about: { group: "firedron_about", sort: 1 },
  fd_about_text_block: { group: "firedron_about", sort: 2 },
  fd_about_list_item: { group: "firedron_about", sort: 3 },
  fd_page_invest: { group: "firedron_invest", sort: 1 },
  fd_invest_document: { group: "firedron_invest", sort: 2 },
};

/** Legacy per-section collections hidden after migration. */
export const LEGACY_COLLECTIONS = [
  "fd_global",
  "fd_home_hero",
  "fd_home_autonomous",
  "fd_home_fire_split",
  "fd_home_effective_locate",
  "fd_home_quote_video",
  "fd_home_faster_integrated",
  "fd_home_timeline",
  "fd_home_timeline_quote",
  "fd_home_exploded",
  "fd_home_contact",
  "fd_about_page",
  "fd_about_cta",
  "fd_about_list",
  "fd_about_quote",
  "fd_about_exploded",
  "fd_about_gallery",
  "fd_about_contact",
  "fd_invest_page",
];

/** @type {CollectionDef[]} */
export const SCHEMA = [
  {
    collection: "fd_page_global",
    singleton: true,
    icon: "public",
    translations: [
      { name: "site_title", sort: 1, required: true },
      { name: "site_description", sort: 2, type: "text", interface: "input-multiline" },
      { name: "footer_copyright", sort: 3 },
      { name: "a11y_open_menu", sort: 4 },
      { name: "a11y_close_menu", sort: 5 },
      { name: "a11y_mobile_nav_label", sort: 6 },
      { name: "a11y_logo_label", sort: 7 },
    ],
  },
  {
    collection: "fd_nav_item",
    icon: "menu",
    plain: [
      { name: "sort", type: "integer", interface: "input", required: true },
      { name: "href", required: true },
    ],
    translations: [{ name: "label", sort: 1, required: true }],
  },
  {
    collection: "fd_page_home",
    singleton: true,
    icon: "home",
    translations: [
      { name: "hero_eyebrow", sort: 11 },
      { name: "hero_title", sort: 12, required: true },
      { name: "hero_description", sort: 13, type: "text", interface: "input-multiline" },
      { name: "hero_primary_cta", sort: 14 },
      { name: "hero_secondary_cta", sort: 15 },
      { name: "hero_image_alt", sort: 16 },
      { name: "autonomous_title", sort: 21, required: true },
      { name: "autonomous_description", sort: 22, type: "text", interface: "input-multiline" },
      { name: "autonomous_callout_label", sort: 23 },
      { name: "fire_split_description", sort: 31, type: "text", interface: "input-multiline" },
      { name: "fire_split_right_image_alt", sort: 32 },
      { name: "effective_left_title", sort: 41 },
      { name: "effective_left_description", sort: 42, type: "text", interface: "input-multiline" },
      { name: "effective_left_cta", sort: 43 },
      { name: "effective_right_title", sort: 44 },
      { name: "effective_right_description", sort: 45, type: "text", interface: "input-multiline" },
      { name: "quote_video_quote", sort: 51, type: "text", interface: "input-multiline" },
      { name: "quote_video_author", sort: 52 },
      { name: "quote_video_thumbnail_alt", sort: 53 },
      { name: "quote_video_play_label", sort: 54 },
      { name: "faster_title", sort: 61, required: true },
      { name: "faster_accent", sort: 62 },
      { name: "faster_description", sort: 63, type: "text", interface: "input-multiline" },
      { name: "faster_multiplier", sort: 64 },
      { name: "faster_cta_label", sort: 65 },
      { name: "faster_right_title", sort: 66 },
      { name: "faster_right_description", sort: 67, type: "text", interface: "input-multiline" },
      { name: "faster_integrated_image_alt", sort: 68 },
      { name: "timeline_title", sort: 71, required: true },
      { name: "timeline_description", sort: 72, type: "text", interface: "input-multiline" },
      { name: "timeline_cta", sort: 73 },
      { name: "timeline_background_alt", sort: 74 },
      { name: "timeline_drone_alt", sort: 75 },
      { name: "timeline_quote_quote", sort: 81, type: "text", interface: "input-multiline" },
      { name: "timeline_quote_author", sort: 82 },
      { name: "exploded_image_alt", sort: 91 },
      { name: "contact_title", sort: 101, required: true },
      { name: "contact_description", sort: 102, type: "text", interface: "input-multiline" },
      { name: "contact_primary_cta", sort: 103 },
      { name: "contact_secondary_cta", sort: 104 },
    ],
  },
  {
    collection: "fd_home_autonomous_hotspot",
    icon: "place",
    plain: [
      { name: "hotspot_key", required: true },
      { name: "sort", type: "integer", interface: "input", required: true },
    ],
    translations: [{ name: "label", sort: 1, required: true }],
  },
  {
    collection: "fd_home_carousel_slide",
    icon: "collections",
    plain: [
      { name: "slide_key", required: true },
      { name: "sort", type: "integer", required: true },
    ],
    translations: [{ name: "image_alt", sort: 1, required: true }],
  },
  {
    collection: "fd_home_exploded_annotation",
    icon: "label",
    plain: [
      { name: "annotation_key", required: true },
      { name: "sort", type: "integer", required: true },
    ],
    translations: [{ name: "label", sort: 1, required: true }],
  },
  {
    collection: "fd_page_about",
    singleton: true,
    icon: "info",
    translations: [
      { name: "meta_title", sort: 11 },
      { name: "meta_description", sort: 12, type: "text", interface: "input-multiline" },
      { name: "hero_title", sort: 13, required: true },
      { name: "cta_title", sort: 21, required: true },
      { name: "cta_primary_label", sort: 22 },
      { name: "cta_secondary_label", sort: 23 },
      { name: "list_title", sort: 31, required: true },
      { name: "quote_title", sort: 41 },
      { name: "quote_quote", sort: 42, type: "text", interface: "input-multiline" },
      { name: "quote_author", sort: 43 },
      { name: "exploded_title", sort: 51, required: true },
      { name: "gallery_title", sort: 52, required: true },
      { name: "contact_title", sort: 61, required: true },
      { name: "contact_description", sort: 62, type: "text", interface: "input-multiline" },
      { name: "contact_primary_cta", sort: 63 },
      { name: "contact_secondary_cta", sort: 64 },
    ],
  },
  {
    collection: "fd_about_text_block",
    icon: "article",
    plain: [{ name: "sort", type: "integer", required: true }],
    translations: [
      { name: "title", sort: 1, required: true },
      { name: "body", sort: 2, type: "text", interface: "input-multiline", required: true },
    ],
  },
  {
    collection: "fd_about_list_item",
    icon: "list",
    plain: [
      { name: "column_index", type: "integer", required: true },
      { name: "sort", type: "integer", required: true },
    ],
    translations: [{ name: "text", sort: 1, required: true }],
  },
  {
    collection: "fd_page_invest",
    singleton: true,
    icon: "paid",
    translations: [
      { name: "meta_title", sort: 11 },
      { name: "meta_description", sort: 12, type: "text", interface: "input-multiline" },
      { name: "hero_title", sort: 13, required: true },
      { name: "hero_description", sort: 14, type: "text", interface: "input-multiline" },
    ],
  },
  {
    collection: "fd_invest_document",
    icon: "description",
    plain: [
      { name: "sort", type: "integer", required: true },
      { name: "href", required: true },
    ],
    translations: [
      { name: "title", sort: 1, required: true },
      { name: "description", sort: 2, type: "text", interface: "input-multiline" },
      { name: "download_label", sort: 3, required: true },
    ],
  },
];

/** Maps legacy singleton collections → new page field names. */
export const LEGACY_HOME_MIGRATION = [
  {
    source: "fd_home_hero",
    map: {
      eyebrow: "hero_eyebrow",
      title: "hero_title",
      description: "hero_description",
      primary_cta: "hero_primary_cta",
      secondary_cta: "hero_secondary_cta",
      image_alt: "hero_image_alt",
    },
  },
  {
    source: "fd_home_autonomous",
    map: {
      title: "autonomous_title",
      description: "autonomous_description",
      callout_label: "autonomous_callout_label",
    },
  },
  {
    source: "fd_home_fire_split",
    map: {
      description: "fire_split_description",
      right_image_alt: "fire_split_right_image_alt",
    },
  },
  {
    source: "fd_home_effective_locate",
    map: {
      left_title: "effective_left_title",
      left_description: "effective_left_description",
      left_cta: "effective_left_cta",
      right_title: "effective_right_title",
      right_description: "effective_right_description",
    },
  },
  {
    source: "fd_home_quote_video",
    map: {
      quote: "quote_video_quote",
      author: "quote_video_author",
      thumbnail_alt: "quote_video_thumbnail_alt",
      play_label: "quote_video_play_label",
    },
  },
  {
    source: "fd_home_faster_integrated",
    map: {
      title: "faster_title",
      accent: "faster_accent",
      description: "faster_description",
      multiplier: "faster_multiplier",
      cta_label: "faster_cta_label",
      right_title: "faster_right_title",
      right_description: "faster_right_description",
      integrated_image_alt: "faster_integrated_image_alt",
    },
  },
  {
    source: "fd_home_timeline",
    map: {
      title: "timeline_title",
      description: "timeline_description",
      cta: "timeline_cta",
      background_alt: "timeline_background_alt",
      drone_alt: "timeline_drone_alt",
    },
  },
  {
    source: "fd_home_timeline_quote",
    map: {
      quote: "timeline_quote_quote",
      author: "timeline_quote_author",
    },
  },
  {
    source: "fd_home_exploded",
    map: { image_alt: "exploded_image_alt" },
  },
  {
    source: "fd_home_contact",
    map: {
      title: "contact_title",
      description: "contact_description",
      primary_cta: "contact_primary_cta",
      secondary_cta: "contact_secondary_cta",
    },
  },
];

export const LEGACY_ABOUT_MIGRATION = [
  {
    source: "fd_about_page",
    map: {
      meta_title: "meta_title",
      meta_description: "meta_description",
      hero_title: "hero_title",
    },
  },
  {
    source: "fd_about_cta",
    map: {
      title: "cta_title",
      primary_label: "cta_primary_label",
      secondary_label: "cta_secondary_label",
    },
  },
  { source: "fd_about_list", map: { title: "list_title" } },
  {
    source: "fd_about_quote",
    map: { title: "quote_title", quote: "quote_quote", author: "quote_author" },
  },
  { source: "fd_about_exploded", map: { title: "exploded_title" } },
  { source: "fd_about_gallery", map: { title: "gallery_title" } },
  {
    source: "fd_about_contact",
    map: {
      title: "contact_title",
      description: "contact_description",
      primary_cta: "contact_primary_cta",
      secondary_cta: "contact_secondary_cta",
    },
  },
];

export const LEGACY_GLOBAL_MIGRATION = {
  source: "fd_global",
  target: "fd_page_global",
  map: {
    site_title: "site_title",
    site_description: "site_description",
    footer_copyright: "footer_copyright",
    a11y_open_menu: "a11y_open_menu",
    a11y_close_menu: "a11y_close_menu",
    a11y_mobile_nav_label: "a11y_mobile_nav_label",
    a11y_logo_label: "a11y_logo_label",
  },
};

export const LEGACY_INVEST_MIGRATION = {
  source: "fd_invest_page",
  target: "fd_page_invest",
  map: {
    meta_title: "meta_title",
    meta_description: "meta_description",
    hero_title: "hero_title",
    hero_description: "hero_description",
  },
};
