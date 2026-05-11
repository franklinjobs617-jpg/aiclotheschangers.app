"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Download, Maximize2, X } from "lucide-react";

interface ResultPreviewProps {
  state: "empty" | "loading" | "result";
  modelSrc?: string | null;
  outfitSrc?: string | null;
  generatedSrc?: string | null;
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
    <div className="w-[min(560px,calc(100%-48px))] max-w-[calc(100vw-24px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)] max-[900px]:w-[calc(100%-24px)]">
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

function LoadingDots() {
  return (
    <div className="grid h-40 w-full grid-cols-14 grid-rows-7 gap-1.5 rounded-2xl bg-[#f7f9fb] p-5 max-[640px]:h-36" aria-hidden="true">
      {Array.from({ length: 98 }).map((_, index) => {
        const row = Math.floor(index / 14);
        const col = index % 14;
        const distance = Math.abs(row - 3) + Math.abs(col - 6.5);
        const opacity = Math.max(0.12, 0.82 - distance * 0.09);
        const size = Math.max(3, 7 - distance * 0.45);
        return (
          <span
            key={index}
            className="self-center justify-self-center rounded-full bg-[#9aa3b2] motion-safe:animate-pulse"
            style={{
              width: size,
              height: size,
              opacity,
              animationDelay: `${(row * 70 + col * 35) % 900}ms`,
              animationDuration: "1.8s",
            }}
          />
        );
      })}
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="grid w-[min(560px,calc(100vw-24px))] place-items-center rounded-[24px] border border-gray-200 bg-white p-4 text-gray-700 shadow-[0_18px_55px_rgba(15,23,42,0.12)] max-[640px]:rounded-[20px]">
      <div className="w-full">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="m-0 text-[15px] font-semibold text-[#222529]">{label}</p>
            <p className="mt-1 mb-0 text-[12px] font-medium text-[#7a8492]">Generating your try-on result</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#eafffb] px-3 py-1 text-[11px] font-bold text-[#168186]">AI</span>
        </div>
        <LoadingDots />
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-1/2 rounded-full bg-[#168186] motion-safe:animate-[editor-loading-bar_2.4s_ease-in-out_infinite]" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-[#667085]">
          <span className="rounded-lg bg-[#fbfcfd] px-2 py-2">{label}</span>
          <span className="rounded-lg bg-[#fbfcfd] px-2 py-2">Rendering</span>
          <span className="rounded-lg bg-[#fbfcfd] px-2 py-2">Saving</span>
        </div>
      </div>
    </div>
  );
}

function ResultDisplay({
  generatedSrc,
  labels,
  actions,
  onReset,
  onRegenerate,
  onDownload,
  onDelete,
  onFeedback,
}: {
  generatedSrc?: string | null;
  labels: ResultPreviewProps["labels"];
  actions: ResultPreviewProps["actions"];
  onReset: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onFeedback: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  return (
    <div className="grid w-[min(820px,calc(100vw-24px))] gap-3 max-[640px]:gap-3">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] max-[640px]:rounded-xl">
        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-normal text-[#168186]">Result ready</span>
          <p className="m-0 truncate text-[15px] font-semibold text-[#222529]">AI try-on preview</p>
        </div>
        <button
          type="button"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          onClick={() => generatedSrc && setIsExpanded(true)}
          aria-label="Open generated image preview"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <button
        type="button"
        className="group relative grid min-h-[min(72vh,760px)] place-items-center overflow-hidden rounded-[24px] border border-gray-200 bg-[#eef1f4] p-0 shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-transform hover:scale-[1.002] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168186]/35 max-[640px]:min-h-[58vh] max-[640px]:rounded-[18px]"
        onClick={() => generatedSrc && setIsExpanded(true)}
        aria-label="Open generated image preview"
      >
        <img
          src={generatedSrc || ""}
          alt="Generated try-on result"
          className="block h-full max-h-[min(72vh,760px)] min-h-[500px] w-full object-contain max-[640px]:min-h-0 max-[640px]:max-h-[58vh]"
        />
        <span className="pointer-events-none absolute right-4 top-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-white/92 px-3 text-xs font-semibold text-gray-700 opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 max-[640px]:opacity-100">
          <Maximize2 size={14} />
          Preview
        </span>
      </button>

      <div className="grid gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_10px_28px_rgba(15,23,42,0.06)] max-[640px]:rounded-xl">
        <div className="grid grid-cols-[1fr_0.82fr] gap-2 max-[420px]:grid-cols-1">
          <button type="button" onClick={onDownload} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-950 bg-gray-950 px-4 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#232b38] active:scale-[0.98]">
            {actions.download}
            {labels.download}
          </button>
          <button type="button" onClick={onReset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.98]">
            {actions.newOutfit}
            {labels.newOutfit}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            [onRegenerate, actions.regenerate, labels.regenerate],
            [onFeedback, actions.feedback, labels.feedback],
            [onDelete, actions.delete, labels.delete],
          ].map(([handler, icon, label]) => (
            <button key={String(label)} type="button" onClick={handler as () => void} className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-[#fbfcfd] px-2 text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]">
              {icon as ReactNode}
              <span className="truncate">{label as string}</span>
            </button>
          ))}
        </div>
      </div>

      {isExpanded && generatedSrc && (
        <div className="fixed inset-0 z-[130] bg-gray-950/86 p-5 backdrop-blur-md" onClick={() => setIsExpanded(false)}>
          <div className="absolute right-5 top-5 z-[2] flex gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDownload();
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white shadow-xl backdrop-blur transition-colors hover:bg-white/18"
            >
              <Download size={16} />
              {labels.download}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsExpanded(false);
              }}
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur transition-colors hover:bg-white/18"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid h-full place-items-center" onClick={(event) => event.stopPropagation()}>
            <div className="relative grid max-h-[calc(100vh-72px)] max-w-[min(1180px,calc(100vw-40px))] place-items-center rounded-[28px] bg-white/6 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45)] ring-1 ring-white/12">
              <img src={generatedSrc} alt="Generated try-on enlarged preview" className="max-h-[calc(100vh-104px)] max-w-full rounded-[20px] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ResultPreview({
  state,
  modelSrc,
  generatedSrc,
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
      generatedSrc={generatedSrc}
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
