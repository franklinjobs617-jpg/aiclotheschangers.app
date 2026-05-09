# AI Clothes Changer - 项目开发文档 V1.0

> aiclotheschanger.me | 余味 joyofmay / Buildwithtime时间魔法工坊
> 2026年5月

---

## 一、项目概述

### 1.1 产品定位

极简、高精度的虚拟试穿 Web App，主打 **"先试用，后转化"**，对标竞品 fitroom.app。

### 1.2 核心 Slogan

> **Realistic AI Clothes Changer: Experience True Virtual Try-On Without the Paywall**

### 1.3 竞争策略

| 维度 | FitRoom (竞品) | AI Clothes Changer (我们) |
|------|----------------|--------------------------|
| 付费模式 | 硬付费墙，未看效果先收费 | 免费试用 10 次，满意再付费 |
| 模特多样性 | 缺乏大码/男士模特 | 首发支持 Plus Size + 男士时尚 |
| 技术稳定性 | Android 旋转 Bug、30% 卡死 | EXIF 自动修正、15s 确定性生成 |
| 隐私保护 | 不透明 | 加密处理 + 自动删除 + 一键抹除 |
| 退款机制 | 取消难、扣费投诉多 | 显眼一键取消 + 失败自动返还 Credit |

### 1.4 目标用户

- 网购族：避免"尺码不对"退货的消费者
- 时尚爱好者：探索新风格、搭配灵感
- Plus Size 用户：在竞品中找不到合适模特的群体
- 男性用户：被竞品忽视的试穿需求

---

## 二、技术架构

### 2.1 技术栈 (对齐 ytvidhub)

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | **Next.js 16+ (App Router)** | SSR/SSG 支持 SEO，与 ytvidhub 保持一致 |
| 前端 | React 19 + TypeScript 5 | 与 ytvidhub 版本对齐 |
| 样式 | **Tailwind CSS 3.4** + tailwind-merge + clsx | 与 ytvidhub 保持一致 |
| 动画 | **Framer Motion 12** | 与 ytvidhub 保持一致 |
| 国际化 | **next-intl 4.8** | 与 ytvidhub 完全一致的 i18n 方案 |
| 认证 | **自建 Google OAuth 2.0 + JWT** | 与 ytvidhub 完全一致的认证方案 |
| 支付 | **Stripe** (主) + PayPal (备) | 与 ytvidhub 一致，Stripe Checkout 模式 |
| ORM | **Prisma 6.2** (MySQL) | 与 ytvidhub 保持一致 |
| AI API (首选) | Replicate (IDM-VTON) | SOTA 级面料纹理/折痕渲染 |
| AI API (备选) | Fal.ai | 极速推理，适合低延迟场景 |
| 图片处理 | Sharp / WebP | 服务端图片压缩与格式转换 |
| 内容安全 | Sightengine / Google Cloud Vision | NSFW 图片拦截 |
| 部署 | Vercel | Next.js 原生支持，Edge Functions |
| 分析 | GA4 + Microsoft Clarity + GTM | 与 ytvidhub 保持一致 |

### 2.2 核心 API 流程

```
用户访问网站
    ↓
[0] 认证检查: 未登录 → LoginModel 弹窗 (Google OAuth)
    → 已登录: 从 localStorage 读取 auth_token
    ↓
[1] 检查积分: GET /prod-api/g/checkUser (Bearer token)
    → 积分不足 → 跳转定价页
    ↓
[2] 上传图片 → EXIF 数据校验 & 自动修正 (Android 旋转修复)
    ↓
[3] NSFW 内容审核 (Sightengine / Google Vision)
    ↓
[4] 选择模特 / 服装区域标记
    ↓
[5] 扣除积分: GET /prod-api/g/credits?size=1
    ↓
[6] 调用 IDM-VTON API (Replicate / Fal.ai)
    ↓
[7] 生成结果 → WebP 压缩 → 返回前端展示
    ↓
[8] 自动删除用户上传原图 (隐私保护)
    ↓
[失败时] 自动返还积分 + 赠送1次免费
```

### 2.3 性能指标 (Core Web Vitals)

