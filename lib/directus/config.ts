import type { ContentLocale } from "@/types/content";

export const DEFAULT_LOCALE: ContentLocale = "cs";

/** Production ISR / fetch revalidation for Directus content (seconds). */
export const CONTENT_REVALIDATE_SECONDS_PRODUCTION = 3600;

/**
 * Revalidate interval for Directus fetches.
 * Development uses 0 so CMS edits appear immediately after refresh.
 */
export function getContentRevalidateSeconds(): number {
  if (process.env.NODE_ENV === "development") {
    return 0;
  }

  const override = process.env.DIRECTUS_REVALIDATE_SECONDS?.trim();

  if (override) {
    const parsed = Number(override);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return CONTENT_REVALIDATE_SECONDS_PRODUCTION;
}

/** @deprecated Use getContentRevalidateSeconds() — kept for imports that expect a constant name. */
export const CONTENT_REVALIDATE_SECONDS = CONTENT_REVALIDATE_SECONDS_PRODUCTION;
