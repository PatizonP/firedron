import { unstable_cache } from "next/cache";

import { directusAppFetch } from "@/lib/directus/app-client";
import {
  DEFAULT_LOCALE,
  getContentRevalidateSeconds,
} from "@/lib/directus/config";
import { DirectusContentError } from "@/lib/directus/errors";
import { directusLog, isDirectusDebugEnabled, logDirectusError } from "@/lib/directus/logger";
import {
  pickTranslation,
  pickTranslationField,
  toDirectusLocale,
  type TranslationRow,
} from "@/lib/directus/locale";
import type {
  ContentLocale,
  ContentPage,
  PageSections,
} from "@/types/content";

interface DirectusSingletonResponse<T> {
  data: T & { translations?: TranslationRow[] };
}

interface DirectusListResponse<T> {
  data: Array<T & { translations?: TranslationRow[] }>;
}

interface TranslatableItem {
  translations?: TranslationRow[];
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function translationLanguages(translations: TranslationRow[] | undefined): string[] {
  return (translations ?? [])
    .map((row) => {
      if (typeof row.languages_code === "string") {
        return row.languages_code;
      }

      return row.languages_code?.code ?? "unknown";
    })
    .filter(Boolean);
}

function pickPageTranslation<T extends Record<string, unknown>>(
  translations: TranslationRow[] | undefined,
  locale: ContentLocale,
  collection: string,
): Partial<T> {
  const row = pickTranslation<T>(translations, locale);

  if (!translations?.length) {
    directusLog.warn("item has no translations", { collection, locale });
  } else if (Object.keys(row).length === 0) {
    directusLog.warn("translation row missing for locale", {
      collection,
      locale,
      directusLocale: toDirectusLocale(locale),
      availableLocales: translationLanguages(translations),
    });
  } else if (isDirectusDebugEnabled()) {
    const sampleKey = Object.keys(row).find((key) => typeof row[key] === "string");
    directusLog.debug("translation mapped", {
      collection,
      locale,
      fields: Object.keys(row).length,
      ...(sampleKey
        ? { sampleField: sampleKey, samplePreview: String(row[sampleKey]).slice(0, 80) }
        : {}),
    });
  }

  return row;
}

async function fetchSingleton(collection: string): Promise<TranslatableItem> {
  directusLog.debug("fetch singleton", { collection });

  const response = await directusAppFetch<DirectusSingletonResponse<TranslatableItem>>(
    `/items/${collection}?fields=*,translations.*`,
  );

  if (!response.data) {
    logDirectusError("singleton empty", null, { collection });
    throw new DirectusContentError(
      `Directus returned no item for ${collection}.`,
      collection,
    );
  }

  directusLog.debug("fetch singleton ok", {
    collection,
    translationCount: response.data.translations?.length ?? 0,
  });

  return response.data;
}

async function fetchList(
  collection: string,
  sort = "sort",
): Promise<Array<TranslatableItem & Record<string, unknown>>> {
  directusLog.debug("fetch list", { collection, sort });

  const response = await directusAppFetch<
    DirectusListResponse<TranslatableItem & Record<string, unknown>>
  >(`/items/${collection}?fields=*,translations.*&sort=${sort}&limit=-1`);

  const items = response.data ?? [];

  directusLog.debug("fetch list ok", { collection, count: items.length });

  return items;
}

async function fetchGlobalContent(
  locale: ContentLocale,
): Promise<PageSections<"global">> {
  const globalItem = await fetchSingleton("fd_page_global");
  const navItems = await fetchList("fd_nav_item");

  const globalTranslation = pickPageTranslation<{
    site_title: string;
    site_description: string;
    footer_copyright: string;
    a11y_open_menu: string;
    a11y_close_menu: string;
    a11y_mobile_nav_label: string;
    a11y_logo_label: string;
  }>(globalItem.translations, locale, "fd_page_global");

  return {
    metadata: {
      title: asText(globalTranslation.site_title),
      description: asText(globalTranslation.site_description),
    },
    nav: {
      items: navItems.map((item) => ({
        label: pickTranslationField<{ label: string }>(
          item.translations,
          locale,
          "label",
        ),
        href: String(item.href ?? ""),
      })),
    },
    footer: {
      copyright: asText(globalTranslation.footer_copyright),
    },
    a11y: {
      openMenu: asText(globalTranslation.a11y_open_menu),
      closeMenu: asText(globalTranslation.a11y_close_menu),
      mobileNavLabel: asText(globalTranslation.a11y_mobile_nav_label),
      logoLabel: asText(globalTranslation.a11y_logo_label),
    },
  };
}

async function fetchHomeContent(
  locale: ContentLocale,
): Promise<PageSections<"home">> {
  const [home, hotspots, slides, annotations] = await Promise.all([
    fetchSingleton("fd_page_home"),
    fetchList("fd_home_autonomous_hotspot"),
    fetchList("fd_home_carousel_slide"),
    fetchList("fd_home_exploded_annotation"),
  ]);

  const t = pickPageTranslation<Record<string, unknown>>(
    home.translations,
    locale,
    "fd_page_home",
  );

  return {
    hero: {
      eyebrow: asText(t.hero_eyebrow),
      title: asText(t.hero_title),
      description: asText(t.hero_description),
      primaryCta: asText(t.hero_primary_cta),
      secondaryCta: asText(t.hero_secondary_cta),
      imageAlt: asText(t.hero_image_alt),
    },
    autonomous: {
      title: asText(t.autonomous_title),
      description: asText(t.autonomous_description),
      calloutLabel: asText(t.autonomous_callout_label),
      hotspots: hotspots.map((item) => ({
        id: String(item.hotspot_key ?? ""),
        label: pickTranslationField<{ label: string }>(
          item.translations,
          locale,
          "label",
        ),
      })),
    },
    "fire-image-split": {
      description: asText(t.fire_split_description),
      rightImageAlt: asText(t.fire_split_right_image_alt),
      slides: slides.map((item) => ({
        id: String(item.slide_key ?? ""),
        imageAlt: pickTranslationField<{ image_alt: string }>(
          item.translations,
          locale,
          "image_alt",
        ),
      })),
    },
    "effective-locate": {
      leftTitle: asText(t.effective_left_title),
      leftDescription: asText(t.effective_left_description),
      leftCta: asText(t.effective_left_cta),
      rightTitle: asText(t.effective_right_title),
      rightDescription: asText(t.effective_right_description),
    },
    "quote-video": {
      quote: asText(t.quote_video_quote),
      author: asText(t.quote_video_author),
      thumbnailAlt: asText(t.quote_video_thumbnail_alt),
      playLabel: asText(t.quote_video_play_label),
    },
    "faster-integrated": {
      title: asText(t.faster_title),
      accent: asText(t.faster_accent),
      description: asText(t.faster_description),
      multiplier: asText(t.faster_multiplier),
      ctaLabel: asText(t.faster_cta_label),
      rightTitle: asText(t.faster_right_title),
      rightDescription: asText(t.faster_right_description),
      integratedImageAlt: asText(t.faster_integrated_image_alt),
    },
    timeline: {
      title: asText(t.timeline_title),
      description: asText(t.timeline_description),
      cta: asText(t.timeline_cta),
      backgroundAlt: asText(t.timeline_background_alt),
      droneAlt: asText(t.timeline_drone_alt),
    },
    "timeline-quote": {
      quote: asText(t.timeline_quote_quote),
      author: asText(t.timeline_quote_author),
    },
    "exploded-drone": {
      imageAlt: asText(t.exploded_image_alt),
      annotations: annotations.map((item) => ({
        id: String(item.annotation_key ?? ""),
        label: pickTranslationField<{ label: string }>(
          item.translations,
          locale,
          "label",
        ),
      })),
    },
    "stay-in-touch": {
      title: asText(t.contact_title),
      description: asText(t.contact_description),
      primaryCta: asText(t.contact_primary_cta),
      secondaryCta: asText(t.contact_secondary_cta),
    },
  };
}

async function fetchAboutContent(
  locale: ContentLocale,
): Promise<PageSections<"about-us">> {
  const [page, textBlocks, listItems] = await Promise.all([
    fetchSingleton("fd_page_about"),
    fetchList("fd_about_text_block"),
    fetchList("fd_about_list_item"),
  ]);

  const pageT = pickPageTranslation<Record<string, unknown>>(
    page.translations,
    locale,
    "fd_page_about",
  );
  const columns = Array.from({ length: 4 }, () => [] as string[]);

  for (const item of listItems) {
    const columnIndex = Number(item.column_index);
    if (columnIndex >= 0 && columnIndex < 4) {
      columns[columnIndex].push(
        pickTranslationField<{ text: string }>(item.translations, locale, "text"),
      );
    }
  }

  return {
    metadata: {
      title: asText(pageT.meta_title),
      description: asText(pageT.meta_description),
    },
    hero: {
      title: asText(pageT.hero_title),
    },
    "text-blocks": {
      blocks: textBlocks.map((block) => {
        const blockT = pickTranslation<{
          title: string;
          body: string;
        }>(block.translations, locale);

        return {
          title: asText(blockT.title),
          body: asText(blockT.body),
        };
      }),
    },
    cta: {
      title: asText(pageT.cta_title),
      primaryLabel: asText(pageT.cta_primary_label),
      secondaryLabel: asText(pageT.cta_secondary_label),
    },
    list: {
      title: asText(pageT.list_title),
      columns,
    },
    quote: {
      title: asText(pageT.quote_title),
      quote: asText(pageT.quote_quote),
      author: asText(pageT.quote_author),
    },
    exploded: {
      title: asText(pageT.exploded_title),
    },
    gallery: {
      title: asText(pageT.gallery_title),
    },
    contact: {
      title: asText(pageT.contact_title),
      description: asText(pageT.contact_description),
      primaryCta: asText(pageT.contact_primary_cta),
      secondaryCta: asText(pageT.contact_secondary_cta),
    },
  };
}

async function fetchInvestContent(
  locale: ContentLocale,
): Promise<PageSections<"invest">> {
  const [page, documents] = await Promise.all([
    fetchSingleton("fd_page_invest"),
    fetchList("fd_invest_document"),
  ]);

  const pageT = pickPageTranslation<Record<string, unknown>>(
    page.translations,
    locale,
    "fd_page_invest",
  );

  return {
    metadata: {
      title: asText(pageT.meta_title),
      description: asText(pageT.meta_description),
    },
    hero: {
      title: asText(pageT.hero_title),
      description: asText(pageT.hero_description),
    },
    documents: {
      items: documents.map((doc) => {
        const docT = pickTranslation<{
          title: string;
          description: string;
          download_label: string;
        }>(doc.translations, locale);

        return {
          title: asText(docT.title),
          description: asText(docT.description),
          downloadLabel: asText(docT.download_label),
          href: String(doc.href ?? ""),
        };
      }),
    },
  };
}

async function fetchPageContentFromDirectus<TPage extends ContentPage>(
  page: TPage,
  locale: ContentLocale,
): Promise<PageSections<TPage>> {
  const startedAt = Date.now();
  directusLog.debug("load page content start", { page, locale });

  try {
    let result: PageSections<TPage>;

    switch (page) {
      case "global":
        result = (await fetchGlobalContent(locale)) as PageSections<TPage>;
        break;
      case "home":
        result = (await fetchHomeContent(locale)) as PageSections<TPage>;
        break;
      case "about-us":
        result = (await fetchAboutContent(locale)) as PageSections<TPage>;
        break;
      case "invest":
        result = (await fetchInvestContent(locale)) as PageSections<TPage>;
        break;
      default: {
        const exhaustiveCheck: never = page;
        throw new DirectusContentError(`Unknown content page: ${exhaustiveCheck}`);
      }
    }

    directusLog.debug("load page content ok", {
      page,
      locale,
      ms: Date.now() - startedAt,
    });

    return result;
  } catch (error) {
    logDirectusError("load page content failed", error, {
      page,
      locale,
      ms: Date.now() - startedAt,
    });
    throw error;
  }
}

const getCachedDirectusPageContent =
  process.env.NODE_ENV === "development"
    ? fetchPageContentFromDirectus
    : unstable_cache(
        async (page: ContentPage, locale: ContentLocale) =>
          fetchPageContentFromDirectus(page, locale),
        ["fire-drone-directus-v6"],
        { revalidate: getContentRevalidateSeconds() },
      );

export async function getPageContent<TPage extends ContentPage>(
  page: TPage,
  locale: ContentLocale = DEFAULT_LOCALE,
): Promise<PageSections<TPage>> {
  directusLog.debug("getPageContent", { page, locale });

  try {
    return (await getCachedDirectusPageContent(
      page,
      locale,
    )) as PageSections<TPage>;
  } catch (error) {
    logDirectusError("getPageContent failed", error, { page, locale });
    throw error;
  }
}

export {
  CONTENT_REVALIDATE_SECONDS,
  CONTENT_REVALIDATE_SECONDS_PRODUCTION,
  DEFAULT_LOCALE,
  getContentRevalidateSeconds,
} from "@/lib/directus/config";
