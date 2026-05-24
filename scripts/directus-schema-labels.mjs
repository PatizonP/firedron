/**
 * Bilingual (cs-CZ / en-US) labels for Fire Drone Directus collections and fields.
 * Used by setup-directus-schema.mjs to patch collection and field metadata.
 */

export const CS = "cs-CZ";
export const EN = "en-US";

/** @param {{ cs: string, en: string, noteCs?: string, noteEn?: string }} label */
export function fieldTranslations(label) {
  const meta = {
    translations: [
      { language: CS, translation: label.cs },
      { language: EN, translation: label.en },
    ],
  };

  if (label.noteCs || label.noteEn) {
    meta.note = [label.noteCs, label.noteEn].filter(Boolean).join(" / ");
  }

  return meta;
}

/** @param {{ cs: string, en: string, noteCs?: string, noteEn?: string }} label */
export function collectionTranslations(label) {
  const meta = {
    translations: [
      {
        language: CS,
        translation: label.cs,
        singular: label.cs,
        plural: label.cs,
      },
      {
        language: EN,
        translation: label.en,
        singular: label.en,
        plural: label.en,
      },
    ],
  };

  if (label.noteCs || label.noteEn) {
    meta.note = [label.noteCs, label.noteEn].filter(Boolean).join(" / ");
  }

  return meta;
}

