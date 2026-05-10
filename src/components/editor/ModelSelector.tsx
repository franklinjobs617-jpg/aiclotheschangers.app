"use client";

import { useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { EDITOR_MODELS } from "@/lib/editorModels";

type Tab = "our" | "your";
type ModelFilter = "all" | "plusSize" | "men" | "women";

interface ModelSelectorProps {
  selected: string | null;
  onSelect: (src: string) => void;
  labels: {
    ourModels: string;
    yourModels: string;
    upload: string;
    all: string;
    plusSize: string;
    men: string;
    women: string;
  };
}

export function ModelSelector({ selected, onSelect, labels }: ModelSelectorProps) {
  const [tab, setTab] = useState<Tab>("our");
  const [filter, setFilter] = useState<ModelFilter>("all");
  const [hoverPreview, setHoverPreview] = useState<{
    src: string;
    name: string;
    top: number;
    left: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredModels = filter === "all" ? EDITOR_MODELS : EDITOR_MODELS.filter((model) => (model.categories as readonly string[]).includes(filter));
  const selectedBuiltInModel = selected ? EDITOR_MODELS.find((model) => model.src === selected) : undefined;
  const visibleModels = selectedBuiltInModel && filteredModels.some((model) => model.src === selectedBuiltInModel.src)
    ? [selectedBuiltInModel, ...filteredModels.filter((model) => model.src !== selectedBuiltInModel.src)]
    : filteredModels;
  const canShowHoverPreview = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches;

  const showHoverPreview = (target: HTMLElement, model: (typeof EDITOR_MODELS)[number]) => {
    if (!canShowHoverPreview()) return;
    const rect = target.getBoundingClientRect();
    setHoverPreview({
      src: model.src,
      name: model.name,
      top: Math.max(84, Math.min(rect.top - 18, window.innerHeight - 360)),
      left: Math.min(rect.right + 14, window.innerWidth - 238),
    });
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") onSelect(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-2.5 flex gap-1 rounded-[9px] bg-[#f3f4f6] p-1">
        {(["our", "your"] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`h-8 flex-1 rounded-md border-0 text-[13px] font-medium transition-colors ${
              tab === item ? "bg-white text-gray-950 shadow-sm" : "bg-transparent text-[#667085] hover:text-gray-900"
            }`}
          >
            {item === "our" ? labels.ourModels : labels.yourModels}
          </button>
        ))}
      </div>

      {tab === "our" && (
        <>
          <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Model filters">
            {[
              ["all", labels.all],
              ["plusSize", labels.plusSize],
              ["men", labels.men],
              ["women", labels.women],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key as ModelFilter)}
                className={`min-h-7 flex-none rounded-full border px-2.5 text-[12px] font-medium transition-colors ${
                  filter === key ? "border-[#168186] bg-[#effffc] text-[#168186]" : "border-gray-200 bg-white text-[#667085] hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button type="button" className="flex aspect-[3/4] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-[#d8d8db] bg-slate-50 text-[12px] font-medium text-[#667085] hover:border-[#23a7a0]" onClick={() => inputRef.current?.click()}>
              <Plus size={24} />
              <span>{labels.upload}</span>
            </button>
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => handleUpload(event.target.files?.[0])} />

            {visibleModels.map((model) => {
              const isSelected = selected === model.src;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onSelect(model.src)}
                  onMouseEnter={(event) => showHoverPreview(event.currentTarget, model)}
                  onMouseLeave={() => setHoverPreview(null)}
                  onFocus={(event) => showHoverPreview(event.currentTarget, model)}
                  onBlur={() => setHoverPreview(null)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 bg-[#eceef1] transition-colors ${isSelected ? "border-[#168186]" : "border-transparent hover:border-gray-300"}`}
                >
                  <img src={model.src} alt={model.name} className="h-full w-full bg-[#eceef1] object-cover object-top" />
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 grid size-5 place-items-center rounded-full bg-[#168186] text-white shadow-sm">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {hoverPreview && (
            <div
              className="pointer-events-none fixed z-[80] w-[218px] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]"
              style={{ top: hoverPreview.top, left: hoverPreview.left }}
            >
              <div className="relative h-[294px] bg-[#eceef1]">
                <img src={hoverPreview.src} alt="" className="h-full w-full object-cover object-top" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-10">
                  <p className="m-0 text-[15px] font-semibold text-white">{hoverPreview.name}</p>
                  <p className="m-0 text-[12px] text-white/75">Preview model</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "your" && (
        <div className="grid min-h-[176px] place-items-center content-center gap-2 rounded-[10px] border border-dashed border-[#d8d8db] bg-[#fbfbfb] text-[#7a8492]">
          <p className="m-0 text-[13px]">No uploaded models yet</p>
          <button type="button" className="inline-flex items-center gap-1 border-0 bg-transparent text-xs font-semibold text-gray-700" onClick={() => inputRef.current?.click()}>
            <Plus size={13} />
            {labels.upload}
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => handleUpload(event.target.files?.[0])} />
        </div>
      )}
    </div>
  );
}
