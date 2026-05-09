"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, ArrowRight,Sparkles } from "lucide-react";
import { OutfitSelector } from "./editor/OutfitSelector";
import { ModelSelector } from "./editor/ModelSelector";
import { ResultPreview } from "./editor/ResultPreview";
import type { Locale } from "@/lib/site";

interface EditorPageProps {
  locale: Locale;
}

export function EditorPage({ locale }: EditorPageProps) {
  const t = useTranslations("editor");
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("editor-upload-photo");
    if (stored) {
      setInitialPhoto(stored);
      sessionStorage.removeItem("editor-upload-photo");
    }
  }, []);

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [highQuality, setHighQuality] = useState(false);

  const handleGenerate = () => {
    if (!selectedModel || !selectedOutfit) return;
    setIsGenerating(true);
    setTimeout(() => {
      setResultImage(selectedOutfit);
      setIsGenerating(false);
    }, 3000);
  };

  const resultState: "empty" | "loading" | "result" = isGenerating
    ? "loading"
    : resultImage
      ? "result"
      : "empty";

  const ready = selectedModel && selectedOutfit;

  return (
    <div className="bg-white">
      <div className="mx-auto flex w-[min(1400px,calc(100%-32px))] gap-0 py-6 lg:gap-8 lg:py-8">
        {/* ===== Left Sidebar ===== */}
        <aside className="flex w-full shrink-0 flex-col gap-7 lg:w-[360px] lg:border-r lg:border-gray-100 lg:pr-8">
          {/* ===== Select Clothes ===== */}
          <section>
            <h3 className="mb-3 text-[15px] font-bold text-gray-900">Select clothes</h3>
            <OutfitSelector
              selected={selectedOutfit}
              onSelect={setSelectedOutfit}
              labels={{
                singleClothes: t("singleClothes"),
                topBottom: t("topBottom"),
                dropClothing: t("dropClothing"),
                orClickUpload: t("orClickUpload"),
                addTop: t("addTop"),
                addBottom: t("addBottom"),
                recent: t("recent"),
                demo: t("demo"),
              }}
            />
          </section>

          <section>
            <h3 className="mb-3 text-[15px] font-bold text-gray-900">Select a model</h3>
            <p className="mb-3 text-[12px] leading-relaxed text-gray-500">
              Select our model or upload your model to try on
            </p>
            <ModelSelector
              selected={selectedModel}
              onSelect={setSelectedModel}
              labels={{
                ourModels: t("ourModels"),
                yourModels: t("yourModels"),
                upload: t("upload"),
              }}
            />
          </section>

          {/* ===== Bottom: Quality + Generate ===== */}
          <div className="space-y-4 border-t border-gray-100 pt-5">
            {/* High quality mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-700">High quality mode</span>
              <button
                type="button"
                onClick={() => setHighQuality(!highQuality)}
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                  highQuality ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    highQuality ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Generate button — green per reference */}
            <button
              type="button"
              disabled={!ready || isGenerating}
              onClick={handleGenerate}
              className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold transition-all duration-200 ${
                isGenerating
                  ? "cursor-wait bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : ready
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
            >
              {isGenerating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowRight size={17} />
              )}
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </aside>

        {/* ===== Right Main Area ===== */}
        <main className="flex min-w-0 flex-1 flex-col pl-0 lg:pl-4">
          <ResultPreview
            state={resultState}
            resultSrc={resultImage}
            labels={{
              placeholder: t("resultPlaceholder"),
              subtext: t("resultSubtext"),
              generating: t("generating"),
              fabric: t("trust.fabric"),
              body: t("trust.body"),
              face: t("trust.face"),
            }}
          />
        </main>
      </div>
    </div>
  );
}