| 指标 | 目标值 | 说明 |
|------|-------|------|
| LCP (最大内容绘制) | < 2.5s | 首屏工具组件快速可见 |
| FID (首次输入延迟) | < 100ms | 上传/点击即时响应 |
| CLS (累积布局偏移) | < 0.1 | 防止页面元素跳动 |
| 生成时间 | 10-15s | 配合实时步骤文案降低焦虑 |

### 2.4 多语言 (i18n) 实现方案 — 对齐 ytvidhub

**库**: next-intl 4.8 (官方 Next.js 国际化方案)

#### 支持语言 (MVP 阶段 5 种，后续扩展)

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'es', 'de', 'ja', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'  // 英文不带前缀
});
```

#### 目录结构

```
src/
  i18n/
    routing.ts           # 路由配置 (支持语言列表)
    request.ts           # 服务端消息加载 (启动时预缓存 + 深度合并回退)
  messages/
    en.json              # 英语 (默认/回退语言)
    es.json              # 西班牙语
    de.json              # 德语
    ja.json              # 日语
    zh.json              # 中文
  lib/
    globalCacheManager.ts # 客户端语言包预加载缓存管理器 (单例)
  components/
    ui/
      LanguageSwitcher.tsx # 语言切换下拉组件
    LanguagePreloader.tsx  # 挂载时触发全量预加载
  context/
    I18nContext.tsx         # useI18n hook (currentLocale, switchLocale, isSwitching)
```

#### 核心机制

1. **路由**: `[locale]` 动态段，`localePrefix: 'as-needed'` (英文路径无前缀)
2. **服务端加载**: `request.ts` 启动时 `initializeCaches()` 预缓存所有语言包到 `messageCache` Map
3. **深度合并回退**: 目标语言缺失的 key 自动回退到英语
4. **客户端切换**: `LanguageSwitcher` → `globalCacheManager.preloadMessages()` → `router.replace(pathname, { locale })`
5. **中间件**: 禁用 `localeDetection`，设置 `NEXT_LOCALE` cookie (30天)，非默认语言非首页路径重定向到英文版
6. **NextIntl 插件**: `next.config.ts` 中通过 `createNextIntlPlugin("./src/i18n/request.ts")` 注入

#### 翻译文件结构示例 (en.json)

```json
{
  "metadata": {
    "title": "AI Clothes Changer - Virtual Try On Online for FREE",
    "description": "Use the best AI clothes changer to swap outfits instantly."
  },
  "hero": {
    "title": "The Most Realistic AI Clothes Changer",
    "subtitle": "Try 10+ models. No paywall. Free credits.",
    "cta": "Try Now — It's Free"
  },
  "howItWorks": {
    "title": "How to Change Clothes in Photos",
    "step1": "Upload Your Photo",
    "step2": "Select an Outfit",
    "step3": "Get Realistic Result"
  },
  "pricing": {
    "free": "Free Trial",
    "payg": "Pay As You Go",
    "monthly": "Monthly Plan"
  },
  "auth": {
    "loginButton": "Sign in with Google",
    "loginHint": "Get 10 Free Credits"
  }
}
```

---

### 2.5 登录/认证方案 — 对齐 ytvidhub

**方案**: 自建 Google OAuth 2.0 授权码流程 + 自签 JWT (与 ytvidhub 完全一致)

#### 认证流程

```
用户点击 "Sign in with Google"
    ↓
前端 window.open 弹窗 (600x600)
    → Google OAuth URL:
      client_id:    <Google Client ID>
      redirect_uri: https://api.aiclotheschanger.me/prod-api/g/callback
      response_type: code
      scope:        openid email profile
    ↓
Google 授权 → 重定向到后端回调
    ↓
后端 (api.aiclotheschanger.me):
  1. 用授权码换取 access_token
  2. 获取用户信息 (name, email, picture, googleUserId)
  3. 创建/更新数据库用户记录
  4. 签发 JWT
  5. postMessage({ user, token }) 回弹窗
    ↓
前端 window.addEventListener("message"):
  → localStorage.setItem("auth_token", jwt)
  → localStorage.setItem("loggedInUser", JSON.stringify(user))
  → 更新 AuthContext 状态
    ↓
