"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { EDITOR_MODELS } from "@/lib/editorModels";
import { localizedPath, type Locale } from "@/lib/site";

const heroComparisonImage = "/seo-assets/hero-mirror-before-after.png";

function HeroBeforeAfterSlider() {
  const [sliderValue, setSliderValue] = useState(50);
  const splitPosition = `${sliderValue}%`;

  return (
    <div className="relative h-full min-h-[430px] overflow-hidden rounded-2xl bg-[#f2f4f7] max-[760px]:aspect-[4/3] max-[760px]:h-auto max-[760px]:min-h-0 max-[520px]:aspect-[1/1]">
      <div className="absolute inset-y-0 left-0 w-full overflow-hidden bg-[#f7f4ef]">
        <Image
          src={heroComparisonImage}
          alt="Before virtual try-on mirror selfie"
          width={1792}
          height={1024}
          priority
          className="h-full w-full object-cover object-left max-[760px]:object-contain"
        />
      </div>
      <div className="absolute inset-y-0 right-0 w-full overflow-hidden bg-[#f7f4ef]" style={{ clipPath: `inset(0 0 0 ${splitPosition})` }}>
        <Image
          src={heroComparisonImage}
          alt="After virtual try-on mirror selfie with new blouse"
          width={1792}
          height={1024}
          priority
          className="h-full w-full object-cover object-right max-[760px]:object-contain"
        />
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-gray-950/75 px-3 py-1 text-xs font-bold text-white max-[420px]:left-2 max-[420px]:top-2">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-gray-950/75 px-3 py-1 text-xs font-bold text-white max-[420px]:right-2 max-[420px]:top-2">After</span>
      <div className="pointer-events-none absolute bottom-0 top-0 z-[2] w-px bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.18)]" style={{ left: splitPosition }}>
        <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white text-[15px] font-semibold text-[#344054] shadow-[0_8px_24px_rgba(15,23,42,0.22)]">
          <span className="-mt-px tracking-normal">&lt;&gt;</span>
        </span>
      </div>
      <input
        type="range"
        min="8"
        max="92"
        value={sliderValue}
        aria-label="Before and after clothes changer slider"
        onChange={(event) => setSliderValue(Number(event.target.value))}
        className="absolute inset-0 z-[3] h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

export function HeroTool({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);

  const navigateToEditor = () => {
    router.push(localizedPath(locale, "editor"));
  };

  const selectModelAndOpenEditor = (src: string) => {
    sessionStorage.setItem("editor-selected-model", src);
    navigateToEditor();
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        sessionStorage.setItem("editor-upload-photo", result);
        try {
          const response = await fetch("/api/uploads/r2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: result, kind: "model" }),
          });
          const data = await response.json().catch(() => ({}));
          if (response.ok && typeof data?.url === "string") {
            sessionStorage.setItem("editor-upload-photo", data.url);
          }
        } catch {
          // The editor can still show the local preview and upload again before generation.
        }
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
            <HeroBeforeAfterSlider />
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
              <div className="mt-7 w-full max-w-[34rem] overflow-hidden max-[520px]:mt-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[13px] font-medium text-[#9aa3b2]">
                  <span className="h-px bg-gray-200" />
                  {t("samples")}
                  <span className="h-px bg-gray-200" />
                </div>
                <div className="editor-scroll mt-4 grid w-full grid-flow-col auto-cols-[72px] justify-start gap-2 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-5 sm:justify-center sm:gap-3 sm:overflow-visible" aria-label="Try with an editor model">
                  {EDITOR_MODELS.slice(10, 15).map((model) => (
                    <button
                      type="button"
                      key={model.id}
                      aria-label={`Try ${model.name} in editor`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-[#eceef1] transition-all hover:-translate-y-0.5 hover:border-[#23a7a0] hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
                      onClick={() => selectModelAndOpenEditor(model.src)}
                    >
                      <Image src={model.src} alt="" width={96} height={96} className="h-full w-full object-cover object-top" />
                      <span className="absolute inset-x-1 bottom-1 translate-y-1 rounded-md bg-gray-950/85 px-1.5 py-1 text-[10px] font-semibold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        {model.name}
                      </span>
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