/** Shared field labels reused across collections. */
export const SHARED_FIELDS = {
  translations: fieldTranslations({
    cs: "Překlady",
    en: "Translations",
    noteCs: "Obsah v jednotlivých jazycích",
    noteEn: "Content per language",
  }),
  sort: fieldTranslations({
    cs: "Pořadí",
    en: "Sort order",
    noteCs: "Určuje pořadí zobrazení (nižší = dříve)",
    noteEn: "Display order (lower = earlier)",
  }),
  href: fieldTranslations({
    cs: "Odkaz",
    en: "Link",
    noteCs: "Cesta nebo kotva, např. /about-us nebo #contact",
    noteEn: "Path or anchor, e.g. /about-us or #contact",
  }),
  label: fieldTranslations({
    cs: "Popisek",
    en: "Label",
  }),
  title: fieldTranslations({
    cs: "Nadpis",
    en: "Title",
  }),
  description: fieldTranslations({
    cs: "Popis",
    en: "Description",
  }),
  primary_cta: fieldTranslations({
    cs: "Primární tlačítko",
    en: "Primary button",
  }),
  secondary_cta: fieldTranslations({
    cs: "Sekundární tlačítko",
    en: "Secondary button",
  }),
  primary_label: fieldTranslations({
    cs: "Primární tlačítko",
    en: "Primary button",
  }),
  secondary_label: fieldTranslations({
    cs: "Sekundární tlačítko",
    en: "Secondary button",
  }),
  eyebrow: fieldTranslations({
    cs: "Nadnadpis",
    en: "Eyebrow",
    noteCs: "Malý text nad hlavním nadpisem",
    noteEn: "Small text above the main heading",
  }),
  image_alt: fieldTranslations({
    cs: "Popis obrázku",
    en: "Image alt text",
    noteCs: "Alternativní text pro přístupnost a SEO",
    noteEn: "Alternative text for accessibility and SEO",
  }),
  quote: fieldTranslations({
    cs: "Citát",
    en: "Quote",
  }),
  author: fieldTranslations({
    cs: "Autor",
    en: "Author",
  }),
  body: fieldTranslations({
    cs: "Text",
    en: "Body text",
  }),
  text: fieldTranslations({
    cs: "Text položky",
    en: "Item text",
  }),
  meta_title: fieldTranslations({
    cs: "SEO titulek",
    en: "SEO title",
    noteCs: "Titulek stránky v prohlížeči a ve vyhledávání",
    noteEn: "Page title in browser tab and search results",
  }),
  meta_description: fieldTranslations({
    cs: "SEO popis",
    en: "SEO description",
    noteCs: "Krátký popis stránky pro vyhledávače",
    noteEn: "Short page description for search engines",
  }),
  hero_title: fieldTranslations({
    cs: "Nadpis hero sekce",
    en: "Hero heading",
  }),
  hero_description: fieldTranslations({
    cs: "Popis hero sekce",
    en: "Hero description",
  }),
  hotspot_key: fieldTranslations({
    cs: "Technický klíč",
    en: "Technical key",
    noteCs: "Interní identifikátor – neměnit",
    noteEn: "Internal identifier – do not change",
  }),
  slide_key: fieldTranslations({
    cs: "Technický klíč snímku",
    en: "Slide key",
    noteCs: "Interní identifikátor – neměnit",
    noteEn: "Internal identifier – do not change",
  }),
  annotation_key: fieldTranslations({
    cs: "Technický klíč anotace",
    en: "Annotation key",
    noteCs: "Interní identifikátor – neměnit",
    noteEn: "Internal identifier – do not change",
  }),
  column_index: fieldTranslations({
    cs: "Sloupec",
    en: "Column",
    noteCs: "Index sloupce (0–3)",
    noteEn: "Column index (0–3)",
  }),
  callout_label: fieldTranslations({
    cs: "Popisek calloutu",
    en: "Callout label",
    noteCs: "Text zobrazený u hotspotu na obrázku",
    noteEn: "Text shown at the image hotspot",
  }),
  right_image_alt: fieldTranslations({
    cs: "Popis pravého obrázku",
    en: "Right image alt text",
  }),
  left_title: fieldTranslations({
    cs: "Levý nadpis",
    en: "Left heading",
  }),
  left_description: fieldTranslations({
    cs: "Levý popis",
    en: "Left description",
  }),
  left_cta: fieldTranslations({
    cs: "Levé tlačítko videa",
    en: "Left video button",
    noteCs: "Text tlačítka pro přehrání videa vlevo",
    noteEn: "Play button label on the left side",
  }),
  right_title: fieldTranslations({
    cs: "Pravý nadpis",
    en: "Right heading",
  }),
  right_description: fieldTranslations({
    cs: "Pravý popis",
    en: "Right description",
  }),
  thumbnail_alt: fieldTranslations({
    cs: "Popis náhledu videa",
    en: "Video thumbnail alt text",
  }),
  play_label: fieldTranslations({
    cs: "Popisek přehrát",
    en: "Play label",
    noteCs: "Text tlačítka pro přehrání videa",
    noteEn: "Video play button label",
  }),
  accent: fieldTranslations({
    cs: "Doplněk nadpisu",
    en: "Heading accent",
    noteCs: "Např. „a bezpečněji“",
    noteEn: "E.g. “and safer”",
  }),
  multiplier: fieldTranslations({
    cs: "Násobitel",
    en: "Multiplier",
    noteCs: "Velké číslo v sekci, např. 3×",
    noteEn: "Large number in the section, e.g. 3×",
  }),
  cta_label: fieldTranslations({
    cs: "Popisek tlačítka",
    en: "Button label",
  }),
  cta: fieldTranslations({
    cs: "Tlačítko",
    en: "Button",
  }),
  background_alt: fieldTranslations({
    cs: "Popis pozadí",
    en: "Background alt text",
  }),
  drone_alt: fieldTranslations({
    cs: "Popis dronu",
    en: "Drone alt text",
  }),
  integrated_image_alt: fieldTranslations({
    cs: "Popis integrovaného obrázku",
    en: "Integrated image alt text",
  }),
  download_label: fieldTranslations({
    cs: "Popisek stažení",
    en: "Download label",
  }),
  site_title: fieldTranslations({
    cs: "Titulek webu",
    en: "Site title",
    noteCs: "Zobrazuje se v záložce prohlížeče",
    noteEn: "Shown in the browser tab",
  }),
  site_description: fieldTranslations({
    cs: "Popis webu",
    en: "Site description",
    noteCs: "Výchozí popis webu pro SEO",
    noteEn: "Default site description for SEO",
  }),
  footer_copyright: fieldTranslations({
    cs: "Copyright v patičce",
    en: "Footer copyright",
  }),
  a11y_open_menu: fieldTranslations({
    cs: "Otevřít menu (a11y)",
    en: "Open menu (a11y)",
    noteCs: "Popisek pro čtečky obrazovky",
    noteEn: "Screen reader label",
  }),
  a11y_close_menu: fieldTranslations({
    cs: "Zavřít menu (a11y)",
    en: "Close menu (a11y)",
    noteCs: "Popisek pro čtečky obrazovky",
    noteEn: "Screen reader label",
  }),
  a11y_mobile_nav_label: fieldTranslations({
    cs: "Mobilní menu (a11y)",
    en: "Mobile menu (a11y)",
    noteCs: "Popisek navigace pro čtečky obrazovky",
    noteEn: "Navigation label for screen readers",
  }),
  a11y_logo_label: fieldTranslations({
    cs: "Logo (a11y)",
    en: "Logo (a11y)",
    noteCs: "Popisek loga pro čtečky obrazovky",
    noteEn: "Logo label for screen readers",
  }),
  hero_eyebrow: fieldTranslations({
    cs: "Nadnadpis",
    en: "Eyebrow",
    noteCs: "Malý text nad hlavním nadpisem (hero)",
    noteEn: "Small text above the main heading (hero)",
  }),
  hero_title: fieldTranslations({ cs: "Hlavní nadpis (hero)", en: "Main heading (hero)" }),
  hero_description: fieldTranslations({ cs: "Popis (hero)", en: "Description (hero)" }),
  hero_primary_cta: fieldTranslations({ cs: "Primární tlačítko (hero)", en: "Primary button (hero)" }),
  hero_secondary_cta: fieldTranslations({ cs: "Sekundární tlačítko (hero)", en: "Secondary button (hero)" }),
  hero_image_alt: fieldTranslations({ cs: "Popis obrázku (hero)", en: "Hero image alt text" }),
  autonomous_title: fieldTranslations({ cs: "Nadpis – autonomní sekce", en: "Heading – autonomous section" }),
  autonomous_description: fieldTranslations({ cs: "Popis – autonomní sekce", en: "Description – autonomous section" }),
  autonomous_callout_label: fieldTranslations({ cs: "Callout na obrázku", en: "Image callout label" }),
  fire_split_description: fieldTranslations({ cs: "Popis – fire split sekce", en: "Description – fire split section" }),
  fire_split_right_image_alt: fieldTranslations({ cs: "Popis pravého obrázku", en: "Right image alt text" }),
  effective_left_title: fieldTranslations({ cs: "Levý nadpis – Effective", en: "Left heading – Effective" }),
  effective_left_description: fieldTranslations({ cs: "Levý popis – Effective", en: "Left description – Effective" }),
  effective_left_cta: fieldTranslations({ cs: "Tlačítko videa vlevo", en: "Left video button" }),
  effective_right_title: fieldTranslations({ cs: "Pravý nadpis – Locate", en: "Right heading – Locate" }),
  effective_right_description: fieldTranslations({ cs: "Pravý popis – Locate", en: "Right description – Locate" }),
  quote_video_quote: fieldTranslations({ cs: "Citát u videa", en: "Video quote" }),
  quote_video_author: fieldTranslations({ cs: "Autor citátu u videa", en: "Video quote author" }),
  quote_video_thumbnail_alt: fieldTranslations({ cs: "Popis náhledu videa", en: "Video thumbnail alt" }),
  quote_video_play_label: fieldTranslations({ cs: "Popisek přehrát video", en: "Play video label" }),
  faster_title: fieldTranslations({ cs: "Nadpis – Faster is Better", en: "Heading – Faster is Better" }),
  faster_accent: fieldTranslations({ cs: "Doplněk nadpisu", en: "Heading accent" }),
  faster_description: fieldTranslations({ cs: "Popis – Faster sekce", en: "Description – Faster section" }),
  faster_multiplier: fieldTranslations({ cs: "Velké číslo (např. 3×)", en: "Large number (e.g. 3×)" }),
  faster_cta_label: fieldTranslations({ cs: "Popisek tlačítka", en: "Button label" }),
  faster_right_title: fieldTranslations({ cs: "Pravý nadpis – Integrated", en: "Right heading – Integrated" }),
  faster_right_description: fieldTranslations({ cs: "Pravý popis – Integrated", en: "Right description – Integrated" }),
  faster_integrated_image_alt: fieldTranslations({ cs: "Popis integrovaného obrázku", en: "Integrated image alt" }),
  timeline_title: fieldTranslations({ cs: "Nadpis – Timeline", en: "Heading – Timeline" }),
  timeline_description: fieldTranslations({ cs: "Popis – Timeline", en: "Description – Timeline" }),
  timeline_cta: fieldTranslations({ cs: "Tlačítko – Timeline", en: "Timeline button" }),
  timeline_background_alt: fieldTranslations({ cs: "Popis pozadí timeline", en: "Timeline background alt" }),
  timeline_drone_alt: fieldTranslations({ cs: "Popis dronu v timeline", en: "Timeline drone alt" }),
  timeline_quote_quote: fieldTranslations({ cs: "Citát pod timeline", en: "Quote below timeline" }),
  timeline_quote_author: fieldTranslations({ cs: "Autor citátu pod timeline", en: "Quote author below timeline" }),
  exploded_image_alt: fieldTranslations({ cs: "Popis exploded view obrázku", en: "Exploded view image alt" }),
  contact_description: fieldTranslations({ cs: "Popis kontaktní sekce", en: "Contact section description" }),
  contact_primary_cta: fieldTranslations({ cs: "Primární kontaktní tlačítko", en: "Primary contact button" }),
  contact_secondary_cta: fieldTranslations({ cs: "Sekundární kontaktní tlačítko", en: "Secondary contact button" }),
  cta_title: fieldTranslations({ cs: "Nadpis CTA sekce", en: "CTA section heading" }),
  cta_primary_label: fieldTranslations({ cs: "Primární CTA tlačítko", en: "Primary CTA button" }),
  cta_secondary_label: fieldTranslations({ cs: "Sekundární CTA tlačítko", en: "Secondary CTA button" }),
  list_title: fieldTranslations({ cs: "Nadpis seznamu", en: "List heading" }),
  quote_title: fieldTranslations({ cs: "Nadpis citace", en: "Quote heading" }),
  quote_quote: fieldTranslations({ cs: "Text citace", en: "Quote text" }),
  quote_author: fieldTranslations({ cs: "Autor citace", en: "Quote author" }),
  exploded_title: fieldTranslations({ cs: "Nadpis sekce s obrázkem", en: "Image section heading" }),
  gallery_title: fieldTranslations({ cs: "Nadpis galerie", en: "Gallery heading" }),
};

