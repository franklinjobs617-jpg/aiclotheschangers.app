"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { localizedPath, type Locale } from "@/lib/site";

const heroImages = [
  {
    src: "/85a52f41-3dad-4774-a469-b4ad5f324a7e.webp",
    alt: "AI clothes changer before and after result"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/f2f8a4a8cf184daf8d01b04c117d82fe/1730889159329.jpg",
    alt: "AI clothing style sample"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/3b42fc5d7ade49b3b7df539ba3c0b7c4/1730889163517.jpg",
    alt: "Virtual try on sample model"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/2eb9275d461341fb9775a5158005a0bd/1730889167016.jpg",
    alt: "AI outfit changer example"
  },
  {
    src: "https://images.insmind.com/market-operations/market/side/b6d53a681d3644259dcb70bc0ee5e4e6/1730889171190.jpg",
    alt: "AI clothes changer sample portrait"
  }
] as const;

export function HeroTool({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);

  const navigateToEditor = () => {
    router.push(localizedPath(locale, "editor"));
  };

  const handleFile = (file: File) => {
    // Store file reference in sessionStorage for the editor to pick up
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        sessionStorage.setItem("editor-upload-photo", result);
        navigateToEditor();
      }
    };
    reader.readAsDataURL(file);
  };

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
            <Image src={'/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png'} alt={heroImages[0].alt} width={900} height={600} priority />
          </div>

          <div
            className="hero-upload-card"
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragover(false);
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) handleFile(file);
            }}
          >
            <div className={`upload-dropzone ${dragover ? "dragover" : ""}`}>
              <button
                type="button"
                className="upload-main-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={30} />
                {t("upload")}
              </button>
              <p>{t("drop")}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <div className="sample-picker">
                <div className="sample-title">
                  <span />
                  {t("samples")}
                  <span />
                </div>
                <div className="sample-row" aria-label="Try with a sample image">
                  {heroImages.map((image) => (
                    <button
                      type="button"
                      key={image.src}
                      aria-label={image.alt}
                      onClick={() => {
                        sessionStorage.setItem("editor-upload-photo", image.src);
                        navigateToEditor();
                      }}
                    >
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