后续 API 请求: Authorization: Bearer <jwt>
```

#### 关键文件

```
src/
  context/
    AuthContext.tsx          # AuthProvider + useAuth hook
  components/
    LoginModel.tsx           # 登录弹窗 UI (Google 按钮 + "Get 10 Free Credits")
    GlobalAuthModal.tsx      # 全局认证弹窗 (挂在根布局)
```

#### AuthContext 核心接口

```ts
interface User {
  name: string;
  picture: string;
  credits: number;
  googleUserId: string;
  email: string;
  plan?: string | null;  // "payg" / "monthly" 等
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: () => void;           // 打开 Google OAuth 弹窗
  logout: () => void;          // 清除 localStorage + 状态
  refreshUser: () => Promise<void>; // 重新获取用户信息
}
```

#### 后端 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/prod-api/g/callback` | GET | Google OAuth 回调，签发 JWT |
| `/prod-api/g/getUser` | GET | 获取当前用户信息 (Bearer token) |
| `/prod-api/g/checkUser` | GET | 检查用户积分余额 |
| `/prod-api/g/credits?size=N` | GET | 扣除 N 个积分 |

#### 数据库模型 (Prisma)

```prisma
model user {
  id             Int      @id @default(autoincrement())
  googleUserId   String   @unique
  email          String
  name           String
  picture        String?
  credits        String   @default("10")   // 注册送10次
  plan           String?                   // "payg" / "monthly"
  lastDailyReward DateTime?
  currentStreak  Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // 多站点隔离: email + type 联合唯一索引
  type           String   @default("clothes")

  @@unique([email, type])
}
```

---

### 2.6 支付方案 — 对齐 ytvidhub

**支付提供商**: Stripe (主) + PayPal (备，MVP 阶段可注释)

#### 定价模型

| 计划 | ID | 价格 | Credits | 说明 |
|------|----|------|---------|------|
| 免费试用 | - | $0 | 10 | 注册即送，每日额外免费额度 |
| Pay As You Go | `payg` | $0.99 / 10次 | 10 | 按量付费，低门槛 |
| Basic 月付 | `a` | $7.99/月 | 100 | 月度订阅 |
| Pro 月付 | `b` | $14.99/月 | 300 | 月度订阅，HD 下载 |

#### 积分消耗规则

```ts
// src/config/credits.ts
export const CREDIT_COSTS = {
  tryOn: 1,          // 1次 AI 试穿 = 1 Credit
  hdDownload: 1,     // HD 下载额外 = 1 Credit
};
```

#### Stripe 集成流程 (与 ytvidhub 一致)

```
用户选择计划 / 积分包
    ↓
前端 POST → https://api.aiclotheschanger.me/prod-api/stripe/getPayUrl
  Body: {
    googleUserId: "...",
    type: "clothes_a_monthly",  // 或 payg / b_monthly
    project: "clothes",
    billingMode: "subscription" | "payment",
    stripePriceId: "price_xxx"
  }
    ↓
后端返回 Stripe Checkout URL
    ↓
window.location.href → Stripe 支付页面
    ↓
支付完成 → 重定向到 /stripePayment?session_id=xxx
    ↓
前端轮询 (最多15次, 间隔2s):
  GET /prod-api/stripe/check-order-status?sessionId=xxx
    ↓
验证成功 → 展示成功页面 → 延迟跳转到首页
    ↓
localStorage 存储购买上下文 (GA4 购买事件追踪)
```

#### 支付相关文件

```
src/
  app/
    [locale]/(main)/
      pricing/page.tsx              # 定价页
      stripePayment/page.tsx        # Stripe 支付回调页
      payment/page.tsx              # PayPal 支付回调页 (备用)
  components/
    pricing/
      PaymentChoiceModal.tsx        # 支付选择弹窗
      CustomCreditSlider.tsx        # 自定义积分滑块 ($0.05/Credit)
  lib/
    stripePurchaseContext.ts        # 购买上下文持久化 (4小时 TTL)
    plan.ts                         # 计划ID → 用户可见标签映射
  app/
    api/
      deduct-credits/route.ts       # 积分扣除中间层 (防重复5秒去重)
```

