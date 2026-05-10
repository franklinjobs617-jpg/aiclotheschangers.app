"use client";

import { Download, Share2, RotateCcw } from "lucide-react";

interface ResultPreviewProps {
  state: "empty" | "loading" | "result";
  resultSrc?: string | null;
  labels: {
    placeholder: string;
    subtext: string;
    generating: string;
    fabric: string;
    body: string;
    face: string;
  };
}

/* Empty state — illustration + 3-step guide */
function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
      {/* Simple illustration */}
      <div className="relative mb-8">
        <div className="flex h-[140px] w-[100px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center">
            {/* Head */}
            <div className="mb-1 h-9 w-9 rounded-full border-2 border-gray-300" />
            {/* Body */}
            <div className="h-10 w-[52px] rounded-lg border-2 border-gray-300" />
            {/* Legs */}
            <div className="mt-0.5 flex gap-1.5">
              <div className="h-6 w-[22px] rounded border-2 border-gray-300" />
              <div className="h-6 w-[22px] rounded border-2 border-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <p className="mb-3 text-[14px] font-medium text-gray-600">
        {label}
      </p>
      <p className="text-xs text-gray-400">Select clothes and model to start</p>
    </div>
  );
}

/* Loading state */
function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="mt-1 text-xs text-gray-400">This may take 10–15 seconds</p>
    </div>
  );
}

/* Result display — main image with floating actions */
function ResultDisplay({ src, labels }: { src: string; labels: { fabric: string; body: string; face: string } }) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Main result image */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
        <img src={src} alt="Try-on result" className="block w-full object-contain" />
        {/* Floating actions — top right */}
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm transition-all duration-150 hover:bg-white hover:shadow-md"
            aria-label="Download"
          >
            <Download size={15} className="text-gray-600" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm transition-all duration-150 hover:bg-white hover:shadow-md"
            aria-label="Share"
          >
            <Share2 size={15} className="text-gray-600" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm transition-all duration-150 hover:bg-white hover:shadow-md"
            aria-label="Regenerate"
          >
            <RotateCcw size={15} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResultPreview({ state, resultSrc, labels }: ResultPreviewProps) {
  if (state === "empty") return <EmptyState label={labels.placeholder} />;
  if (state === "loading") return <LoadingState label={labels.generating} />;
  if (state === "result" && resultSrc) return <ResultDisplay src={resultSrc} labels={{ fabric: labels.fabric, body: labels.body, face: labels.face }} />;

  return null;
}