/** Collection display names and notes. */
export const COLLECTION_LABELS = {
  fd_page_global: collectionTranslations({
    cs: "Globální texty webu",
    en: "Global site copy",
    noteCs: "Titulek webu, patička, přístupnost – společné pro celý web",
    noteEn: "Site title, footer, accessibility – shared across the site",
  }),
  fd_nav_item: collectionTranslations({
    cs: "Navigace – položky menu",
    en: "Navigation – menu items",
    noteCs: "Položky hlavního menu (Opakující se seznam)",
    noteEn: "Main menu items (repeatable list)",
  }),
  fd_page_home: collectionTranslations({
    cs: "Homepage – texty sekcí",
    en: "Homepage – section texts",
    noteCs: "Jeden záznam → otevřete „Texty sekcí homepage“ → zvolte Čeština. Hero, Timeline, Kontakt atd.",
    noteEn: "Single item → open “Homepage section texts” → pick Czech. Hero, Timeline, Contact, etc.",
  }),
  fd_home_autonomous_hotspot: collectionTranslations({
    cs: "Homepage – hotspoty (autonomní sekce)",
    en: "Homepage – hotspots (autonomous)",
    noteCs: "Popisky interaktivních bodů na obrázku v sekci Autonomní",
    noteEn: "Interactive hotspot labels in the Autonomous section",
  }),
  fd_home_carousel_slide: collectionTranslations({
    cs: "Homepage – snímky karuselu",
    en: "Homepage – carousel slides",
    noteCs: "Popisy snímků v karuselu sekce Fire split",
    noteEn: "Alt text for carousel slides in the Fire split section",
  }),
  fd_home_exploded_annotation: collectionTranslations({
    cs: "Homepage – popisky dronu (exploded view)",
    en: "Homepage – drone labels (exploded view)",
    noteCs: "Popisky komponent v rozloženém pohledu na dron",
    noteEn: "Component labels in the exploded drone view",
  }),
  fd_page_about: collectionTranslations({
    cs: "O nás – texty stránky",
    en: "About us – page texts",
    noteCs: "Jeden záznam → otevřete „Texty stránky O nás“ → zvolte Čeština.",
    noteEn: "Single item → open “About page texts” → pick Czech.",
  }),
  fd_about_text_block: collectionTranslations({
    cs: "O nás – textové bloky",
    en: "About us – text blocks",
    noteCs: "Opakující se textové bloky na stránce O nás",
    noteEn: "Repeating text blocks on the About page",
  }),
  fd_about_list_item: collectionTranslations({
    cs: "O nás – položky seznamu",
    en: "About us – list items",
    noteCs: "Jednotlivé odrážky ve sloupcích seznamu",
    noteEn: "Individual bullet items in list columns",
  }),
  fd_page_invest: collectionTranslations({
    cs: "Invest – texty stránky",
    en: "Invest – page texts",
    noteCs: "Jeden záznam → otevřete „Texty stránky Invest“ → zvolte Čeština.",
    noteEn: "Single item → open “Invest page texts” → pick Czech.",
  }),
  fd_invest_document: collectionTranslations({
    cs: "Invest – dokumenty ke stažení",
    en: "Invest – downloadable documents",
    noteCs: "PDF dokumenty pro investory",
    noteEn: "PDF documents for investors",
  }),
};