#### 计划标识映射

```ts
// src/lib/plan.ts
export const PLAN_LABELS: Record<string, string> = {
  "clothes_payg":        "Pay As You Go",
  "clothes_a_monthly":   "Basic",
  "clothes_b_monthly":   "Pro",
};
```

#### 支付回调 GA4 事件追踪

```ts
// stripePurchaseContext.ts — 存入 localStorage (4h TTL)
interface PurchaseContext {
  kind: "subscription" | "credits";
  item_name: string;
  value: number;
  currency: "USD";
  quantity: number;
  item_variant: string;
}
// 支付成功后读取并发送 GA4 purchase 事件
```

---

## 三、SEO 策略

### 3.1 站点架构：Hub and Spoke 模型 (含 i18n 路由)

```
                    ┌─────────────────────────────────┐
                    │    首页 (Hub Page)                │
                    │  /[locale] / (首页)               │
                    │  主词: ai clothes changer          │
                    │  (英文: /, 其他语言: /zh /es 等)    │
                    └──────────┬──────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
   ┌────────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
   │ /[locale]/       │ │ /[locale]/  │ │ /[locale]/       │
   │ plus-size-       │ │ mens-ai-    │ │ virtual-try-on-  │
   │ virtual-try-on/  │ │ clothes/    │ │ clothes/          │
   │ 大码试穿专区      │ │ 男士换装     │ │ 虚拟试穿介绍      │
   └─────────────────┘ └────────────┘ └──────────────────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   /[locale]/blog/       │
                    │   博客 (Blog Hub)        │
                    │   30+ 长尾词文章          │
                    └─────────────────────────┘
```

### 3.2 关键词布局

#### 核心关键词 (首页)

| 关键词 | 月搜索量 | KD | 页面角色 |
|-------|---------|-----|---------|
| ai clothes changer | 15.2K | 52% | TPK (主关键词) |
| virtual try on | 8.5K | 48% | 语义实体 |
| outfit changer | 3.2K | 35% | 辅助词 |

#### 长尾关键词 (专题页 + 博客)

| 关键词 | 月搜索量 | 目标页面 |
|-------|---------|---------|
| plus size virtual try on | 480 | /plus-size-virtual-try-on/ |
| men's ai clothes changer | 320 | /mens-ai-clothes/ |
| virtual try on clothes | 480 | /virtual-try-on-clothes/ |
| how to change clothes with ai | 260 | 博客文章 |
| ai outfit changer online free | 1.1K | 首页辅助 |
| virtual fitting room | 590 | /virtual-try-on-clothes/ |

### 3.3 页面 TDH (Title / Description / H1) 规范

#### 首页

```
Title:  AI Clothes Changer - Virtual Try On Clothes Online for FREE
Desc:   Use the best AI clothes changer to swap outfits in photos instantly.
        Try 10+ models, including plus size and men. No hard paywall, try free!
H1:     The Most Realistic AI Clothes Changer for Virtual Try-On
H2-1:   How to Change Clothes in Photos (3 Simple Steps)
H2-2:   Why Choose Our AI Outfit Changer?
H3s:    Realistic Fabric Textures / Inclusive Body Types / Secure Data
```

#### Plus Size 专题页

```
Title:  AI Plus Size Virtual Try On - Curvy Model Outfit Changer Online
Desc:   See how clothes fit on your body. Our AI plus size virtual try-on
        supports curvy models of all sizes. Free preview, realistic draping.
H1:     Inclusive Plus Size Virtual Try On & AI Clothes Changer
H2-1:   AI Styling for Every Body Shape
H2-2:   Expert Tips for Realistic Curvy Try-On Results
```

#### 男士试穿页

```
Title:  Men's AI Clothes Changer - Virtual Try On for Men's Fashion
Desc:   Try on men's suits, casual wear, and streetwear with AI. Realistic
        fit preview. Free credits for new users.
H1:     AI Clothes Changer Designed for Men's Fashion
```

### 3.4 JSON-LD Schema 结构化数据

