import { EditorHeader } from "@/components/EditorHeader";
import type { Locale } from "@/lib/site";

export default async function EditorLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <EditorHeader locale={locale as Locale} />
      {children}
    </>
  );
}
