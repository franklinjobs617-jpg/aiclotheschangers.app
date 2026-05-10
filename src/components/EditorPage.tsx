"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Home, Sparkles, Image as ImageIcon, Shirt, User, Clock } from "lucide-react";
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
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [highQuality, setHighQuality] = useState(false);

  const handleGenerate = () => {
    if (!selectedModel || !selectedOutfit) return;
    setIsGenerating(true);
    setTimeout(() => {
      setResultImage(selectedOutfit);
      setIsGenerating(false);
    }, 3000);
  };

  const resultState: "empty" | "loading" | "result" = isGenerating
    ? "loading"
    : resultImage
      ? "result"
      : "empty";

  const ready = selectedModel && selectedOutfit;

  // Navigation items based on locale, default to English
  const isZh = locale === "zh";
  const navItems = [
    { id: "home", label: isZh ? "开始" : "Home", icon: Home },
    { id: "ai-tryon", label: isZh ? "AI试穿" : "AI Try-On", icon: Sparkles, section: isZh ? "创建" : "Create" },
    { id: "ai-create", label: isZh ? "AI服装创建辅助" : "AI Outfit Creator", icon: ImageIcon, section: isZh ? "创建" : "Create" },
    { id: "my-clothes", label: isZh ? "我的衣柜" : "My Wardrobe", icon: Shirt, section: isZh ? "图片" : "Images" },
    { id: "my-models", label: isZh ? "我的模型" : "My Models", icon: User, section: isZh ? "图片" : "Images" },
    { id: "history", label: isZh ? "历史" : "History", icon: Clock },
  ];

  return (
    <div className="editor-page">
      <div className="editor-container">
        {/* Left Sidebar Navigation */}
        <aside className="editor-sidebar">
          <nav className="editor-nav">
            {navItems.map((item, idx) => {
              const showSection = item.section && (idx === 0 || navItems[idx - 1]?.section !== item.section);
              const IconComponent = item.icon;
              return (
                <div key={item.id}>
                  {showSection && (
                    <span className="editor-nav-label">{item.section}</span>
                  )}
                  <button
                    type="button"
                    className={`editor-nav-item ${activeNav === item.id ? "active" : ""}`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <IconComponent size={16} className="mr-2" />
                    {item.label}
                  </button>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="editor-main">
          <div className="editor-workspace">
            {/* Select Clothes Section */}
            <section className="editor-section">
              <h3 className="editor-section-title">
                {isZh ? "选择衣服" : "Select Clothes"}
              </h3>
              <OutfitSelector
                selected={selectedOutfit}
                onSelect={setSelectedOutfit}
                labels={{
                  singleClothes: t("singleClothes"),
                  topBottom: t("topBottom"),
                  dropClothing: t("dropClothing"),
                  orClickUpload: t("orClickUpload"),
                  addTop: t("addTop"),
                  addBottom: t("addBottom"),
                  recent: t("recent"),
                  demo: t("demo"),
                }}
              />
            </section>

            {/* Select Model Section */}
            <section className="editor-section">
              <h3 className="editor-section-title">
                {isZh ? "选择模特" : "Select Model"}
              </h3>
              <p className="editor-section-desc">
                {isZh 
                  ? "选择我们的模特或上传你的模特进行试穿" 
                  : "Select our model or upload your model to try on"}
              </p>
              <ModelSelector
                selected={selectedModel}
                onSelect={setSelectedModel}
                labels={{
                  ourModels: t("ourModels"),
                  yourModels: t("yourModels"),
                  upload: t("upload"),
                }}
              />
            </section>

            {/* Quality Toggle & Generate Button */}
            <div className="editor-actions">
              <div className="editor-quality-toggle">
                <div className="flex items-center gap-2">
                  <span className="editor-quality-label">
                    {isZh ? "高清模式" : "High Quality Mode"}
                  </span>
                  <span className="inline-flex items-center rounded bg-gradient-to-r from-blue-500 to-purple-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    HD
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHighQuality(!highQuality)}
                  className={`editor-toggle ${highQuality ? "active" : ""}`}
                >
                  <span className="editor-toggle-thumb" />
                </button>
              </div>

              <button
                type="button"
                disabled={!ready || isGenerating}
                onClick={handleGenerate}
                className={`editor-generate-button ${!ready ? "disabled" : ""} ${isGenerating ? "loading" : ""}`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isZh ? "生成中..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-center">{isZh ? "生成" : "Generate"}</span>
                    <span className="text-[12px] font-normal opacity-90">
                      {isZh ? "快速-1积分" : "Fast-1 Credit"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Steps Guide */}
        <aside className="editor-guide">
          <div className="editor-guide-card">
            <div className="editor-guide-step">
              <div className="editor-guide-number">1</div>
              <div>
                <h4 className="editor-guide-title">
                  {isZh ? "选择衣服" : "Select Clothes"}
                </h4>
                <p className="editor-guide-text">
                  {isZh 
                    ? "请选择单件或双件衣服，拖拽图片或点击上传" 
                    : "Choose single or multiple items, drag or click to upload"}
                </p>
              </div>
            </div>
            <div className="editor-guide-step">
              <div className="editor-guide-number">2</div>
              <div>
                <h4 className="editor-guide-title">
                  {isZh ? "选择或上传模特" : "Select or Upload Model"}
                </h4>
                <p className="editor-guide-text">
                  {isZh 
                    ? "选择我们的模特或上传你的模特进行试穿" 
                    : "Pick from our models or upload your own"}
                </p>
              </div>
            </div>
            <div className="editor-guide-step">
              <div className="editor-guide-number">3</div>
              <div>
                <h4 className="editor-guide-title">
                  {isZh ? "设定完毕！" : "All Set!"}
                </h4>
                <p className="editor-guide-text">
                  {isZh 
                    ? "点击生成，让我们把衣服穿上吧！" 
                    : "Click Generate and see the magic happen!"}
                </p>
              </div>
            </div>
          </div>

          <ResultPreview
            state={resultState}
            resultSrc={resultImage}
            labels={{
              placeholder: t("resultPlaceholder"),
              subtext: t("resultSubtext"),
              generating: t("generating"),
              fabric: t("trust.fabric"),
              body: t("trust.body"),
              face: t("trust.face"),
            }}
          />
        </aside>
      </div>
    </div>
  );
}
