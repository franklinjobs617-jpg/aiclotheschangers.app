import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Locale } from "@/lib/site";

export default async function MainLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <SiteHeader locale={locale as Locale} />
      <main>{children}</main>
      <SiteFooter locale={locale as Locale} />
    </>
  );
}
