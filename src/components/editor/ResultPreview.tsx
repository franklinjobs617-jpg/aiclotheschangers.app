"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface ResultPreviewProps {
  state: "empty" | "loading" | "result";
  modelSrc?: string | null;
  outfitSrc?: string | null;
  progressLabel?: string;
  onReset: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onFeedback: () => void;
  labels: {
    placeholder: string;
    subtext: string;
    generating: string;
    blank: string;
    stepOneTitle: string;
    stepOneDesc: string;
    stepTwoTitle: string;
    stepTwoDesc: string;
    stepThreeTitle: string;
    stepThreeDesc: string;
    download: string;
    newOutfit: string;
    regenerate: string;
    feedback: string;
    delete: string;
    before: string;
    after: string;
    previewOnly: string;
    fabric: string;
    body: string;
    face: string;
  };
  actions: {
    download: ReactNode;
    newOutfit: ReactNode;
    regenerate: ReactNode;
    feedback: ReactNode;
    delete: ReactNode;
  };
}

function EmptyState({ labels, modelSrc }: { labels: ResultPreviewProps["labels"]; modelSrc?: string | null }) {
  const displayModel = modelSrc || "/models/model-01.webp";

  return (
    <div className="w-[min(560px,calc(100%-48px))] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)] max-[900px]:w-[calc(100%-24px)]">
      <div className="relative h-[282px] overflow-hidden rounded-xl border border-gray-100 bg-[#f6f7f9]">
        <div className="absolute inset-5 rounded-lg border border-dashed border-gray-300" />
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <div className="h-[210px] w-[136px] overflow-hidden rounded-xl bg-[#eceef1] shadow-sm">
            <img src={displayModel} alt="" className="h-full w-full bg-[#eceef1] object-cover object-top" />
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-white text-[20px] font-light text-[#168186] shadow-sm">+</div>
          <div className="grid h-[170px] w-[118px] place-items-center rounded-xl border border-dashed border-[#23a7a0]/55 bg-white text-center shadow-sm">
            <div>
              <div className="mx-auto mb-2 grid size-9 place-items-center rounded-full bg-[#eafffb] text-[22px] font-light text-[#168186]">+</div>
              <p className="m-0 text-[13px] font-semibold text-[#168186]">{labels.stepOneTitle}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 max-[640px]:grid-cols-1">
        {[
          [labels.stepOneTitle, labels.stepOneDesc],
          [labels.stepTwoTitle, labels.stepTwoDesc],
          [labels.stepThreeTitle, labels.stepThreeDesc],
        ].map(([title, desc], index) => (
          <div key={title} className="rounded-xl bg-[#fbfcfd] p-3">
            <span className="mb-2 grid size-[20px] place-items-center rounded-full bg-[#475467] text-[11px] font-bold text-white">{index + 1}</span>
            <h3 className="m-0 text-[13px] font-semibold text-[#344054]">{title}</h3>
            <p className="mt-1 mb-0 text-[12px] leading-[17px] text-[#667085]">{desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 mb-0 text-center text-[12px] leading-[18px] text-[#98a2b3]">{labels.blank}</p>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="grid h-[220px] w-80 place-items-center content-center rounded-2xl border border-gray-200 bg-white text-gray-600 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <div className="size-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#168186]" />
      <p className="mt-3 mb-0.5 text-sm font-semibold">{label}</p>
      <span className="text-xs text-[#7a8492]">10-15s</span>
    </div>
  );
}

function ResultDisplay({
  modelSrc,
  outfitSrc,
  labels,
  actions,
  onReset,
  onRegenerate,
  onDownload,
  onDelete,
  onFeedback,
}: {
  modelSrc?: string | null;
  outfitSrc?: string | null;
  labels: ResultPreviewProps["labels"];
  actions: ResultPreviewProps["actions"];
  onReset: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onFeedback: () => void;
}) {
  const [sliderValue, setSliderValue] = useState(52);
  const displayModel = modelSrc || "/models/model-01.webp";
  const resultSrc = "/AI换装对比_纯人物无文字-转换自.webp";
  const splitPosition = `${sliderValue}%`;

  return (
    <div className="grid w-[min(680px,calc(100%-56px))] gap-3.5">
      <div className="relative min-h-[min(72vh,720px)] overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <div className="relative h-[min(72vh,720px)] min-h-[440px] overflow-hidden bg-[#eceef1] max-[640px]:min-h-[520px]">
          <img src={displayModel} alt="Before try-on" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${splitPosition})` }}>
            <img src={resultSrc} alt="AI clothes changer preview result" className="h-full w-full object-cover" />
          </div>

          <div className="absolute top-3.5 left-3.5 z-[3] rounded-full bg-gray-950/75 px-2.5 py-1 text-[11px] font-bold text-white">
            {labels.before}
          </div>
          <div className="absolute top-3.5 right-3.5 z-[3] rounded-full bg-gray-950/75 px-2.5 py-1 text-[11px] font-bold text-white">
            {labels.after}
          </div>

          <div className="pointer-events-none absolute top-0 bottom-0 z-[4] w-px bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.18)]" style={{ left: splitPosition }}>
            <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white text-[15px] font-semibold text-[#344054] shadow-[0_8px_24px_rgba(15,23,42,0.22)]">
              <span className="-mt-px tracking-[-2px]">‹›</span>
            </span>
          </div>

          <input
            type="range"
            min="8"
            max="92"
            value={sliderValue}
            aria-label={`${labels.before} ${labels.after} comparison`}
            onChange={(event) => setSliderValue(Number(event.target.value))}
            className="absolute inset-0 z-[5] h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        {outfitSrc && (
          <div className="pointer-events-none absolute left-[18px] bottom-[54px] z-[6] w-24 overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl">
            <img src={outfitSrc} alt="Selected outfit" className="aspect-[3/4] w-full object-cover" />
          </div>
        )}
        <p className="pointer-events-none absolute right-3.5 bottom-3.5 left-3.5 z-[6] m-0 rounded-full bg-gray-950/75 px-2.5 py-1.5 text-center text-[11px] font-bold leading-[1.35] text-white max-[640px]:bottom-2.5 max-[640px]:text-[10px]">
          {labels.previewOnly}
        </p>
        <div className="pointer-events-none absolute top-11 left-3.5 z-[3] flex flex-wrap gap-1.5">
          {[labels.fabric, labels.body, labels.face].map((label) => (
            <span key={label} className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-gray-600 shadow-sm">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 max-[640px]:flex-wrap">
        {[
          [onDownload, actions.download, labels.download],
          [onReset, actions.newOutfit, labels.newOutfit],
          [onRegenerate, actions.regenerate, labels.regenerate],
          [onFeedback, actions.feedback, labels.feedback],
          [onDelete, actions.delete, labels.delete],
        ].map(([handler, icon, label]) => (
          <button key={String(label)} type="button" onClick={handler as () => void} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-semibold text-gray-600 hover:bg-gray-100">
            {icon as ReactNode}
            {label as string}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ResultPreview({
  state,
  modelSrc,
  outfitSrc,
  progressLabel,
  labels,
  actions,
  onReset,
  onRegenerate,
  onDownload,
  onDelete,
  onFeedback,
}: ResultPreviewProps) {
  if (state === "empty") return <EmptyState labels={labels} modelSrc={modelSrc} />;
  if (state === "loading") return <LoadingState label={progressLabel || labels.generating} />;

  return (
    <ResultDisplay
      modelSrc={modelSrc}
      outfitSrc={outfitSrc}
      labels={labels}
      actions={actions}
      onReset={onReset}
      onRegenerate={onRegenerate}
      onDownload={onDownload}
      onDelete={onDelete}
      onFeedback={onFeedback}
    />
  );
}