```json
// SoftwareApplication Schema (首页)
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI Clothes Changer",
  "url": "https://aiclotheschanger.me",
  "operatingSystem": "Web",
  "applicationCategory": "MultimediaApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free trial with 10 credits"
  },
  "featureList": "Virtual Try-On, AI Outfit Changer, Plus Size Models, Men's Fashion Try-On",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1200",
    "bestRating": "5"
  }
}

// HowTo Schema (首页三步骤)
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Change Clothes with AI",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload Your Photo",
      "text": "Upload a full-body photo or choose from our model gallery"
    },
    {
      "@type": "HowToStep",
      "name": "Select Outfit",
      "text": "Choose the clothing item you want to try on"
    },
    {
      "@type": "HowToStep",
      "name": "Get Realistic Result",
      "text": "AI generates a realistic try-on result in 10-15 seconds"
    }
  ]
}

// ImageObject Schema (展示区图片)
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "AI Virtual Try-On Results",
  "description": "Gallery of AI-generated virtual try-on examples"
}
```

### 3.5 GEO (生成式引擎优化) 策略

- **信息增量模块**：首页增加 "IDM-VTON vs Generic AI" 对比模块，展示褶皱/光影/纹理差异
- **专家 Tips**：上传拍摄建议（自然光、正面全身照），提高 Topical Authority
- **实体覆盖**：确保页面覆盖 Artificial Intelligence, Virtual Try-on, Garment, Fabric Texture, Natural Lighting 等实体

---

## 四、用户体验 (UX) 设计

### 4.1 核心设计原则

1. **Zero-Click Value**：首屏即工具，无需滚动即可开始使用
2. **确定性反馈**：拒绝死板进度条，使用实时步骤文案
3. **信任优先**：隐私提示、免费额度、失败补偿始终可见
4. **移动优先**：83.3% 流量来自移动端，所有交互适配单手操作

### 4.2 页面结构：三位一体

```
┌─────────────────────────────────────────────┐
│                 首屏 (Above the Fold)         │
│  ┌───────────────────────────────────────┐  │
│  │      AI 试穿工具组件                    │  │
│  │  [上传照片] → [选择模特] → [生成按钮]   │  │
│  │  隐私提示: 照片加密处理,完成后自动删除    │  │
│  └───────────────────────────────────────┘  │
│  Hero 文案: 讨厌强制付费? 前10次试穿完全免费  │
├─────────────────────────────────────────────┤
│               中段 (Content Body)             │
│  ┌───────────────────────────────────────┐  │
│  │  How It Works (3 Steps)               │  │
│  │  ① 上传 → ② 选择 → ③ 生成            │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  IDM-VTON vs Generic AI 对比模块       │  │
│  │  (褶皱/光影/纹理 专家对比)              │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  Why Choose Us                        │  │
│  │  - 免费试用 / 大码支持 / 隐私安全       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │  Expert Tips (拍摄建议)                │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│            下段 (Inspiration Gallery)         │
│  ┌───────────────────────────────────────┐  │
│  │  瀑布流展示 20+ 高质量生成案例           │  │
│  │  每张图配有精准 alt 标签                 │  │
│  │  (收割 Google Image 流量)               │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  Footer: About Us | Privacy | ToS | Blog    │
│  (专题页链接 + 权重回传)                      │
└─────────────────────────────────────────────┘
```

### 4.3 移动端适配规范

| 规范 | 要求 |
|------|------|
| 按钮最小高度 | 48px (单手操作) |
| 图片库布局 | 手机 1-2 列，PC 3+ 列 |
| 上传交互 | 支持拖拽 + 相册直选 |
| 进度反馈 | 实时步骤文本（非百分比） |
| Before/After | 滑块对比组件（社交分享钩子） |

### 4.4 关键交互流程

```
用户首次访问
    ↓
看到首屏工具 + Hero 文案 (免费10次)
    ↓
上传照片 (拖拽/相册)
    ↓
[EXIF 自动修正] → [NSFW 审核通过]
    ↓
选择模特分类 (Plus Size / Men / Standard)
    ↓
点击生成 → 实时步骤反馈:
  "正在识别服装实体..." (2s)
  "正在调整光影平衡..." (5s)
  "正在优化面料纹理..." (10s)
  "即将完成..." (13s)
    ↓
展示 Before/After 对比结果
    ↓
下载 / 分享 / 继续试穿
    ↓
[失败时] 自动返还 Credit + 赠送1次免费
```

