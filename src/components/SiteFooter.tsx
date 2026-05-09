"use client";

import Link from "next/link";
import { Camera, Music2, Play, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { localizedPath, type Locale } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");
  const brand = useTranslations()("brand");
  const columns: Array<[string, Array<[string, string]>]> = [
    [t("tryOn"), [[t("aiClothesChanger"), localizedPath(locale)], [t("virtualTryOnClothes"), localizedPath(locale, "virtual-try-on-clothes")], [t("plusSizeVirtualTryOn"), localizedPath(locale, "plus-size-virtual-try-on")], [t("mensAiClothesChanger"), localizedPath(locale, "mens-ai-clothes-changer")]]],
    [t("billing"), [[t("pricing"), localizedPath(locale, "pricing")], [t("creditsExplained"), localizedPath(locale, "pricing")], [t("cancelAnytime"), localizedPath(locale, "pricing")]]],
    [t("trust"), [[t("aboutUs"), localizedPath(locale, "about-us")], [t("privacyPolicy"), localizedPath(locale, "privacy-policy")], [t("termsOfService"), localizedPath(locale, "terms-of-service")]]]
  ];

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href={localizedPath(locale)} className="footer-logo">
            {brand}
          </Link>
          <div className="social-row" aria-label="Social links">
            <Link href="#" aria-label="Facebook">
              <Share2 size={18} />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Play size={18} />
            </Link>
            <Link href="#" aria-label="TikTok">
              <Music2 size={18} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Camera size={18} />
            </Link>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="footer-columns">
          {columns.map(([title, links]) => (
            <div className="footer-column" key={title}>
              <h3>{title}</h3>
              {links.map(([label, href]) => (
                <Link href={href} key={label}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">{t("copyright")}</div>
    </footer>
  );
}