/** Labels for the translations field itself (editors open this to reach all copy). */
export const TRANSLATIONS_FIELD_LABELS = {
  fd_page_global: fieldTranslations({
    cs: "Texty webu",
    en: "Site copy",
    noteCs: "Klikněte sem → vyberte jazyk „Čeština“. Upravíte titulek webu, patičku a texty pro čtečky obrazovky.",
    noteEn: "Click here → select “Czech”. Edit site title, footer, and screen reader labels.",
  }),
  fd_page_home: fieldTranslations({
    cs: "Texty sekcí homepage",
    en: "Homepage section texts",
    noteCs:
      "Klikněte sem → vyberte „Čeština“. Hledejte pole „01 Hero · Hlavní nadpis“ (titulek pod videem).",
    noteEn:
      "Click here → select “Czech”. Look for “01 Hero · Main heading” (title below the video).",
  }),
  fd_page_about: fieldTranslations({
    cs: "Texty stránky O nás",
    en: "About us page texts",
    noteCs: "Klikněte sem → vyberte „Čeština“. SEO, hero, CTA, citace, kontakt a další.",
    noteEn: "Click here → select “Czech”. SEO, hero, CTA, quote, contact, and more.",
  }),
  fd_page_invest: fieldTranslations({
    cs: "Texty stránky Invest",
    en: "Invest page texts",
    noteCs: "Klikněte sem → vyberte „Čeština“. SEO titulek, hero a popisy.",
    noteEn: "Click here → select “Czech”. SEO title, hero, and descriptions.",
  }),
  fd_nav_item: fieldTranslations({
    cs: "Text položky menu",
    en: "Menu item label",
    noteCs: "Klikněte sem → vyberte jazyk. Pole „Text položky menu“ je viditelný popisek v navigaci.",
    noteEn: "Click here → select language. “Menu item label” is the visible nav text.",
  }),
};

