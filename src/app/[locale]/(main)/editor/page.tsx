import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EditorPage } from "@/components/EditorPage";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, locales, type Locale } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "editor" });

  return buildMetadata({
    title: `${t("step1")} | AIClothesChanger`,
    description: t("selectModel"),
    locale,
    slug: "editor"
  });
}

export default async function EditorRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <EditorPage locale={rawLocale as Locale} />;
}
