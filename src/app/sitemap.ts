import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, alternatesFor, locales, pageSlugs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-09");

  return pageSlugs.flatMap((slug) =>
    locales.map((locale) => ({
        url: absoluteLocalizedUrl(locale, slug),
        lastModified,
        changeFrequency: slug === "" ? ("weekly" as const) : ("monthly" as const),
        priority: slug === "" ? 1 : slug === "pricing" ? 0.8 : 0.7,
        alternates: {
          languages: alternatesFor(slug)
        }
      }))
  );
}
