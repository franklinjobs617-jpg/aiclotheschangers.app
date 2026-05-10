"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, UploadCloud } from "lucide-react";

const DEMO_OUTFITS = [
  { id: "r1", src: "/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png", label: "Black Dress" },
  { id: "r2", src: "/88147673-f5b7-473b-9d57-aef4b2857b5b.png", label: "Denim Jacket" },
  { id: "r3", src: "/file_00000000d594720ca5615959f86e6a8c.png", label: "White Tee" },
  { id: "r4", src: "/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png", label: "Red Dress" },
  { id: "r5", src: "/88147673-f5b7-473b-9d57-aef4b2857b5b.png", label: "Blue Jacket" },
  { id: "r6", src: "/file_00000000d594720ca5615959f86e6a8c.png", label: "Gray Tee" },
];

type Mode = "single" | "topBottom";
type GalleryFilter = "all" | "top" | "bottom" | "full";

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
    seeAll: string;
    addItem: string;
    allClothes: string;
    regularFit: string;
    looseFit: string;
    top: string;
    bottom: string;
    full: string;
    all: string;
  };
}

export function OutfitSelector({ selected, onSelect, labels }: OutfitSelectorProps) {
  const [mode, setMode] = useState<Mode>("single");
  const [dragover, setDragover] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>("all");
  const [recentOutfits, setRecentOutfits] = useState<Array<{ id: string; src: string; label: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        onSelect(result);
        setRecentOutfits((items) => [
          { id: `${file.name}-${file.lastModified}`, src: result, label: file.name },
          ...items.filter((item) => item.src !== result),
        ].slice(0, 8));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-2.5 flex gap-1 rounded-[9px] bg-[#f3f4f6] p-1">
        {(["single", "topBottom"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`h-8 flex-1 rounded-md border-0 text-[13px] font-medium transition-colors ${
              mode === item ? "bg-white text-gray-950 shadow-sm" : "bg-transparent text-[#667085] hover:text-gray-900"
            }`}
          >
            {item === "single" ? labels.singleClothes : labels.topBottom}
          </button>
        ))}
      </div>

      {mode === "single" && (
        <div>
          <div
            className={`relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-white transition-colors ${
              dragover || selected ? "border-[#168186]" : "border-[#d8d8db] hover:border-[#23a7a0]"
            } ${dragover ? "bg-[#f2fffc]" : ""}`}
            onClick={() => !selected && inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragover(true);
            }}
            onDragLeave={() => setDragover(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragover(false);
              readFile(event.dataTransfer.files?.[0]);
            }}
          >
            {selected ? (
              <>
                <img src={selected} alt="Selected outfit" className="max-h-[120px] max-w-full object-contain" />
                <div className="absolute right-2 bottom-2 flex gap-1.5">
                  <button type="button" className="inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-md border-0 bg-white px-2 text-[11px] font-semibold text-gray-600 shadow" onClick={(event) => event.stopPropagation()}>
                    {labels.regularFit}
                    <span aria-hidden>⌄</span>
                  </button>
                  <button type="button" className="inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-md border-0 bg-white px-2 text-[11px] font-semibold text-gray-600 shadow" onClick={(event) => event.stopPropagation()}>
                    {labels.top}
                    <span aria-hidden>⌄</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-md border-0 bg-white px-2 text-[11px] font-semibold text-gray-600 shadow"
                    aria-label="Upload again"
                    onClick={(event) => {
                      event.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    <UploadCloud size={15} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-7 min-w-7 items-center justify-center gap-1 rounded-md border-0 bg-white px-2 text-[11px] font-semibold text-gray-600 shadow"
                    aria-label="Remove outfit"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect("");
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </>
            ) : (
              <div className="grid place-items-center gap-1">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#168186]">
                  <ImagePlus size={17} />
                  <span>{labels.addItem}</span>
                </div>
                <p className="m-0 text-[11px] font-medium text-[#7a8492]">{labels.orClickUpload}</p>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/heic"
              hidden
              onChange={(event) => readFile(event.target.files?.[0])}
            />
          </div>

          {recentOutfits.length > 0 && (
            <div className="mt-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="m-0 text-[13px] font-semibold text-gray-700">{labels.recent}</p>
                <button type="button" className="border-0 bg-transparent text-[13px] font-semibold text-[#168186]" onClick={() => setShowGallery(true)}>
                  {labels.seeAll}
                </button>
              </div>
              <div className="editor-scroll flex gap-2 overflow-x-auto pb-2">
                {recentOutfits.map((item) => (
                  <button key={item.id} type="button" onClick={() => onSelect(item.src)} className={`relative w-20 flex-none overflow-hidden rounded-lg border-2 bg-gray-100 ${selected === item.src ? "border-[#168186]" : "border-transparent"}`}>
                    <img src={item.src} alt={item.label} className="aspect-[3/4] w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "topBottom" && (
        <div className="grid gap-2">
          {[labels.addTop, labels.addBottom].map((label) => (
            <button type="button" key={label} className="flex h-32 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#d8d8db] bg-white text-[#7a8492] hover:border-[#23a7a0]">
              <Upload size={20} />
              <span className="text-[13px] font-semibold text-gray-600">{label}</span>
              <small className="text-[11px] font-medium">{labels.orClickUpload}</small>
            </button>
          ))}
        </div>
      )}

      {showGallery && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-5" onClick={() => setShowGallery(false)}>
          <div className="relative max-h-[min(680px,calc(100vh-40px))] w-[min(860px,100%)] overflow-hidden rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-[18px] flex items-center gap-4 max-[640px]:items-start max-[640px]:flex-col">
              <h3 className="m-0 flex-1 text-lg font-extrabold">{labels.allClothes}</h3>
              <div className="flex gap-2">
                {[
                  { key: "all", label: labels.all },
                  { key: "top", label: labels.top },
                  { key: "bottom", label: labels.bottom },
                  { key: "full", label: labels.full },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setGalleryFilter(filter.key as GalleryFilter)}
                    className={`rounded-full border-0 px-3.5 py-1.5 text-[13px] font-semibold ${galleryFilter === filter.key ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button type="button" className="grid size-[34px] place-items-center rounded-lg border-0 bg-transparent text-2xl leading-none text-gray-600 hover:bg-gray-100" onClick={() => setShowGallery(false)}>
                ×
              </button>
            </div>
            <div className="editor-scroll grid max-h-[520px] grid-cols-4 gap-3 overflow-y-auto max-[640px]:grid-cols-2">
              {(recentOutfits.length > 0 ? recentOutfits : DEMO_OUTFITS).map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  onClick={() => {
                    onSelect(item.src);
                    setShowGallery(false);
                  }}
                  className={`relative flex-none overflow-hidden rounded-lg border-2 bg-gray-100 ${selected === item.src ? "border-[#168186]" : "border-transparent"}`}
                >
                  <img src={item.src} alt={item.label} className="aspect-[3/4] w-full object-cover" />
                  {recentOutfits.length === 0 && <span className="absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">{labels.demo}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
