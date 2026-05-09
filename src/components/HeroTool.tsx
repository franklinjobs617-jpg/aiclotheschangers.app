"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { heroImages } from "@/lib/content";
import type { Locale } from "@/lib/site";

export function HeroTool({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");

  return (
    <section className="hero-section">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-container">
        <div className="hero-copy">
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>

        <div className="hero-stage" id="tool">
          <div className="hero-demo-card" aria-label="AI clothes changer before and after example">
            <Image src={heroImages[0].src} alt={heroImages[0].alt} width={900} height={600} priority />
          </div>

          <div className="hero-upload-card">
            <div className="upload-dropzone">
              <button type="button" className="upload-main-button">
                <Upload size={30} />
                {t("upload")}
              </button>
              <p>{t("drop")}</p>
              <div className="sample-picker">
                <div className="sample-title">
                  <span />
                  {t("samples")}
                  <span />
                </div>
                <div className="sample-row" aria-label="Try with a sample image">
                  {heroImages.map((image) => (
                    <button type="button" key={image.src} aria-label={image.alt}>
                      <Image src={image.src} alt="" width={72} height={72} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
