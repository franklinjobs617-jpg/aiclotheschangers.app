import type { Metadata } from "next";
import { absoluteLocalizedUrl, alternatesFor, type Locale, type PageSlug } from "./site";

const SITE_NAME = "AIClothesChanger";
const DEFAULT_OG_IMAGE = "/brand/og-card.svg";

interface BuildMetadataOpts {
  title: string;
  description: string;
  locale: Locale;
  slug?: PageSlug;
  ogImage?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  locale,
  slug = "",
  ogImage,
  noIndex
}: BuildMetadataOpts): Metadata {
  const url = absoluteLocalizedUrl(locale, slug);
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
      languages: alternatesFor(slug)
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}
