"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

const RECENT_OUTFITS = [
  { id: "r1", src: "/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png", label: "Black Dress" },
  { id: "r2", src: "/88147673-f5b7-473b-9d57-aef4b2857b5b.png", label: "Denim Jacket" },
  { id: "r3", src: "/file_00000000d594720ca5615959f86e6a8c.png", label: "White Tee" },
];

type Mode = "single" | "topBottom";

interface OutfitSelectorProps {
  selected: string | null;
  onSelect: (src: string) => void;
  labels: {
    singleClothes: string;
    topBottom: string;
    dropClothing: string;
    orClickUpload: string;
    addTop: string;
    addBottom: string;
    recent: string;
    demo: string;
  };
}

export function OutfitSelector({ selected, onSelect, labels }: OutfitSelectorProps) {
  const [mode, setMode] = useState<Mode>("single");
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* Mode Tabs — Single clothes / Top & bottom */}
      <div className="mb-4 flex gap-0 overflow-hidden rounded-lg border border-gray-200">
        {(["single", "topBottom"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-center text-[12px] font-medium transition-colors ${
              mode === m
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "single" ? labels.singleClothes : labels.topBottom}
          </button>
        ))}
      </div>

      {/* Single clothes mode */}
      {mode === "single" && (
        <div>
          {/* Upload area */}
          <div
            className={`flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
              dragover
                ? "border-gray-400 bg-gray-100"
                : "border-gray-300 bg-gray-50/60 hover:border-gray-400"
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragover(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const result = ev.target?.result;
                  if (typeof result === "string") onSelect(result);
                };
                reader.readAsDataURL(file);
              }
            }}
          >
            <ImagePlus size={28} className="mb-2 text-gray-300" />
            <p className="text-[13px] font-medium text-gray-700">{labels.dropClothing}</p>
            <p className="mt-1 text-[11px] text-gray-400">{labels.orClickUpload}</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const result = ev.target?.result;
                    if (typeof result === "string") onSelect(result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {/* Recent items */}
          <div className="mt-4">
            <p className="mb-2.5 text-[12px] font-medium text-gray-600">{labels.recent}</p>
            <div className="grid grid-cols-3 gap-2">
              {RECENT_OUTFITS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.src)}
                  className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    selected === item.src
                      ? "border-gray-900"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="h-full w-full object-cover"
                    />
                    {/* Demo tag */}
                    <span className="absolute left-1 top-1 rounded bg-amber-400 px-1.5 py-[1px] text-[9px] font-bold text-white">
                      {labels.demo}
                    </span>
                  </div>
                  <p className="truncate px-1.5 py-1 text-[10px] text-gray-500">{item.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top & bottom mode */}
      {mode === "topBottom" && (
        <div className="flex flex-col gap-3">
          {/* Add top */}
          <div className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4 text-center transition-colors hover:border-gray-400">
            <Upload size={18} className="mb-1.5 text-gray-300" />
            <p className="text-[13px] font-medium text-gray-600">{labels.addTop}</p>
          </div>
          {/* Add bottom */}
          <div className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4 text-center transition-colors hover:border-gray-400">
            <Upload size={18} className="mb-1.5 text-gray-300" />
            <p className="text-[13px] font-medium text-gray-600">{labels.addBottom}</p>
          </div>
        </div>
      )}
    </div>
  );
}
