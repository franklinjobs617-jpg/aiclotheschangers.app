"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  Clock,
  CreditCard,
  Download,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Layers,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  RotateCcw,
  Shirt,
  Trash2,
  User,
} from "lucide-react";
import { OutfitSelector } from "./editor/OutfitSelector";
import { ModelSelector } from "./editor/ModelSelector";
import { ResultPreview } from "./editor/ResultPreview";
import type { Locale } from "@/lib/site";

interface EditorPageProps {
  locale: Locale;
}

export function EditorPage({ locale }: EditorPageProps) {
  const t = useTranslations("editor");
  const [activeNav, setActiveNav] = useState("ai-tryon");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [highQuality, setHighQuality] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isZh = locale === "zh";
  const ready = Boolean(selectedModel && selectedOutfit);

  const handleGenerate = () => {
    if (!selectedOutfit || !selectedModel) {
      setNotice(!selectedOutfit ? t("requiredClothes") : t("requiredModel"));
      return;
    }

    setNotice(null);
    setHasResult(false);
    setIsGenerating(true);

    window.setTimeout(() => {
      setHasResult(true);
      setIsGenerating(false);
    }, 2200);
  };

  const navItems = [
    { id: "home", label: isZh ? "开始" : "Start", icon: Home },
    { id: "ai-tryon", label: isZh ? "AI 试穿" : "AI Try on", icon: Shirt, section: isZh ? "创建" : "Create" },
    { id: "ai-create", label: isZh ? "AI模型创建器" : "AI model creator", icon: ImageIcon, section: isZh ? "创建" : "Create" },
    { id: "my-clothes", label: isZh ? "我的衣柜" : "My wardrobe", icon: Layers, section: isZh ? "资产" : "Assets" },
    { id: "my-models", label: isZh ? "我的模型" : "My models", icon: User, section: isZh ? "资产" : "Assets" },
    { id: "history", label: isZh ? "历史" : "History", icon: Clock },
  ];

  const accountItems = [
    { label: isZh ? "我的账户" : "My account", icon: User },
    { label: isZh ? "我的套餐" : "My plan", icon: CreditCard },
    { label: isZh ? "支持" : "Support", icon: HelpCircle },
  ];

  const resultState: "empty" | "loading" | "result" = isGenerating ? "loading" : hasResult ? "result" : "empty";

  return (
    <div className="editor-page">
      <div className="editor-container">
        <aside className="editor-sidebar">
          <button type="button" className="editor-collapse-button" aria-label="Collapse sidebar">
            <PanelLeftClose size={14} />
          </button>

          <nav className="editor-nav">
            {navItems.map((item, index) => {
              const showSection = item.section && (index === 0 || navItems[index - 1]?.section !== item.section);
              const Icon = item.icon;

              return (
                <div key={item.id}>
                  {showSection && <span className="editor-nav-label">{item.section}</span>}
                  <button
                    type="button"
                    className={`editor-nav-item ${activeNav === item.id ? "active" : ""}`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="editor-sidebar-footer">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <button type="button" className="editor-nav-item muted" key={item.label}>
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="editor-control-panel">
          <div className="editor-workspace">
            <section className="editor-section">
              <div className="editor-section-head">
                <h3 className="editor-section-title">{isZh ? "选择衣服" : "Select clothes"}</h3>
                <button type="button" className="editor-tip-button">
                  <HelpCircle size={14} />
                  {isZh ? "提示" : "Tips"}
                </button>
              </div>
              <OutfitSelector
                selected={selectedOutfit}
                onSelect={(src) => {
                  setSelectedOutfit(src || null);
                  setHasResult(false);
                }}
                labels={{
                  singleClothes: t("singleClothes"),
                  topBottom: t("topBottom"),
                  dropClothing: t("dropClothing"),
                  orClickUpload: t("orClickUpload"),
                  addTop: t("addTop"),
                  addBottom: t("addBottom"),
                  recent: t("recent"),
                  demo: t("demo"),
                  seeAll: t("seeAll"),
                  addItem: t("addItem"),
                  allClothes: t("allClothes"),
                  regularFit: t("regularFit"),
                  looseFit: t("looseFit"),
                  top: t("top"),
                  bottom: t("bottom"),
                  full: t("full"),
                  all: t("all"),
                }}
              />
            </section>

            <section className="editor-section">
              <div className="editor-section-head">
                <h3 className="editor-section-title">{isZh ? "选择或上传模型" : "Pick or upload a model"}</h3>
                <button type="button" className="editor-tip-button">
                  <HelpCircle size={14} />
                  {isZh ? "提示" : "Tips"}
                </button>
              </div>
              <p className="editor-section-desc">
                {isZh ? "选择我们的模型或上传您的模型进行尝试" : "Choose a model or upload your own to try on"}
              </p>
              <ModelSelector
                selected={selectedModel}
                onSelect={(src) => {
                  setSelectedModel(src);
                  setHasResult(false);
                }}
                labels={{
                  ourModels: t("ourModels"),
                  yourModels: t("yourModels"),
                  upload: t("upload"),
                }}
              />
            </section>

            {notice && (
              <div className="editor-notice" role="alert">
                <AlertCircle size={15} />
                {notice}
              </div>
            )}
          </div>

          <div className="editor-actions">
            <div className="editor-quality-toggle">
              <div className="flex items-center gap-2">
                <span className="editor-quality-label">{isZh ? "高清模式" : "High quality mode"}</span>
                <span className="editor-hd-badge">HD</span>
              </div>
              <button
                type="button"
                onClick={() => setHighQuality(!highQuality)}
                role="switch"
                aria-checked={highQuality}
                className={`editor-toggle ${highQuality ? "active" : ""}`}
              >
                <span className="editor-toggle-thumb" />
              </button>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className={`editor-generate-button ${!ready ? "not-ready" : ""} ${isGenerating ? "loading" : ""}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isZh ? "正在为您穿衣..." : "Dressing your model..."}
                </>
              ) : (
                <>
                  <span className="flex-1 text-center">{isZh ? "生成" : "Generate"}</span>
                  <span className="editor-credit-tag">{highQuality ? (isZh ? "质量 - 2 积分" : "Quality - 2 credits") : (isZh ? "快速 - 1 积分" : "Fast - 1 credit")}</span>
                </>
              )}
            </button>
          </div>
        </main>

        <section className="editor-canvas">
          <ResultPreview
            state={resultState}
            modelSrc={selectedModel}
            outfitSrc={selectedOutfit}
            onReset={() => {
              setHasResult(false);
              setSelectedOutfit(null);
            }}
            onRegenerate={handleGenerate}
            labels={{
              placeholder: t("resultPlaceholder"),
              subtext: t("resultSubtext"),
              generating: t("generating"),
              blank: t("blank"),
              stepOneTitle: t("selectClothesTitle"),
              stepOneDesc: t("selectClothesDesc"),
              stepTwoTitle: t("pickUploadTitle"),
              stepTwoDesc: t("pickUploadDesc"),
              stepThreeTitle: t("tryItTitle"),
              stepThreeDesc: t("tryItDesc"),
              download: t("download"),
              newOutfit: t("newOutfit"),
              regenerate: t("regenerate"),
              feedback: t("feedback"),
              delete: t("delete"),
              fabric: t("trust.fabric"),
              body: t("trust.body"),
              face: t("trust.face"),
            }}
            actions={{
              download: <Download size={17} />,
              newOutfit: <Shirt size={17} />,
              regenerate: <RotateCcw size={17} />,
              feedback: <MessageSquare size={17} />,
              delete: <Trash2 size={17} />,
            }}
          />
        </section>
      </div>
    </div>
  );
}