/** Section-prefixed labels for homepage translation fields. */
const PAGE_HOME_FIELD_SECTIONS = {
  hero_eyebrow: "01 Hero",
  hero_title: "01 Hero",
  hero_description: "01 Hero",
  hero_primary_cta: "01 Hero",
  hero_secondary_cta: "01 Hero",
  hero_image_alt: "01 Hero",
  autonomous_title: "02 Autonomní",
  autonomous_description: "02 Autonomní",
  autonomous_callout_label: "02 Autonomní",
  fire_split_description: "03 Fire split",
  fire_split_right_image_alt: "03 Fire split",
  effective_left_title: "04 Effective & Locate",
  effective_left_description: "04 Effective & Locate",
  effective_left_cta: "04 Effective & Locate",
  effective_right_title: "04 Effective & Locate",
  effective_right_description: "04 Effective & Locate",
  quote_video_quote: "05 Citát a video",
  quote_video_author: "05 Citát a video",
  quote_video_thumbnail_alt: "05 Citát a video",
  quote_video_play_label: "05 Citát a video",
  faster_title: "06 Faster & Integrated",
  faster_accent: "06 Faster & Integrated",
  faster_description: "06 Faster & Integrated",
  faster_multiplier: "06 Faster & Integrated",
  faster_cta_label: "06 Faster & Integrated",
  faster_right_title: "06 Faster & Integrated",
  faster_right_description: "06 Faster & Integrated",
  faster_integrated_image_alt: "06 Faster & Integrated",
  timeline_title: "07 Timeline",
  timeline_description: "07 Timeline",
  timeline_cta: "07 Timeline",
  timeline_background_alt: "07 Timeline",
  timeline_drone_alt: "07 Timeline",
  timeline_quote_quote: "08 Timeline citát",
  timeline_quote_author: "08 Timeline citát",
  exploded_image_alt: "09 Exploded view",
  contact_title: "10 Kontakt",
  contact_description: "10 Kontakt",
  contact_primary_cta: "10 Kontakt",
  contact_secondary_cta: "10 Kontakt",
};

