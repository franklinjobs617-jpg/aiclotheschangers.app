export const baseUrl = "https://aiclotheschanger.me";

export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "简体中文"
};

export const pageSlugs = [
  "",
  "virtual-try-on-clothes",
  "plus-size-virtual-try-on",
  "mens-ai-clothes-changer",
  "pricing",
  "about-us",
  "privacy-policy",
  "terms-of-service"
] as const;

export type PageSlug = (typeof pageSlugs)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isPageSlug(value: string): value is PageSlug {
  return pageSlugs.includes(value as PageSlug);
}

export function localizedPath(locale: Locale, slug: PageSlug = "") {
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

export function absoluteLocalizedUrl(locale: Locale, slug: PageSlug = "") {
  return `${baseUrl}${localizedPath(locale, slug)}`;
}

export function alternatesFor(slug: PageSlug = "") {
  return Object.fromEntries(locales.map((locale) => [locale, absoluteLocalizedUrl(locale, slug)]));
}
