import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, alternatesFor, locales, pageSlugs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    pageSlugs.map((slug) => ({
      url: absoluteLocalizedUrl(locale, slug),
      lastModified: new Date("2026-05-08"),
      changeFrequency: slug === "" ? "weekly" : "monthly",
      priority: slug === "" ? 1 : slug === "pricing" ? 0.8 : 0.7,
      alternates: {
        languages: alternatesFor(slug)
      }
    }))
  );
}
