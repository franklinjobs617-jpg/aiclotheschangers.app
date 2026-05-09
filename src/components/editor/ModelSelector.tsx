"use client";

import { useState, useRef } from "react";
import { Check, Plus } from "lucide-react";

const OUR_MODELS = [
  { id: "m1", src: "/85a52f41-3dad-4774-a469-b4ad5f324a7e.webp", name: "Emma" },
  { id: "m2", src: "https://images.insmind.com/market-operations/market/side/f2f8a4a8cf184daf8d01b04c117d82fe/1730889159329.jpg", name: "James" },
  { id: "m3", src: "https://images.insmind.com/market-operations/market/side/3b42fc5d7ade49b3b7df539ba3c0b7c4/1730889163517.jpg", name: "Sophia" },
  { id: "m4", src: "https://images.insmind.com/market-operations/market/side/2eb9275d461341fb9775a5158005a0bd/1730889167016.jpg", name: "Oliver" },
  { id: "m5", src: "https://images.insmind.com/market-operations/market/side/b6d53a681d3644259dcb70bc0ee5e4e6/1730889171190.jpg", name: "Ava" },
  { id: "m6", src: "/88147673-f5b7-473b-9d57-aef4b2857b5b.png", name: "Liam" },
];

type Tab = "our" | "your";

interface ModelSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
  labels: {
    ourModels: string;
    yourModels: string;
    upload: string;
  };
}

export function ModelSelector({ selected, onSelect, labels }: ModelSelectorProps) {
  const [tab, setTab] = useState<Tab>("our");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* Tab bar — Our models / Your models */}
      <div className="mb-4 flex gap-0 overflow-hidden rounded-lg border border-gray-200">
        {(["our", "your"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-center text-[12px] font-medium transition-colors ${
              tab === t
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "our" ? labels.ourModels : labels.yourModels}
          </button>
        ))}
      </div>

      {/* Our models — grid */}
      {tab === "our" && (
        <div>
          {/* Upload button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mb-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 py-2 text-[12px] font-medium text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
          >
            <Plus size={14} />
            {labels.upload}
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden />

          {/* Model grid — 3 columns */}
          <div className="grid grid-cols-3 gap-2.5">
            {OUR_MODELS.map((model) => {
              const isSelected = selected === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onSelect(model.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-gray-900 ring-1 ring-gray-900/10"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={model.src}
                    alt={model.name}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <p className="truncate bg-white px-1.5 py-1 text-center text-[10px] font-medium text-gray-600">
                    {model.name}
                  </p>
                  {isSelected && (
                    <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Your models — empty state */}
      {tab === "your" && (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <p className="text-[13px] text-gray-400">No uploaded models yet</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 flex cursor-pointer items-center gap-1 text-[12px] font-medium text-gray-600 underline-offset-2 hover:underline"
          >
            <Plus size={13} />
            {labels.upload}
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden />
        </div>
      )}
    </div>
  );
}
