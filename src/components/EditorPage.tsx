"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  Clock,
  CreditCard,
  Download,
  HelpCircle,
  Home,
  Layers,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Shirt,
  Trash2,
  User,
} from "lucide-react";
import { OutfitSelector } from "./editor/OutfitSelector";
import { ModelSelector } from "./editor/ModelSelector";
import { ResultPreview } from "./editor/ResultPreview";
import type { Locale } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";

interface EditorPageProps {
  locale: Locale;
}

function TipButton({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="inline-flex h-7 items-center gap-1 rounded-md border-0 bg-transparent px-1.5 text-[12px] font-medium text-[#667085] transition-colors hover:bg-[#f5f7f9] hover:text-[#344054] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23a7a0]/30"
        aria-label={tooltip}
      >
        <HelpCircle size={14} />
        {label}
      </button>
      <span className="pointer-events-none absolute right-0 top-full z-[70] mt-2 hidden w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-[12px] font-medium leading-[18px] text-[#667085] opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.14)] group-hover:block group-hover:opacity-100 group-focus-within:block group-focus-within:opacity-100">
        <span className="absolute -top-1.5 right-5 size-3 rotate-45 border-l border-t border-gray-200 bg-white" />
        {tooltip}
      </span>
    </span>
  );
}

export function EditorPage({ locale }: EditorPageProps) {
  const t = useTranslations("editor");
  const { user, openLoginModal } = useAuth();
  const [activeNav, setActiveNav] = useState("ai-tryon");
  const [selectedModel, setSelectedModel] = useState<string | null>("/models/model-01.webp");
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [highQuality, setHighQuality] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const generationTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const isZh = locale === "zh";
  const progressMessages = [t("progress.identify"), t("progress.light"), t("progress.fabric"), t("progress.finish")];

  useEffect(() => {
    const queuedPhoto = sessionStorage.getItem("editor-upload-photo");
    const queuedModel = sessionStorage.getItem("editor-selected-model");
    if (queuedPhoto) {
      setSelectedModel(queuedPhoto);
      sessionStorage.removeItem("editor-upload-photo");
      return;
    }

    if (queuedModel) {
      setSelectedModel(queuedModel);
      sessionStorage.removeItem("editor-selected-model");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (generationTimerRef.current) window.clearTimeout(generationTimerRef.current);
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
    };
  }, []);

  const handleGenerate = () => {
    if (!selectedOutfit || !selectedModel) {
      setNotice(!selectedOutfit ? t("requiredClothes") : t("requiredModel"));
      return;
    }

    if (!user) {
      setNotice(t("loginRequired"));
      openLoginModal();
      return;
    }

    setNotice(null);
    setHasResult(false);
    setIsGenerating(true);
    setProgressStep(0);

    if (generationTimerRef.current) window.clearTimeout(generationTimerRef.current);
    if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);

    progressTimerRef.current = window.setInterval(() => {
      setProgressStep((step) => Math.min(step + 1, progressMessages.length - 1));
    }, 3000);

    generationTimerRef.current = window.setTimeout(() => {
      setHasResult(true);
      setIsGenerating(false);
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
    }, 12000);
  };

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id !== "ai-tryon") {
      setNotice(t("comingSoon"));
    } else {
      setNotice(null);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/AI换装对比_纯人物无文字-转换自.webp";
    link.download = "ai-clothes-changer-preview.webp";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const generateLabel = !selectedOutfit
    ? t("pickClothesCta")
    : !selectedModel
      ? t("pickModelCta")
      : !user
        ? t("signInGenerate")
        : t("generate");

  const navItems = [
    { id: "home", label: isZh ? "开始" : "Start", icon: Home },
    { id: "ai-tryon", label: isZh ? "AI 试穿" : "AI Try on", icon: Shirt, section: isZh ? "创建" : "Create" },
    { id: "my-clothes", label: isZh ? "我的衣柜" : "My wardrobe", icon: Layers, section: isZh ? "资产" : "Assets" },
    { id: "my-models", label: isZh ? "我的模型" : "My models", icon: User, section: isZh ? "资产" : "Assets" },
    { id: "history", label: isZh ? "历史" : "History", icon: Clock },
  ];

  const accountItems = [
    { label: isZh ? "我的账户" : "My account", icon: User },
    { label: isZh ? "我的套餐" : "My plan", icon: CreditCard },
  ];
  const clothesTip = isZh
    ? "上传单件衣服，或切换到上下装模式分别添加上衣和下装。建议使用清晰、无遮挡的商品图。"
    : "Upload a single garment, or switch to top & bottom mode for separate pieces. Clear product photos work best.";
  const modelTip = isZh
    ? "选择一个内置模特快速预览，也可以上传自己的照片。正面、光线均匀的人像效果更稳定。"
    : "Pick a built-in model for a quick preview, or upload your own photo. Front-facing images with even light work best.";

  const resultState: "empty" | "loading" | "result" = isGenerating ? "loading" : hasResult ? "result" : "empty";
  const sidebarWidth = sidebarCollapsed ? "grid-cols-[72px_420px_minmax(0,1fr)]" : "grid-cols-[232px_420px_minmax(0,1fr)]";
  const navButtonBase =
    "group relative flex min-h-10 w-full items-center gap-2 rounded-lg border-0 px-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23a7a0]/35";
  const tooltipClass =
    "pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-950 px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f7f7]">
      <div className={`editor-shell grid min-h-[calc(100vh-64px)] overflow-hidden transition-[grid-template-columns] duration-200 max-[900px]:grid-cols-1 max-[900px]:overflow-visible ${sidebarWidth}`}>
        <aside className={`relative z-30 flex h-[calc(100vh-64px)] flex-col border-r border-gray-100 bg-white ${sidebarCollapsed ? "px-2 py-3" : "p-3"} max-[900px]:hidden`}>
          <button
            type="button"
            className="absolute top-4 -right-3 z-40 grid size-6 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>

          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const showSection = item.section && (index === 0 || navItems[index - 1]?.section !== item.section);
              const Icon = item.icon;

              return (
                <div key={item.id}>
                  {showSection && !sidebarCollapsed && <span className="block px-2 pt-2.5 pb-1 text-[11px] font-semibold text-[#8b94a3]">{item.section}</span>}
                  <button
                    type="button"
                    className={`${navButtonBase} text-sm font-semibold ${
                      sidebarCollapsed ? "justify-center px-0" : ""
                    } ${activeNav === item.id ? "bg-[#eafffb] text-[#168186]" : "bg-transparent text-[#667085] hover:bg-[#f5f7f9] hover:text-gray-800"}`}
                    aria-label={item.label}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <Icon size={16} className="shrink-0" />
                    {!sidebarCollapsed && <span className="min-w-0 truncate">{item.label}</span>}
                    {sidebarCollapsed && (
                      <span className={tooltipClass} role="tooltip">
                        {item.label}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-1">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  className={`${navButtonBase} text-sm font-medium text-[#5d6675] hover:bg-[#f5f7f9] hover:text-gray-800 ${
                    sidebarCollapsed ? "justify-center px-0" : ""
                  }`}
                  aria-label={item.label}
                  key={item.label}
                >
                  <Icon size={16} className="shrink-0" />
                  {!sidebarCollapsed && <span className="min-w-0 truncate">{item.label}</span>}
                  {sidebarCollapsed && (
                    <span className={tooltipClass} role="tooltip">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="relative z-[1] flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-white shadow-[1px_0_0_#f1f1f1] max-[900px]:order-2 max-[900px]:h-auto max-[900px]:min-h-0">
          <div className="editor-scroll flex-1 overflow-y-auto p-3 pb-[132px]">
            <section className="pb-3 pt-2.5">
              <div className="mb-2.5 flex items-center gap-2.5">
                <h3 className="m-0 flex-1 text-[13px] font-bold leading-[18px] text-[#303741]">{isZh ? "选择衣服" : "Select clothes"}</h3>
                <TipButton label={isZh ? "提示" : "Tips"} tooltip={clothesTip} />
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

            <section className="border-t border-gray-100 py-3.5">
              <div className="mb-2.5 flex items-center gap-2.5">
                <h3 className="m-0 flex-1 text-[13px] font-bold leading-[18px] text-[#303741]">{isZh ? "选择或上传模型" : "Pick or upload a model"}</h3>
                <TipButton label={isZh ? "提示" : "Tips"} tooltip={modelTip} />
              </div>
              <p className="-mt-0.5 mb-2.5 text-[12px] leading-[18px] text-[#667085]">
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
                  all: t("filters.all"),
                  plusSize: t("filters.plusSize"),
                  men: t("filters.men"),
                  women: t("tags.women"),
                }}
              />
            </section>

            <div className="mt-2 flex items-start gap-2 rounded-lg border border-gray-200 bg-[#fbfcfd] px-3 py-2.5 text-[12px] font-medium leading-[1.45] text-[#667085]">
              <AlertCircle size={14} className="mt-px shrink-0 text-[#168186]" />
              <span>{t("privacyNote")}</span>
            </div>

            {notice && (
              <div className="mt-1 flex items-center gap-2 rounded-lg bg-[#fff0eb] px-3 py-2.5 text-[12px] font-semibold text-[#e23d09]" role="alert">
                <AlertCircle size={15} />
                {notice}
              </div>
            )}
          </div>

          <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-3.5 shadow-[0_-1px_4px_rgba(15,23,42,0.08)]">
            <div className="mb-2.5 flex w-fit items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-gray-600">{isZh ? "高清模式" : "High quality mode"}</span>
                <span className="rounded bg-gray-950 px-1.5 py-0.5 text-[10px] font-bold text-white">HD</span>
              </div>
              <button
                type="button"
                onClick={() => setHighQuality(!highQuality)}
                role="switch"
                aria-checked={highQuality}
                className={`relative h-6 w-11 rounded-full border-0 transition-colors ${highQuality ? "bg-[#168186]" : "bg-gray-200"}`}
              >
                <span className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${highQuality ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className={`relative flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-gray-950 text-[15px] font-semibold text-white transition-colors active:scale-[0.98] ${
                isGenerating ? "cursor-wait" : "hover:bg-[#232b38]"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isZh ? "正在为您穿衣..." : "Dressing your model..."}
                </>
              ) : (
                <>
                  <span className="flex-1 text-center">{generateLabel}</span>
                  <span className="absolute top-0 right-0 rounded-tr-[10px] rounded-bl-lg bg-[#168186] px-2 py-[3px] text-[10px] font-bold text-white">
                    {highQuality ? (isZh ? "质量 - 2 积分" : "Quality - 2 credits") : (isZh ? "快速 - 1 积分" : "Fast - 1 credit")}
                  </span>
                </>
              )}
            </button>
          </div>
        </main>

        <section className="flex h-[calc(100vh-64px)] min-w-0 items-center justify-center overflow-hidden bg-[#f7f7f7] max-[900px]:order-1 max-[900px]:h-auto max-[900px]:min-h-0 max-[900px]:py-4">
          <ResultPreview
            state={resultState}
            modelSrc={selectedModel}
            outfitSrc={selectedOutfit}
            progressLabel={progressMessages[progressStep]}
            onReset={() => {
              setHasResult(false);
              setSelectedOutfit(null);
            }}
            onRegenerate={handleGenerate}
            onDownload={handleDownload}
            onDelete={() => {
              setHasResult(false);
              setNotice(t("localDelete"));
            }}
            onFeedback={() => setNotice(t("feedbackThanks"))}
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
              before: t("before"),
              after: t("after"),
              previewOnly: t("previewOnly"),
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