/** Field-specific overrides where shared labels are not enough. */
export const FIELD_OVERRIDES = {
  "fd_nav_item.label": fieldTranslations({
    cs: "Text položky menu",
    en: "Menu item label",
  }),
  "fd_page_home.hero_title": fieldTranslations({
    cs: "Hlavní nadpis",
    en: "Main heading",
    noteCs:
      "Velký titulek v hero sekci úvodní stránky (pod videem). Aktuálně např. „Get eyes on the scene faster…“",
    noteEn:
      "Large hero heading on the homepage (below the video). E.g. “Get eyes on the scene faster…”",
  }),
  "fd_page_about.hero_title": fieldTranslations({
    cs: "Nadpis hero sekce",
    en: "Hero heading",
    noteCs: "Velký nadpis v hero sekci stránky O nás",
    noteEn: "Large heading in the About page hero",
  }),
  "fd_page_invest.hero_title": fieldTranslations({
    cs: "Nadpis hero sekce",
    en: "Hero heading",
  }),
  "fd_about_text_block.title": fieldTranslations({
    cs: "Nadpis bloku",
    en: "Block heading",
  }),
  "fd_invest_document.title": fieldTranslations({
    cs: "Nadpis dokumentu",
    en: "Document title",
  }),
  "fd_home_autonomous_hotspot.label": fieldTranslations({
    cs: "Popisek hotspotu",
    en: "Hotspot label",
  }),
  "fd_home_exploded_annotation.label": fieldTranslations({
    cs: "Popisek anotace",
    en: "Annotation label",
  }),
  "fd_home_carousel_slide.image_alt": fieldTranslations({
    cs: "Popis snímku karuselu",
    en: "Carousel slide alt text",
  }),
  "fd_page_about.cta_title": fieldTranslations({
    cs: "Nadpis CTA sekce",
    en: "CTA section heading",
  }),
  "fd_page_about.list_title": fieldTranslations({
    cs: "Nadpis seznamu s odrážkami",
    en: "Bulleted list heading",
  }),
  "fd_page_about.quote_title": fieldTranslations({
    cs: "Nadpis citace",
    en: "Quote section heading",
  }),
  "fd_page_about.exploded_title": fieldTranslations({
    cs: "Nadpis sekce s obrázkem",
    en: "Image section heading",
  }),
  "fd_page_about.gallery_title": fieldTranslations({
    cs: "Nadpis galerie",
    en: "Gallery heading",
  }),
  "fd_page_about.contact_title": fieldTranslations({
    cs: "Nadpis kontaktní sekce",
    en: "Contact section heading",
  }),
  "fd_page_home.contact_title": fieldTranslations({
    cs: "Nadpis kontaktní sekce (Stay in touch)",
    en: "Contact section heading (Stay in touch)",
  }),
};

