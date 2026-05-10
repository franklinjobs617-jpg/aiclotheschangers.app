"use client";

import { useRef, useState } from "react";
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
  onSelect: (src: string) => void;
  labels: {
    ourModels: string;
    yourModels: string;
    upload: string;
  };
}

export function ModelSelector({ selected, onSelect, labels }: ModelSelectorProps) {
  const [tab, setTab] = useState<Tab>("our");
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="editor-segmented">
        {(["our", "your"] as Tab[]).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={tab === item ? "active" : ""}>
            {item === "our" ? labels.ourModels : labels.yourModels}
          </button>
        ))}
      </div>

      {tab === "our" && (
        <div className="editor-model-grid">
          <button type="button" className="editor-model-upload" onClick={() => inputRef.current?.click()}>
            <Plus size={27} />
            <span>{labels.upload}</span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => handleUpload(event.target.files?.[0])} />

          {OUR_MODELS.map((model) => {
            const isSelected = selected === model.src;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => onSelect(model.src)}
                className={`editor-model-card ${isSelected ? "active" : ""}`}
              >
                <img src={model.src} alt={model.name} />
                {isSelected && (
                  <span>
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {tab === "your" && (
        <div className="editor-your-models">
          <p>No uploaded models yet</p>
          <button type="button" onClick={() => inputRef.current?.click()}>
            <Plus size={13} />
            {labels.upload}
          </button>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => handleUpload(event.target.files?.[0])} />
        </div>
      )}
    </div>
  );
}
