import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, alternatesFor, locales, pageSlugs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-09");
  const englishOnlyPages = pageSlugs.filter((slug) => slug !== "");
  const multilingualPages = [""] as const;

  return [
    ...englishOnlyPages.map((slug) => ({
      url: absoluteLocalizedUrl("en", slug),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: slug === "pricing" ? 0.8 : 0.7,
      alternates: {
        languages: alternatesFor(slug, false)
      }
    })),
    ...multilingualPages.flatMap((slug) =>
      locales.map((locale) => ({
        url: absoluteLocalizedUrl(locale, slug),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 1,
        alternates: {
          languages: alternatesFor(slug, true)
        }
      }))
    )
  ];
}
