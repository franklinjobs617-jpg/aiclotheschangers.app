"use client";

import { Check, Loader2, ArrowRight, Zap } from "lucide-react";

interface GenerateButtonProps {
  modelSelected: boolean;
  outfitSelected: boolean;
  isGenerating: boolean;
  hdMode: boolean;
  onHdToggle: (v: boolean) => void;
  onGenerate: () => void;
  labels: {
    selectModel: string;
    selectOutfit: string;
    generate: string;
    generating: string;
    modelSelected: string;
    outfitSelected: string;
  };
}

export function GenerateButton({
  modelSelected,
  outfitSelected,
  isGenerating,
  hdMode,
  onHdToggle,
  onGenerate,
  labels,
}: GenerateButtonProps) {
  const ready = modelSelected && outfitSelected;

  let btnLabel: string;
  if (isGenerating) {
    btnLabel = labels.generating;
  } else if (!modelSelected) {
    btnLabel = labels.selectModel;
  } else if (!outfitSelected) {
    btnLabel = labels.selectOutfit;
  } else {
    btnLabel = labels.generate;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      {/* Status chips */}
      <div className="mb-4 flex gap-3">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
            modelSelected
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {modelSelected ? <Check size={12} /> : <span className="h-3 w-3 rounded-full border border-gray-300" />}
          {modelSelected ? labels.modelSelected : labels.selectModel}
        </div>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
            outfitSelected
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {outfitSelected ? <Check size={12} /> : <span className="h-3 w-3 rounded-full border border-gray-300" />}
          {outfitSelected ? labels.outfitSelected : labels.selectOutfit}
        </div>
      </div>

      {/* HD Mode toggle + Credits */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onHdToggle(!hdMode)}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 ${
            hdMode
              ? "bg-gray-100 text-gray-800"
              : "bg-transparent text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Zap size={13} className={hdMode ? "text-gray-700" : "text-gray-400"} />
          HD Mode
          <span
            className={`relative inline-block h-4 w-7 rounded-full transition-colors duration-150 ${
              hdMode ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                hdMode ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
        <span className="text-[11px] text-gray-400">3 credits left</span>
      </div>

      {/* Generate button — black per AGENTS.md (黑白主按钮) */}
      <button
        type="button"
        disabled={!ready || isGenerating}
        onClick={onGenerate}
        className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
          isGenerating
            ? "cursor-wait bg-gray-200 text-gray-500"
            : ready
              ? "bg-gray-900 text-white shadow-sm hover:bg-black active:scale-[0.98]"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
        }`}
      >
        {isGenerating ? (
          <Loader2 size={18} className="animate-spin" />
        ) : ready ? (
          <ArrowRight size={17} />
        ) : null}
        {btnLabel}
      </button>
    </div>
  );
}
