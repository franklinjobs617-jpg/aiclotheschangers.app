import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { TopicPage } from "@/components/TopicPage";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, locales, type Locale } from "@/lib/site";

const slug = "privacy-policy" as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: `topicPages.${slug}` });

  return buildMetadata({
    title: `${t("title")} | AIClothesChanger`,
    description: t("description"),
    locale,
    slug
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <TopicPage locale={rawLocale} slug={slug} />;
}