/**
 * @param {string} collection
 * @param {string} fieldName
 */
export function getFieldLabelMeta(collection, fieldName) {
  const overrideKey = `${collection}.${fieldName}`;
  let meta = null;

  if (FIELD_OVERRIDES[overrideKey]) {
    meta = FIELD_OVERRIDES[overrideKey];
  } else if (fieldName === "translations") {
    if (TRANSLATIONS_FIELD_LABELS[collection]) {
      meta = TRANSLATIONS_FIELD_LABELS[collection];
    } else {
      meta = SHARED_FIELDS.translations;
    }
  } else if (SHARED_FIELDS[fieldName]) {
    meta = SHARED_FIELDS[fieldName];
  } else {
    const humanized = fieldName.replace(/_/g, " ");
    meta = fieldTranslations({
      cs: humanized,
      en: humanized,
    });
  }

  if (collection === "fd_page_home" && PAGE_HOME_FIELD_SECTIONS[fieldName]) {
    const section = PAGE_HOME_FIELD_SECTIONS[fieldName];
    const csLabel =
      meta.translations?.find((entry) => entry.language === CS)?.translation ??
      fieldName;
    const enLabel =
      meta.translations?.find((entry) => entry.language === EN)?.translation ??
      fieldName;

    return fieldTranslations({
      cs: `${section} · ${csLabel}`,
      en: `${section} · ${enLabel}`,
      noteCs: meta.note?.split(" / ")[0],
      noteEn: meta.note?.split(" / ")[1],
    });
  }

  return meta;
}

/**
 * @param {import('./setup-directus-schema.mjs').request} request
 * @param {string} baseUrl
 * @param {string} token
 * @param {Array<{ collection: string, plain?: Array<{ name: string }>, translations?: Array<{ name: string }> }>} schema
 * @param {{ request: Function, patchField: Function, collectionExists: Function }} helpers
 */
export async function applySchemaLabels(baseUrl, token, schema, { request, patchField, collectionExists }) {
  for (const def of schema) {
    const collectionLabel = COLLECTION_LABELS[def.collection];
    if (collectionLabel) {
      await request(baseUrl, token, `/collections/${def.collection}`, {
        method: "PATCH",
        body: JSON.stringify({ meta: collectionLabel }),
      }).catch(() => {});
    }

    if (def.plain?.length) {
      for (const field of def.plain) {
        await patchField(baseUrl, token, def.collection, field.name, {
          meta: getFieldLabelMeta(def.collection, field.name),
        });
      }
    }

    if (def.translations?.length) {
      await patchField(baseUrl, token, def.collection, "translations", {
        meta: getFieldLabelMeta(def.collection, "translations"),
      });

      const translationsCollection = `${def.collection}_translations`;
      if (await collectionExists(baseUrl, token, translationsCollection)) {
        for (const field of def.translations) {
          await patchField(baseUrl, token, translationsCollection, field.name, {
            meta: getFieldLabelMeta(def.collection, field.name),
          });
        }
      }
    }
  }

  console.log("Applied bilingual collection and field labels (cs-CZ / en-US)");
}
