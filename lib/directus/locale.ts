import type { ContentLocale } from "@/types/content";

export const DIRECTUS_LOCALE_MAP: Record<ContentLocale, string> = {
  cs: "cs-CZ",
  en: "en-US",
};

export function toDirectusLocale(locale: ContentLocale): string {
  return DIRECTUS_LOCALE_MAP[locale] ?? locale;
}

export interface TranslationRow {
  languages_code: string | { code: string };
  [key: string]: unknown;
}

export function pickTranslation<T extends Record<string, unknown>>(
  translations: TranslationRow[] | undefined,
  locale: ContentLocale,
): Partial<T> {
  const directusLocale = toDirectusLocale(locale);

  const row = translations?.find((entry) => {
    const code =
      typeof entry.languages_code === "string"
        ? entry.languages_code
        : entry.languages_code?.code;

    return code === directusLocale;
  });

  if (!row) {
    return {};
  }

  const {
    languages_code: _languagesCode,
    id: _translationId,
    ...fields
  } = row;

  void _languagesCode;
  void _translationId;

  return fields as Partial<T>;
}

export function pickTranslationField<T extends Record<string, unknown>>(
  translations: TranslationRow[] | undefined,
  locale: ContentLocale,
  field: keyof T,
): string {
  const values = pickTranslation<T>(translations, locale);
  const value = values[field];
  return typeof value === "string" ? value : "";
}
