"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, UploadCloud } from "lucide-react";

const RECENT_OUTFITS = [
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
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file?: File) => {
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
      <div className="editor-segmented">
        {(["single", "topBottom"] as Mode[]).map((item) => (
          <button key={item} type="button" onClick={() => setMode(item)} className={mode === item ? "active" : ""}>
            {item === "single" ? labels.singleClothes : labels.topBottom}
          </button>
        ))}
      </div>

      {mode === "single" && (
        <div>
          <div
            className={`editor-upload-zone ${dragover ? "dragging" : ""} ${selected ? "has-image" : ""}`}
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
                <img src={selected} alt="Selected outfit" className="editor-upload-preview" />
                <div className="editor-upload-actions">
                  <button type="button" onClick={(event) => event.stopPropagation()}>
                    {labels.regularFit}
                    <span aria-hidden>⌄</span>
                  </button>
                  <button type="button" onClick={(event) => event.stopPropagation()}>
                    {labels.top}
                    <span aria-hidden>⌄</span>
                  </button>
                  <button
                    type="button"
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
              <div className="editor-upload-empty">
                <div>
                  <ImagePlus size={17} />
                  <span>{labels.addItem}</span>
                </div>
                <p>{labels.orClickUpload}</p>
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

          <div className="editor-recent">
            <div className="editor-recent-head">
              <p>{labels.recent}</p>
              <button type="button" onClick={() => setShowGallery(true)}>
                {labels.seeAll}
              </button>
            </div>
            <div className="editor-recent-list">
              {RECENT_OUTFITS.map((item) => (
                <button key={item.id} type="button" onClick={() => onSelect(item.src)} className={selected === item.src ? "active" : ""}>
                  <img src={item.src} alt={item.label} />
                  <span>{labels.demo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "topBottom" && (
        <div className="editor-pair-upload">
          {[labels.addTop, labels.addBottom].map((label) => (
            <button type="button" key={label}>
              <Upload size={20} />
              <span>{label}</span>
              <small>{labels.orClickUpload}</small>
            </button>
          ))}
        </div>
      )}

      {showGallery && (
        <div className="editor-gallery-backdrop" onClick={() => setShowGallery(false)}>
          <div className="editor-gallery" onClick={(event) => event.stopPropagation()}>
            <div className="editor-gallery-head">
              <h3>{labels.allClothes}</h3>
              <div>
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
                    className={galleryFilter === filter.key ? "active" : ""}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button type="button" className="editor-gallery-close" onClick={() => setShowGallery(false)}>
                ×
              </button>
            </div>
            <div className="editor-gallery-grid">
              {RECENT_OUTFITS.concat(RECENT_OUTFITS).map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  onClick={() => {
                    onSelect(item.src);
                    setShowGallery(false);
                  }}
                  className={selected === item.src ? "active" : ""}
                >
                  <img src={item.src} alt={item.label} />
                  <span>{labels.demo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