---

## 五、变现策略 (对齐 ytvidhub)

### 5.1 定价模型 (对齐 ytvidhub 的 Credit 体系)

| 套餐 | ID | 价格 | Credits | 目标用户 |
|------|----|------|---------|---------|
| 免费试用 | - | $0 | 10 (注册即送) | 新用户验证 |
| Pay As You Go | `clothes_payg` | $0.99 / 10 Credits | 10 | 低付费意愿用户 |
| Basic 月付 | `clothes_a_monthly` | $7.99/月 | 100 Credits/月 | 中度用户 |
| Pro 月付 | `clothes_b_monthly` | $14.99/月 | 300 Credits/月 | 重度用户 |

#### 积分消耗规则

```ts
// src/config/credits.ts
export const CREDIT_COSTS = {
  tryOn: 1,          // 1次 AI 试穿 = 1 Credit
  hdDownload: 1,     // HD 下载额外 = 1 Credit
};
```

### 5.2 变现节奏

1. **MVP 阶段**：先跑通 Pay-as-you-go 小额支付
2. **观察期**：1-2 个月监控内容合规性
3. **扩展期**：合规稳定后开启大额订阅

### 5.3 反向收割逻辑 (对标 FitRoom 差评)

- 显眼的 **"一键取消订阅"** 按钮
- 生成失败 → **自动返还 Credit** + 赠送1次
- 透明定价，**无隐藏扣费**

---

## 六、风险管控

### 6.1 内容安全 (三层过滤)

```
输入端过滤
├── NSFW 预防: 接入 Sightengine / Google Vision API
│   → 大面积皮肤裸露、敏感姿态 → 前端拦截
├── 关键词屏蔽: naked, bikini, underwear 等底层屏蔽
└── 实时审核: API 调用前二次校验
```

### 6.2 版权风险

| 措施 | 说明 |
|------|------|
| 用户协议 (ToS) | 上传即视为拥有版权，禁止商业欺诈 |
| 展示区去品牌化 | Gallery 严禁带品牌 Logo 的衣服图片 |
| 原创案例 | 使用 AI 生成的无标服饰展示 |

### 6.3 支付账户保护

- 小额支付先行，降低风险敞口
- 低投诉率 = 支付账户存活关键
- 透明退款逻辑，减少 Stripe/PayPal 争议

### 6.4 隐私合规

- 图片加密传输 (HTTPS + 服务端加密)
- 生成完成 → **自动删除原图**
- 个人中心提供 **"Delete All My Data"** 按钮
- 遵循 GDPR / CCPA 等全球数据保护标准

---

## 七、内链策略 (Link Juice Flow)

```
专题页 → 锚文本 "ai clothes changer" → 首页
专题页之间 → 横向链接 (Side-linking)
  例: 大码页底部推荐 → 男士页
博客文章 → 锚文本链接 → 相关专题页
所有页面 → Footer 回链 → 首页
```

---

## 八、开发里程碑 (对齐 ytvidhub 架构)

### Phase 1: 基础框架 + 认证 + i18n (Week 1-2)

- [ ] 搭建 Next.js 16 项目 (App Router + TypeScript)
- [ ] 配置 Tailwind CSS + Framer Motion
- [ ] 集成 Prisma ORM + MySQL 数据库
- [ ] 实现 Google OAuth 2.0 认证 (AuthContext + LoginModel + GlobalAuthModal)
- [ ] 实现 next-intl 多语言框架 (routing + messages + LanguageSwitcher + globalCacheManager)
- [ ] 实现 `[locale]` 路由 + 中间件 (i18n + www重定向)
- [ ] 部署数据库 + 后端 API 骨架

### Phase 2: MVP 核心功能 (Week 3-4)

- [ ] 集成图片 EXIF 自动修正逻辑 (Android 旋转修复)
- [ ] 对接 IDM-VTON API (Replicate)
- [ ] 实现智能上传组件 (拖拽 + 相册)
- [ ] 实现模特选择器 (含 Plus Size + Men 分类)
- [ ] 实时步骤进度反馈 UI (非百分比)
- [ ] Before/After 对比滑块组件
- [ ] 接入 NSFW 内容审核 API (Sightengine)
- [ ] 隐私保护：图片自动删除 + 一键抹除

