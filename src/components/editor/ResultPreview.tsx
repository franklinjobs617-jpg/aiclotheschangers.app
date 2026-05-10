"use client";

import type { ReactNode } from "react";

interface ResultPreviewProps {
  state: "empty" | "loading" | "result";
  modelSrc?: string | null;
  outfitSrc?: string | null;
  onReset: () => void;
  onRegenerate: () => void;
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

function EmptyState({ labels }: { labels: ResultPreviewProps["labels"] }) {
  return (
    <div className="editor-empty-card">
      <img src="/file_000000002ad871f6a73a5896f81959f.webp" alt="" className="editor-empty-image" />
      <div className="editor-empty-steps">
        {[
          [labels.stepOneTitle, labels.stepOneDesc],
          [labels.stepTwoTitle, labels.stepTwoDesc],
          [labels.stepThreeTitle, labels.stepThreeDesc],
        ].map(([title, desc], index) => (
          <div className="editor-empty-step" key={title}>
            <div className="editor-empty-step-head">
              <span>{index + 1}</span>
              <h3>{title}</h3>
            </div>
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <p className="editor-canvas-blank">{labels.blank}</p>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="editor-loading-card">
      <div className="editor-spinner" />
      <p>{label}</p>
      <span>10-15s</span>
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
}: {
  modelSrc?: string | null;
  outfitSrc?: string | null;
  labels: ResultPreviewProps["labels"];
  actions: ResultPreviewProps["actions"];
  onReset: () => void;
  onRegenerate: () => void;
}) {
  const displayModel = modelSrc || "/85a52f41-3dad-4774-a469-b4ad5f324a7e.webp";

  return (
    <div className="editor-result-wrap">
      <div className="editor-result-stage">
        <img src={displayModel} alt="Try-on result" className="editor-result-model" />
        {outfitSrc && (
          <div className="editor-result-outfit">
            <img src={outfitSrc} alt="Selected outfit" />
          </div>
        )}
        <div className="editor-result-badges">
          <span>{labels.fabric}</span>
          <span>{labels.body}</span>
          <span>{labels.face}</span>
        </div>
      </div>

      <div className="editor-result-toolbar">
        <button type="button">
          {actions.download}
          {labels.download}
        </button>
        <button type="button" onClick={onReset}>
          {actions.newOutfit}
          {labels.newOutfit}
        </button>
        <button type="button" onClick={onRegenerate}>
          {actions.regenerate}
          {labels.regenerate}
        </button>
        <button type="button">
          {actions.feedback}
          {labels.feedback}
        </button>
        <button type="button" onClick={onReset}>
          {actions.delete}
          {labels.delete}
        </button>
      </div>
    </div>
  );
}

export function ResultPreview({
  state,
  modelSrc,
  outfitSrc,
  labels,
  actions,
  onReset,
  onRegenerate,
}: ResultPreviewProps) {
  if (state === "empty") return <EmptyState labels={labels} />;
  if (state === "loading") return <LoadingState label={labels.generating} />;

  return (
    <ResultDisplay
      modelSrc={modelSrc}
      outfitSrc={outfitSrc}
      labels={labels}
      actions={actions}
      onReset={onReset}
      onRegenerate={onRegenerate}
    />
  );
}
