"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload, Trash2, UploadCloud } from "lucide-react";

const RECENT_OUTFITS = [
  { id: "r1", src: "/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png", label: "Black Dress" },
  { id: "r2", src: "/88147673-f5b7-473b-9d57-aef4b2857b5b.png", label: "Denim Jacket" },
  { id: "r3", src: "/file_00000000d594720ca5615959f86e6a8c.png", label: "White Tee" },
  { id: "r4", src: "/cf2c28fe-55c4-4ddd-b1ca-574628d82657.png", label: "Red Dress" },
  { id: "r5", src: "/88147673-f5b7-473b-9d57-aef4b2857b5b.png", label: "Blue Jacket" },
  { id: "r6", src: "/file_00000000d594720ca5615959f86e6a8c.png", label: "Gray Tee" },
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
  const [showGallery, setShowGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "top" | "bottom" | "full">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* Mode Tabs */}
      <div className="mb-4 flex gap-0 overflow-hidden rounded-lg border border-gray-200">
        {(["single", "topBottom"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-center text-[13px] font-medium transition-colors ${
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
          {/* Upload area with preview and inner action bar */}
          <div
            className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
              dragover
                ? "border-[#23a7a0] bg-teal-50"
                : selected
                  ? "border-[#23a7a0] bg-white"
                  : "border-[#d8d8db] bg-gray-50/60 hover:border-gray-400"
            }`}
            onClick={() => !selected && inputRef.current?.click()}
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
            {selected ? (
              <>
                <img src={selected} alt="Selected" className="max-h-[190px] object-contain" />
                {/* Inner Action Bar - Bottom Right */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {/* Dropdown A - 常规版型 */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>常规版型</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Dropdown B - 上衣 */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>上衣</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {/* Re-upload Button */}
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    <UploadCloud size={16} className="text-gray-600" />
                  </button>
                  {/* Delete Button */}
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect("");
                    }}
                  >
                    <Trash2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <ImagePlus size={36} className="mb-3 text-gray-300" />
                <p className="text-[14px] font-medium text-gray-700">添加物品</p>
                <p className="mt-1 text-[12px] text-gray-400">或拖放到这里</p>
              </>
            )}
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

          {/* Recent items - horizontal scroll with selection state */}
          <div className="mt-4">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-gray-900">{labels.recent}</p>
              <button 
                className="text-[13px] font-medium text-[#23a7a0] hover:text-[#1d8a84]"
                onClick={() => setShowGallery(true)}
              >
                查看所有
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {RECENT_OUTFITS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.src)}
                  className={`group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all ${
                    selected === item.src
                      ? "border-2 border-[#23a7a0]"
                      : "border-2 border-transparent hover:border-gray-300"
                  }`}
                  style={{ width: "80px" }}
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="h-full w-full object-cover"
                    />
                    {/* Badge - Bottom Right Corner */}
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                      演示
                    </span>
                  </div>
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
          <div className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d8d8db] bg-gray-50/60 p-4 text-center transition-colors hover:border-gray-400">
            <Upload size={20} className="mb-2 text-gray-300" />
            <p className="text-[13px] font-medium text-gray-600">{labels.addTop}</p>
            <p className="text-[11px] text-gray-400">或拖放到这里</p>
          </div>
          {/* Add bottom */}
          <div className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d8d8db] bg-gray-50/60 p-4 text-center transition-colors hover:border-gray-400">
            <Upload size={20} className="mb-2 text-gray-300" />
            <p className="text-[13px] font-medium text-gray-600">{labels.addBottom}</p>
            <p className="text-[11px] text-gray-400">或拖放到这里</p>
          </div>
        </div>
      )}

      {/* Gallery Modal/Popover */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-gray-900">你的所有衣服</h3>
              <div className="flex gap-2">
                {/* Filter Chips */}
                {[
                  { key: "all", label: "所有" },
                  { key: "top", label: "上衣" },
                  { key: "bottom", label: "下衣" },
                  { key: "full", label: "全套" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setGalleryFilter(filter.key as typeof galleryFilter)}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                      galleryFilter === filter.key
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Grid Gallery */}
            <div className="grid grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
              {RECENT_OUTFITS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.src);
                    setShowGallery(false);
                  }}
                  className={`group relative cursor-pointer overflow-hidden rounded-lg transition-all ${
                    selected === item.src
                      ? "border-2 border-[#23a7a0]"
                      : "border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  <div className="relative aspect-[3/4]">
                    <img
                      src={item.src}
                      alt={item.label}
                      className="h-full w-full object-cover"
                    />
                    {/* Badge - Bottom Right Corner */}
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                      演示
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