### Phase 3: 变现 + 支付 (Week 5-6)

- [ ] 集成 Stripe 支付 (getPayUrl + check-order-status 轮询)
- [ ] 实现 stripePayment 回调页 (15次×2秒轮询)
- [ ] Credit 系统 (注册赠送10次 + 扣除 + 失败返还)
- [ ] 积分扣除 API (deduct-credits 中间层, 5秒防重复)
- [ ] 定价页 (pricing) + PaymentChoiceModal
- [ ] CustomCreditSlider (Pay As You Go)
- [ ] 购买上下文持久化 (GA4 购买事件)
- [ ] 计划标识映射 (plan.ts)

### Phase 4: SEO + 内容 (Week 6-7)

- [ ] JSON-LD Schema 注入 (SoftwareApplication + HowTo + ImageGallery)
- [ ] 语义化 HTML5 结构 (header/main/article/section/footer)
- [ ] 专题页开发 (Plus Size / Men's / Virtual Try-On)
- [ ] Inspiration Gallery 瀑布流 (WebP + alt 标签)
- [ ] 博客系统 + 30 篇长尾词文章
- [ ] 内链策略部署 (锚文本回传 + Side-linking)
- [ ] GEO 信息增量模块 (IDM-VTON vs Generic AI 对比)

### Phase 5: 优化与上线 (Week 7-8)

- [ ] Core Web Vitals 优化 (LCP < 2.5s, 图片WebP, CSS内联)
- [ ] 移动端全面适配测试 (48px 按钮, 单手操作)
- [ ] Android 图片旋转 Bug 回归测试
- [ ] Analytics 部署 (GA4 + Clarity + GTM)
- [ ] Search Console 提交 + sitemap.xml
- [ ] 正式上线

---

## 九、项目目录结构 (对齐 ytvidhub)

```
src/
  app/
    [locale]/                         # i18n 路由 (5种语言)
      layout.tsx                      # 根布局 (NextIntlClientProvider + AuthProvider)
      (main)/                         # 主页面路由组
        layout.tsx                    # Header + Footer
        page.tsx                      # 首页 (Hub)
        pricing/page.tsx              # 定价页
        stripePayment/page.tsx        # Stripe 支付回调页
        payment/page.tsx              # PayPal 支付回调页 (备用)
        plus-size-virtual-try-on/     # Spoke: 大码试穿
        mens-ai-clothes/              # Spoke: 男士试穿
        virtual-try-on-clothes/       # Spoke: 虚拟试穿介绍
        blog/                         # 博客
        about/                        # About Us
        privacy/                      # Privacy Policy
        terms/                        # Terms of Service
    api/                              # Next.js API Routes
      deduct-credits/route.ts         # 积分扣除 (中间层, 防重复5秒去重)
      sync-user/route.ts              # 用户同步
      generate/route.ts               # AI 试穿生成
  components/
    ui/
      LanguageSwitcher.tsx            # 语言切换下拉
    LoginModel.tsx                    # 登录弹窗
    GlobalAuthModal.tsx               # 全局认证弹窗
    LanguagePreloader.tsx             # 语言包预加载
    pricing/
      PaymentChoiceModal.tsx          # 支付选择弹窗
      CustomCreditSlider.tsx          # 积分滑块
  context/
    AuthContext.tsx                    # 认证上下文
    I18nContext.tsx                    # 国际化上下文
  i18n/
    routing.ts                        # 路由配置
    request.ts                        # 服务端消息加载
  messages/
    en.json / es.json / de.json / ja.json / zh.json
  lib/
    globalCacheManager.ts             # 语言包缓存管理器
    stripePurchaseContext.ts          # 购买上下文 (GA4 追踪)
    plan.ts                           # 计划ID映射
  config/
    credits.ts                        # 积分消耗规则
  middleware.ts                       # 中间件 (i18n + www重定向)
prisma/
  schema.prisma                       # 数据库模型
```

---

## 十、页面清单

| 页面 | URL | 类型 | 主关键词 |
|------|-----|------|---------|
| 首页 | `/[locale]/` 或 `/` | Hub | ai clothes changer |
| Plus Size 专区 | `/[locale]/plus-size-virtual-try-on/` | Spoke | plus size virtual try on |
| 男士试穿 | `/[locale]/mens-ai-clothes/` | Spoke | men's ai clothes changer |
| 虚拟试穿介绍 | `/[locale]/virtual-try-on-clothes/` | Spoke | virtual try on clothes |
| 定价页 | `/[locale]/pricing` | 转化 | - |
| 支付回调 | `/[locale]/stripePayment` | 支付 | - |
| About Us | `/[locale]/about` | 信任 | - |
| Privacy Policy | `/[locale]/privacy` | 合规 | - |
| Terms of Service | `/[locale]/terms` | 合规 | - |
| Blog | `/[locale]/blog` | 内容 | 各长尾词 |

---

## 十一、技术执行检查清单

#### 基础设施
- [ ] 域名: aiclotheschanger.me (EMD 优势)
- [ ] Next.js 16 + TypeScript + Tailwind CSS 项目初始化
- [ ] Prisma ORM + MySQL 数据库配置
- [ ] Vercel 部署配置

#### 多语言 (i18n) — 对齐 ytvidhub
- [ ] next-intl 4.8 集成 (routing.ts + request.ts)
- [ ] `[locale]` 路由 + middleware.ts (localeDetection 禁用, NEXT_LOCALE cookie)
- [ ] 5 个语言文件 (en/es/de/ja/zh.json)
- [ ] globalCacheManager.ts (单例缓存管理器)
- [ ] LanguageSwitcher 组件 + LanguagePreloader 组件
- [ ] createNextIntlPlugin 配置 (next.config.ts)

#### 登录/认证 — 对齐 ytvidhub
- [ ] Google OAuth 2.0 弹窗登录 (AuthContext.tsx)
- [ ] 后端回调: 授权码换token → 签发JWT → postMessage
- [ ] localStorage 持久化 (auth_token + loggedInUser)
- [ ] LoginModel 组件 + GlobalAuthModal 组件
- [ ] Bearer token 认证中间件
- [ ] Prisma user 模型 (googleUserId unique, email+type 联合唯一)

#### 支付 — 对齐 ytvidhub
- [ ] Stripe 集成: getPayUrl + Checkout 页面跳转
- [ ] stripePayment 回调页 (15次×2秒轮询 check-order-status)
- [ ] PaymentChoiceModal (订阅 + Pay As You Go)
- [ ] CustomCreditSlider (自定义积分包)
- [ ] deduct-credits API Route (5秒防重复去重)
- [ ] stripePurchaseContext.ts (GA4 购买事件追踪)
- [ ] plan.ts (计划ID → 用户可见标签)

#### 核心功能
- [ ] 首页集成 IDM-VTON API (Replicate)
- [ ] 图片 EXIF 自动修正 (Android 旋转修复)
- [ ] NSFW 内容审核 (Sightengine / Google Vision)
- [ ] Before/After 滑块组件
- [ ] 实时步骤文本进度反馈
- [ ] 失败自动返还 Credit + 赠送1次
- [ ] 一键删除用户数据功能

#### SEO
- [ ] SoftwareApplication + HowTo + ImageGallery Schema
- [ ] 语义化 HTML5 (header/main/article/section/footer)
- [ ] Gallery 图片 WebP 化 + 精准 alt 标签
- [ ] 内链锚文本回传首页权重
- [ ] GEO 信息增量模块 (IDM-VTON 对比)
- [ ] sitemap.xml + robots.txt

#### 性能 & 移动端
- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- [ ] CSS 内联，非核心 JS 延迟加载
- [ ] 按钮高度 >= 48px (移动端)
- [ ] 图片库手机端 1-2 列，PC 端 3+ 列
- [ ] 隐私提示在上传按钮下方可见

#### 分析
- [ ] GA4 部署
- [ ] Microsoft Clarity 部署
- [ ] Google Tag Manager 部署
- [ ] Search Console 提交
