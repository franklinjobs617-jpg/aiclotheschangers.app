# YTVidHub 多语言 SEO、登录、支付与语言切换实现梳理

分析对象：`E:\前端 github\ytvidhub\ytvidhub`  
参考目标项目：`aiclotheschanger.me` 当前项目  
分析日期：2026-05-09

## 1. 第一性原理诊断

### 1.1 真实目标

这次不是直接复刻 `ytvidhub` 的 UI，而是拆清它的工程机制：

- 多语言路由如何组织。
- 每个语言的 SEO title、description、keywords 如何写入。
- canonical、hreflang、sitemap 如何避免重复收录和错误索引。
- 登录如何从 Google OAuth 进入站内用户态。
- 支付如何发起、回跳、校验和追踪转化。
- 这些机制如何迁移到 `aiclotheschanger.me`，并保持当前首页已经确定的克制、真实、非 AI 模板风格。

### 1.2 根因

`ytvidhub` 的核心价值不在某个单独组件，而在它把「SEO 页面」、「多语言首页」、「付费/积分系统」、「登录态」集中到 Next.js App Router 的全局布局、middleware、i18n 配置和业务 hook 中。

它的实现不是纯静态页面模式，而是：

- URL 层通过 `next-intl` 控制 locale。
- 文案层通过 `src/messages/*.json` 管理。
- SEO 层通过 `generateMetadata` 和 sitemap 输出。
- 登录态通过 `AuthProvider` 包住全站。
- 支付由后端统一生成 Stripe/PayPal checkout URL，前端只负责发起和回跳确认。

### 1.3 约束和边界

- `ytvidhub` 并没有所有页面都做完整多语言，实际只有首页做了完整多语言，其它页面被 middleware 临时导回英文页面。
- 它没有使用 NextAuth，而是使用自建 Google OAuth + JWT localStorage 方案。
- 支付 webhook 不在前端仓库内，前端只能看到 checkout 发起、回跳轮询、用户积分同步和 GA4 购买事件补偿。
- 文档只做实现梳理，不直接改当前项目代码。

### 1.4 验证标准

本次文档应能回答：

- 新增一个语言时要改哪些文件。
- 新增一个 SEO 页面时 title/description/canonical/hreflang 应写在哪里。
- 为什么 `ytvidhub` 不是所有页面都输出所有语言 alternate。
- 用户点击登录后 token 和 user 存在哪里。
- 点击购买后，前端传什么参数给后端，后端返回什么，回跳页如何确认支付。
- 当前 `aiclotheschanger.me` 如果要迁移，哪些可以直接借鉴，哪些要规避。

## 2. 项目技术栈概览

关键依赖来自 `package.json`：

- `next@16.1.0`
- `react@19.2.3`
- `next-intl@4.8.2`
- `lucide-react`
- `sonner`
- `nextjs-toploader`
- `@prisma/client` / `prisma`
- `jsonwebtoken`

整体是 Next.js App Router 项目，核心目录如下：

| 模块 | 路径 |
|---|---|
| App Router 页面 | `src/app/[locale]/...` |
| i18n 路由 | `src/i18n/routing.ts` |
| i18n 请求消息加载 | `src/i18n/request.ts` |
| middleware | `src/middleware.ts` |
| 多语言消息 | `src/messages/*.json` |
| SEO 工具 | `src/lib/seo.ts`, `src/lib/url.ts` |
| 登录上下文 | `src/context/AuthContext.tsx` |
| 登录弹窗 | `src/components/LoginModel.tsx`, `src/components/GlobalAuthModal.tsx` |
| 支付组件 | `src/components/pricing/*` |
| 支付回跳 | `src/app/[locale]/(main)/stripePayment/page.tsx`, `src/app/[locale]/(main)/payment/page.tsx` |
| 积分 API 封装 | `src/lib/api.ts`, `src/app/api/deduct-credits/route.ts`, `src/app/api/sync-user/route.ts` |

## 3. 多语言路由设计

核心文件：`src/i18n/routing.ts`

```ts
export const routing = defineRouting({
  locales: ['en', 'es', 'de', 'ko', 'ja', 'ru', 'tr', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
```

### 3.1 locales

支持语言：

- `en`
- `es`
- `de`
- `ko`
- `ja`
- `ru`
- `tr`
- `zh`

### 3.2 defaultLocale

默认语言是 `en`。

### 3.3 localePrefix: as-needed

这是一个很关键的 SEO 选择：

- 英文首页：`https://ytvidhub.com/`
- 中文首页：`https://ytvidhub.com/zh/`
- 西语首页：`https://ytvidhub.com/es/`

默认语言不带 `/en`，非默认语言才带语言前缀。

这个模式适合英文为主站、其它语言作为扩展市场的站点。对 `aiclotheschanger.me` 来说，如果英文也是主市场，也可以采用这个结构。

### 3.4 createNavigation

同文件中：

```ts
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

项目内不要直接使用 `next/link` 或 `next/navigation` 的普通 router 来做多语言页面跳转，而是使用这里导出的：

- `Link`
- `useRouter`
- `usePathname`

这样切换语言时，next-intl 才能正确处理 locale 前缀。

## 4. 多语言消息加载与英文回退

核心文件：`src/i18n/request.ts`

这个文件负责服务端请求时加载语言包。

### 4.1 语言包位置

语言包放在：

```txt
src/messages/en.json
src/messages/es.json
src/messages/de.json
src/messages/ko.json
src/messages/ja.json
src/messages/ru.json
src/messages/tr.json
src/messages/zh.json
```

### 4.2 英文作为基础回退

实现逻辑：

1. 先加载 `en.json` 作为 `baseMessages`。
2. 如果当前语言是英文，直接返回英文。
3. 如果当前语言不是英文，加载目标语言 JSON。
4. 使用 `deepMerge(baseMessages, targetMessages)` 合并。
5. 目标语言缺失的 key 自动回退到英文。

这点很适合 SEO 项目，因为页面文案很多，翻译经常不完整。用英文兜底可以避免页面因为缺少字段报错。

### 4.3 语言包预加载

客户端还有一套预加载机制：

- `src/lib/globalCacheManager.ts`
- `src/components/LanguagePreloader.tsx`
- `src/context/I18nContext.tsx`

`LanguagePreloader` 在客户端加载后会预加载所有语言 JSON：

```ts
globalCacheManager.preloadMultiple(['en', 'es', 'de', 'ko', 'ja', 'ru', 'tr', 'zh'])
```

这样语言切换时感知更快。

注意：如果未来语言包很大，全部预加载可能增加首屏后的网络压力。对 `aiclotheschanger.me`，建议先只预加载当前语言和英文，hover 或打开语言菜单时再加载其它语言。

## 5. 首页 SEO Metadata 写法

核心文件：`src/app/[locale]/layout.tsx`

全局布局里定义了 `generateMetadata`：

```ts
const t = await getTranslations({ locale, namespace: "metadata" });

return {
  metadataBase: new URL(SITE_ORIGIN),
  title: t("title"),
  description: t("description"),
  keywords: t("keywords").split(", "),
  openGraph: {
    title: t("title"),
    description: t("description"),
    url: currentUrl,
    siteName: "YTVidHub",
    locale: getOpenGraphLocale(locale),
    type: "website",
    images: [{ url: `/image/yyt.png`, width: 1200, height: 630, alt: t("title") }],
  },
  twitter: {
    card: "summary_large_image",
    title: t("title"),
    description: t("description"),
    images: [`/image/yyt.png`],
  },
  alternates: {
    canonical: currentUrl,
    languages: {
      en: buildCanonicalUrl({ locale: "en", pathname: "" }),
      es: buildCanonicalUrl({ locale: "es", pathname: "" }),
      de: buildCanonicalUrl({ locale: "de", pathname: "" }),
      ko: buildCanonicalUrl({ locale: "ko", pathname: "" }),
      ja: buildCanonicalUrl({ locale: "ja", pathname: "" }),
      ru: buildCanonicalUrl({ locale: "ru", pathname: "" }),
      tr: buildCanonicalUrl({ locale: "tr", pathname: "" }),
      zh: buildCanonicalUrl({ locale: "zh", pathname: "" }),
      "x-default": buildCanonicalUrl({ locale: "en", pathname: "" }),
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

### 5.1 title/description 来源

来自 `src/messages/en.json` 的 `metadata` namespace：

```json
{
  "metadata": {
    "title": "YouTube Subtitle Downloader - Download SRT, VTT, TXT Captions Free | YTVidHub",
    "description": "Free YouTube subtitle downloader. Download SRT, VTT, TXT captions from any video, playlist or channel. Supports bulk extraction and AI-powered video summarizer.",
    "keywords": "youtube subtitle downloader, download youtube subtitles, youtube caption downloader, free subtitle downloader, youtube transcript downloader, bulk youtube subtitle downloader"
  }
}
```

其它语言的 title/description 也应放在对应 `messages/{locale}.json` 的同一路径里。

### 5.2 OpenGraph

OpenGraph 使用同一组 `metadata.title` 和 `metadata.description`，图片固定为 `/image/yyt.png`。

`locale` 字段通过映射转换：

| locale | og locale |
|---|---|
| en | en_US |
| es | es_ES |
| de | de_DE |
| ko | ko_KR |
| ja | ja_JP |
| ru | ru_RU |
| tr | tr_TR |
| zh | zh_CN |

### 5.3 Twitter Card

Twitter 也复用 title、description 和图片。

### 5.4 robots

首页明确允许收录：

- `index: true`
- `follow: true`
- `max-image-preview: large`
- `max-snippet: -1`

这对 SEO 工具站是合理的默认设置。

## 6. 页面级 SEO Metadata 写法

`ytvidhub` 有两种 metadata 写法。

### 6.1 方式一：从 messages 读取

首页是这种模式，适合真正多语言页面。

优点：

- title/description 跟随 locale。
- 翻译集中在 JSON 中。
- 可以直接生成多语言 hreflang。

适合 `aiclotheschanger.me` 的页面：

- 首页
- 如果未来做完整多语言的核心 SEO 页面，例如 `/ai-clothes-changer`、`/virtual-try-on`

### 6.2 方式二：页面 layout 中写死英文

例如 `src/app/[locale]/(main)/pricing/layout.tsx`：

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = buildAlternates(locale, "/pricing");

  return {
    title: "Pricing | YTVidHub - Bulk YouTube Subtitle Downloader",
    description:
      "Choose the perfect plan for your research or content creation. From free starter plans to high-volume researcher packages.",
    alternates,
  };
}
```

例如 `src/app/[locale]/(main)/about/layout.tsx`：

```ts
return {
  title: 'About YTVidHub | Our Mission & Contact Information',
  description: 'Learn about the mission behind YTVidHub...',
  alternates: buildAlternates(locale, '/about'),
};
```

这种方式说明：这些页面虽然在 `[locale]` 目录下，但实际 SEO 内容仍以英文为主。

### 6.3 对当前项目的建议

`aiclotheschanger.me` 不建议所有页面一开始都伪多语言。更好的策略是：

- 已经完整翻译的页面：用 messages 读取 title/description，并输出所有 hreflang。
- 只有英文内容的页面：只输出英文 canonical 和 `x-default`，不要假装有其它语言版本。

否则 Google 可能认为多语言页面内容重复或低质量。

## 7. canonical、hreflang 与 URL 构造

核心文件：

- `src/lib/url.ts`
- `src/lib/seo.ts`

### 7.1 canonical URL 构造

`src/lib/url.ts`：

```ts
export const SITE_ORIGIN = 'https://ytvidhub.com'

export const buildCanonicalUrl = ({ locale, pathname }: CanonicalUrlParams = {}): string => {
  const localeSegment = locale && locale !== 'en' ? trimSlashes(locale) : ''
  const pathSegment = pathname ? trimSlashes(pathname) : ''
  const joinedPath = [localeSegment, pathSegment].filter(Boolean).join('/')
  const finalPath = `/${joinedPath}`.replace(/\/+$/, '') + '/'
  return new URL(finalPath, SITE_ORIGIN).toString()
}
```

规则：

- 英文不带 `/en`。
- 非英文带语言前缀。
- 结尾统一保留 `/`。
- 使用固定站点域名 `https://ytvidhub.com`。

### 7.2 alternates 构造

`src/lib/seo.ts`：

```ts
export function buildAlternates(locale: string, pathname: string, isMultilingual = false) {
  const languages: Record<string, string> = {
    'en': buildCanonicalUrl({ locale: 'en', pathname }),
    'x-default': buildCanonicalUrl({ locale: 'en', pathname }),
  };

  if (isMultilingual) {
    routing.locales.forEach(l => {
      if (l !== 'en') {
        languages[l] = buildCanonicalUrl({ locale: l, pathname });
      }
    });
  }

  return {
    canonical: buildCanonicalUrl({ locale, pathname }),
    languages,
  };
}
```

关键点：

- 默认只输出 `en` 和 `x-default`。
- 只有 `isMultilingual = true` 时才输出全部语言。

这是非常重要的 SEO 防错机制：没有完整翻译的页面不应输出一堆假的 hreflang。

## 8. Sitemap 策略

核心文件：`src/app/sitemap.ts`

项目把页面分成两类：

### 8.1 English-only pages

例如：

- `/youtube-subtitle-downloader`
- `/youtube-transcript-generator`
- `/pricing`
- `/about`
- `/support`
- `/privacy-policy`
- `/terms-of-service`

这些只生成英文 URL：

```ts
sitemap.push({
  url: buildCanonicalUrl({ pathname: page.path }),
  lastModified: currentDate,
  changeFrequency: page.changeFreq,
  priority: page.priority,
})
```

### 8.2 multilingual pages

当前只看到首页：

```ts
const multilingualPages = [
  { path: '', priority: 1.0, changeFreq: 'weekly' as const },
]
```

首页为每个 locale 生成 URL，并写入 alternates。

### 8.3 对当前项目的建议

`aiclotheschanger.me` 可以直接借鉴这个分类：

- 首页如果有完整多语言：进入 `multilingualPages`。
- `/pricing`、`/about`、`/mens-ai-clothes-changer`、`/plus-size-virtual-try-on` 如果只有英文：先放 `englishOnlyPages`。
- 如果未来某个页面完成本地化，再从 English-only 移入 multilingual。

## 9. Middleware 策略

核心文件：`src/middleware.ts`

### 9.1 next-intl middleware

配置：

```ts
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
  alternateLinks: false,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: true,
    path: '/',
  }
});
```

含义：

- 关闭自动语言检测：`localeDetection: false`
- 不让 middleware 自动插入 alternate links：`alternateLinks: false`
- 手动设置语言 cookie：`NEXT_LOCALE`

关闭自动语言检测对 SEO 更稳定，因为用户访问 URL 不会被浏览器语言自动重定向。

### 9.2 canonical 域名重定向

middleware 会把：

- `www.ytvidhub.com`
- `http://ytvidhub.com`

统一 301 到：

- `https://ytvidhub.com`

### 9.3 非完整多语言页面保护

代码中有临时 i18n guard：

如果路径是非默认语言，并且不是首页，就重定向到英文路径。

例子：

- `/zh/pricing` -> `/pricing`
- `/es/about` -> `/about`

目的：

- 避免部分本地化页面服务端报错。
- 避免搜索引擎收录没有真正翻译的页面。

这个策略很值得当前项目借鉴。尤其 `aiclotheschanger.me` 如果现在主要是英文站，不要因为目录支持 `[locale]` 就让所有页面自动变成多语言 URL。

## 10. 语言切换 UI

核心文件：`src/components/ui/LanguageSwitcher.tsx`

### 10.1 语言列表

组件内硬编码：

```ts
const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
  { code: "zh", label: "中文" },
];
```

终端读取时出现乱码，但源码意图是上面这些语言名。

### 10.2 切换逻辑

组件使用：

- `useLocale` 获取当前语言。
- `useRouter` 和 `usePathname` 来替换当前路径。
- `startTransition` 避免切换时阻塞 UI。
- `globalCacheManager.preloadMessages(nextLocale)` 提前加载目标语言包。

关键逻辑：

```ts
if (!isHomePath && nextLocale !== routing.defaultLocale) {
  toast.info("Only the homepage is fully localized right now. Switched to the selected locale homepage.");
  router.replace("/", { locale: nextLocale });
} else {
  router.replace(pathname, { locale: nextLocale });
}
```

含义：

- 如果当前在首页，可以切换到任意语言首页。
- 如果当前在非首页，切换到非英文时，会跳到对应语言首页。
- 如果切回英文，保留当前路径。

这与 middleware 的策略一致：只有首页完整多语言。

### 10.3 UI 结构

语言切换器是一个下拉菜单：

- 按钮：Globe + 当前语言 + ChevronDown。
- 菜单：每个语言一个 button。
- 当前语言高亮。
- 切换中显示 loading spinner。
- 点击外部关闭。

### 10.4 对当前项目的建议

当前项目如果要做语言切换，建议保持更克制：

- 不要使用旗帜 emoji，容易乱码，也容易产生非专业感。
- 使用 `EN / ES / DE / ZH` 这种短码更稳。
- 样式保持首页统一：细边框、白底、黑灰文字、hover 浅灰。
- 如果非首页未翻译，切换语言时跳转到对应语言首页，并给轻提示。

## 11. 登录认证实现

核心文件：

- `src/context/AuthContext.tsx`
- `src/components/LoginModel.tsx`
- `src/components/GlobalAuthModal.tsx`

### 11.1 全站 AuthProvider

在 `src/app/[locale]/layout.tsx` 中：

```tsx
<NextIntlClientProvider messages={messages} locale={locale}>
  <AuthProvider>
    ...
    {children}
    <GlobalAuthModal />
  </AuthProvider>
</NextIntlClientProvider>
```

这意味着所有页面都能通过 `useAuth()` 获取：

- `user`
- `isLoading`
- `login`
- `logout`
- `refreshUser`
- `openLoginModal`
- `closeLoginModal`
- `isLoginModalOpen`

### 11.2 用户数据结构

`AuthContext.tsx` 中定义：

```ts
interface User {
  name: string;
  picture: string;
  credits: number;
  googleUserId: string;
  email: string;
  plan?: string | null;
}
```

### 11.3 localStorage 持久化

使用两个 key：

- `auth_token`
- `loggedInUser`

初始化时：

- 如果 token 和 saved user 都存在，直接恢复 user。
- 如果没有 token 但有 saved user，删除 saved user。

退出登录：

```ts
localStorage.removeItem("loggedInUser");
localStorage.removeItem("auth_token");
setUser(null);
window.location.reload();
```

### 11.4 Google OAuth 登录流程

登录不是 NextAuth，而是自建 OAuth 弹窗：

1. 前端拼接 Google OAuth URL。
2. 使用 `window.open` 打开 600x600 弹窗。
3. Google 登录完成后回到后端：
   - `https://api.ytvidhub.com/prod-api/g/callback`
4. 后端通过 `postMessage` 把 token 信息发回主窗口。
5. 前端校验 `event.origin === BASE_URL`。
6. 解析 `event.data.token`。
7. 取出 `user` 和 `jwtToken`。
8. 用 JWT 再请求一次 `getUser` 获取最新用户数据。
9. 写入 localStorage，并关闭登录弹窗。

相关常量：

```ts
const BASE_URL = "https://api.ytvidhub.com";
const GOOGLE_CLIENT_ID = "...apps.googleusercontent.com";
const BACKEND_REDIRECT_URI = "https://api.ytvidhub.com/prod-api/g/callback";
```

### 11.5 用户刷新

`refreshUser` 调用：

```txt
GET https://api.ytvidhub.com/prod-api/g/getUser
Authorization: Bearer {token}
```

并有两个防重复机制：

- `isRefreshingRef`
- `MIN_REFRESH_INTERVAL = 2000`

避免短时间重复请求用户信息。

### 11.6 登录弹窗

`LoginModel.tsx` 是全局弹窗：

- 中间弹层。
- 白底、圆角、阴影。
- Logo。
- `Continue with Google` 按钮。
- 新用户提示：免费 credits。

对当前项目建议：

- 登录弹窗可以保留这种结构。
- 但视觉要与首页统一，避免大圆角、夸张阴影、AI 图标、闪电图标。
- 文案可改成 `Sign in to save try-ons and use your free credits.`

## 12. API 封装与积分系统

核心文件：

- `src/lib/api.ts`
- `src/config/credits.ts`
- `src/app/api/sync-user/route.ts`
- `src/app/api/deduct-credits/route.ts`

### 12.1 积分成本

`src/config/credits.ts`：

```ts
export const CREDIT_COSTS = {
  download: 1,
  summary: 2,
  studyCards: 1,
} as const;
```

YTVidHub 中：

- 下载字幕：1 credit。
- AI 总结：2 credits。
- study cards：1 credit。

对 `aiclotheschanger.me` 可迁移为：

- 单次衣服替换：1 credit。
- 高清/多图批量：更多 credits。
- 注册赠送：10 free credits，与你 about 文案一致。

### 12.2 authenticatedFetch

`src/lib/api.ts` 封装了带 token 请求：

- 从 localStorage 读取 `auth_token`。
- 自动加 `Authorization: Bearer {token}`。
- 如果 body 存在，自动设置 `Content-Type: application/json`。
- 统一处理 HTTP 错误。
- 402 特殊处理为 `INSUFFICIENT_CREDITS`。

### 12.3 sync-user

本地 API：

```txt
GET /api/sync-user
Authorization: Bearer {token}
```

它代理到：

```txt
GET https://api.ytvidhub.com/prod-api/g/getUser
```

用途：

- 获取最新积分。
- 避免前端业务组件到处直接写外部 API。

### 12.4 deduct-credits

本地 API：

```txt
POST /api/deduct-credits
Authorization: Bearer {token}
body: { amount, reason }
```

内部逻辑：

1. 校验 token。
2. 获取当前用户。
3. 判断 credits 是否足够。
4. 使用 `recentDeductions` 做 5 秒重复扣费保护。
5. 调用后端扣积分接口：
   ```txt
   GET https://api.ytvidhub.com/prod-api/ytdlp/credits?size={amount}
   ```
6. 扣费成功后再查询剩余积分。
7. 返回 `remainingCredits`。

这个重复扣费保护非常值得迁移，尤其 AI 图片生成类产品容易出现按钮重复点击、请求重试、页面刷新导致重复扣点。

## 13. 支付实现

核心文件：

- `src/components/pricing/PaymentChoiceModal.tsx`
- `src/components/pricing/CustomCreditSlider.tsx`
- `src/hooks/useStripeCheckout.ts`
- `src/hooks/useSubtitleDownloader.types.ts`
- `src/lib/stripePurchaseContext.ts`
- `src/app/[locale]/(main)/stripePayment/page.tsx`
- `src/app/[locale]/(main)/payment/page.tsx`

## 13.1 订阅套餐映射

在 `PaymentChoiceModal.tsx` 和 `useSubtitleDownloader.types.ts` 中都有类似映射：

```ts
const STRIPE_SUBSCRIPTION_TYPE_MAP = {
  a: "ytvid_a_monthly",
  b: "ytvid_b_monthly",
  c: "ytvid_c_yearly",
};
```

Stripe price id 来自环境变量：

```ts
const STRIPE_SUBSCRIPTION_PRICE_ID_MAP = {
  a: process.env.NEXT_PUBLIC_STRIPE_YTVID_A_MONTHLY_PRICE_ID,
  b: process.env.NEXT_PUBLIC_STRIPE_YTVID_B_MONTHLY_PRICE_ID,
  c: process.env.NEXT_PUBLIC_STRIPE_YTVID_C_YEARLY_PRICE_ID,
};
```

购买归因信息：

```ts
const STRIPE_PURCHASE_META_MAP = {
  a: { item_name: "YTVidHub Pro Subscription", value: 19.99, item_variant: "monthly" },
  b: { item_name: "YTVidHub Premium Subscription", value: 29.99, item_variant: "monthly" },
  c: { item_name: "YTVidHub Researcher Subscription", value: 199, item_variant: "yearly" },
};
```

### 13.2 Stripe checkout 发起流程

`useStripeCheckout.ts` 中：

1. 判断用户是否登录。
2. 根据 planId 找到 subscription type 和 Stripe price id。
3. 调用：

```txt
POST https://api.ytvidhub.com/prod-api/stripe/getPayUrl
```

body：

```json
{
  "googleUserId": "用户 Google ID",
  "type": "ytvid_a_monthly",
  "project": "ytvidhub",
  "billingMode": "subscription",
  "stripePriceId": "price_xxx"
}
```

4. 后端返回 checkout URL。
5. 前端保存购买上下文。
6. `window.location.href = checkoutUrl` 跳转到 Stripe。

### 13.3 一次性购买 credits

`CustomCreditSlider.tsx` 支持自定义积分包：

```ts
const price = (quantity * 0.05).toFixed(2);
```

请求：

```txt
POST https://api.ytvidhub.com/prod-api/stripe/getPayUrl
```

body：

```json
{
  "googleUserId": "用户 Google ID",
  "project": "ytvidhub",
  "type": "yt_credits_custom",
  "quantity": 100,
  "billingMode": "payment"
}
```

区别：

- 订阅：`billingMode: "subscription"`
- 积分包：`billingMode: "payment"`

### 13.4 Stripe 购买上下文

核心文件：`src/lib/stripePurchaseContext.ts`

localStorage key：

```txt
stripe_purchase_context
```

TTL：

```txt
4 小时
```

保存内容：

```ts
{
  kind: "subscription" | "credits",
  item_name: string,
  value: number,
  currency?: string,
  quantity?: number,
  item_variant?: string,
  createdAt: number
}
```

用途：

- Stripe 回跳 URL 只有 session_id，不一定包含套餐名和金额。
- 前端先保存购买上下文，回跳后再用它补全 GA4 purchase 事件。

### 13.5 Stripe 回跳验证

核心文件：`src/app/[locale]/(main)/stripePayment/page.tsx`

从 URL 获取：

```ts
const sessionId = searchParams.get("session_id");
```

然后轮询：

```txt
GET https://api.ytvidhub.com/prod-api/stripe/check-order-status?sessionId={sessionId}
```

逻辑：

- 每 2 秒检查一次。
- 最多 15 次。
- 如果 `result.data === "paid"`，显示成功。
- 超时显示 still processing。
- 缺少 session_id 显示 error。

支付成功后：

1. 读取 `stripe_purchase_context`。
2. 组装 GA4 purchase payload。
3. 保存到 `ga4_pending_purchase`。
4. 调用 `trackPurchaseWithRetry`。
5. 成功后清理 pending 和 stripe context。

### 13.6 PayPal 支付逻辑

`PaymentChoiceModal.tsx` 中 PayPal 按钮当前被注释，但逻辑存在：

- 创建订阅接口：
  ```txt
  POST https://api.ytvidhub.com/prod-api/paypal/smart/create-subscription
  ```
- 支持后端返回：
  - approve URL
  - subscription id
  - links 中的 approve/payer-action href
- 保存 pending context：
  ```txt
  pending_paypal_payment
  ```

`payment/page.tsx` 是 PayPal 回跳页：

- 读取 URL query 中的 `token`、`orderId`、`subscription_id`、`ba_token`。
- 请求：
  ```txt
  GET https://api.ytvidhub.com/prod-api/paypal/retUrl?{query}
  ```
- 轮询：
  ```txt
  GET https://api.ytvidhub.com/prod-api/paypal/check-order-status?orderId={orderId}
  ```
- 成功后重新请求用户信息，更新 localStorage 里的 `loggedInUser.credits`。

### 13.7 支付转化追踪

核心文件：`src/lib/analytics.ts`

它做了几件事：

- `captureUserSource` 保存首次来源：
  - referrer
  - landing_page
  - utm_source
  - utm_medium
  - utm_campaign
  - utm_term
  - utm_content
- `trackConversion` 发普通转化事件。
- `savePendingPurchase` 保存 GA4 purchase pending。
- `trackPurchase` 发 GA4 purchase。
- `trackPurchaseWithRetry` 多次重试，等待 GA4 ready。
- 用 `ga4_purchase_{transactionId}` 做购买事件去重。

这套机制适合直接迁移到当前项目。付费站很容易出现支付成功但 GA 脚本未 ready，导致 purchase 丢失。pending + retry 是比较稳的做法。

## 14. pricing 页面与支付弹窗关系

核心文件：

- `src/app/[locale]/(main)/pricing/page.tsx`
- `src/components/pricing/PaymentChoiceModal.tsx`
- `src/components/pricing/CustomCreditSlider.tsx`

pricing 页负责：

- 展示订阅套餐。
- 展示 Pay As You Go 积分包。
- 用户点击套餐时打开 `PaymentChoiceModal`。
- 用户点击积分包时由 `CustomCreditSlider` 直接创建 Stripe checkout。

注意：`PaymentChoiceModal` 虽然支持 Stripe 和 PayPal 两套逻辑，但 UI 里 PayPal 按钮被注释了，当前主要开放 Stripe。

对 `aiclotheschanger.me` 的 pricing 建议：

- 页面可参考 insMind pricing 做三列或四列套餐。
- 支付交互借鉴 `ytvidhub` 的模式：点击套餐先检查登录，未登录打开登录弹窗，已登录再创建 checkout。
- plan id 不要散落在组件中，建议抽成 `src/config/plans.ts`。

## 15. 当前项目可迁移方案

### 15.1 多语言 SEO 最小迁移

建议文件结构：

```txt
src/i18n/routing.ts
src/i18n/request.ts
src/messages/en.json
src/messages/zh.json
src/lib/url.ts
src/lib/seo.ts
src/middleware.ts
src/app/[locale]/layout.tsx
```

第一阶段只做：

- `en`
- `zh`

不要一开始放 8 种语言，除非每个语言都有真实翻译。

### 15.2 messages namespace 建议

对 `aiclotheschanger.me` 建议这样组织：

```json
{
  "metadata": {
    "title": "AI Clothes Changer - Realistic Virtual Try-On Free | AIClothesChanger",
    "description": "Try realistic AI clothes changing online. Upload a photo, preview outfits, and get free credits before choosing a plan.",
    "keywords": "ai clothes changer, virtual try on, ai outfit changer"
  },
  "schema": {
    "name": "AI Clothes Changer",
    "description": "Realistic AI clothes changer and virtual try-on tool for shopping and styling decisions."
  },
  "navigation": {},
  "pricing": {},
  "about": {}
}
```

### 15.3 页面多语言策略

建议分级：

| 页面 | 初期策略 |
|---|---|
| `/` | 可做完整多语言 |
| `/pricing` | 先英文，后续再多语言 |
| `/about` | 先英文，内容较多，避免机器翻译低质化 |
| `/mens-ai-clothes-changer` | 如果定位 SEO 流量，建议单独英文 SEO 页 |
| `/plus-size-virtual-try-on` | 如果定位 SEO 流量，建议单独英文 SEO 页 |

不要为了 URL 看起来多语言而输出 `/zh/pricing` 但页面还是英文。

### 15.4 canonical/hreflang 策略

直接借鉴 `buildAlternates(locale, pathname, isMultilingual)`：

- 英文页默认：
  - canonical: 英文 URL
  - languages: `en`, `x-default`
- 真正多语言页：
  - languages: `en`, `zh`, `x-default`

这样更稳，不容易被 Google 认为 alternate 配置错误。

### 15.5 登录迁移建议

可以选择两种路线：

路线 A：快速复用类似 `ytvidhub` 的自建 OAuth。

- 优点：和现有后端统一，前端简单。
- 缺点：token 存 localStorage，安全性弱于 httpOnly cookie。

路线 B：使用 NextAuth 或自建 httpOnly cookie。

- 优点：更标准，更安全。
- 缺点：改造更多。

如果当前已有后端登录接口，短期可用路线 A，但建议：

- 不把 Google Client ID 和后端 URL 硬编码在组件里。
- 放入环境变量。
- 登录成功后调用 `/api/sync-user`，不要让页面组件到处直连外部 API。

### 15.6 支付迁移建议

建议保留这个完整流程：

1. 用户点击 plan。
2. 未登录则打开登录弹窗。
3. 已登录则发起 checkout。
4. 前端保存 `purchase_context`。
5. 后端返回 checkout URL。
6. 跳转 Stripe。
7. 回跳 `/stripePayment?session_id=...`。
8. 回跳页轮询后端确认订单。
9. 成功后刷新用户 credits/plan。
10. 补发 GA4 purchase。

对当前 AI Clothes Changer 产品，plan type 可改为：

```ts
free: "aicc_free"
starter: "aicc_starter_monthly"
pro: "aicc_pro_monthly"
studio: "aicc_studio_yearly"
credits: "aicc_credits_custom"
```

### 15.7 积分扣除建议

AI 图片生成类产品必须加防重复扣点：

- 用户快速双击按钮。
- 图片生成请求超时后重试。
- 浏览器刷新后恢复任务。
- 前端同一 action 被多处触发。

可借鉴 `deduct-credits` 的 `recentDeductions`：

```ts
const deductionKey = `${user.email}_${amount}_${reason}`
```

对当前项目建议扩展为：

```ts
const deductionKey = `${user.email}_${generationId}_${amount}_${reason}`
```

这样比只用 amount 和 reason 更安全。

## 16. 需要规避的问题

### 16.1 不要使用 AI 风图标和装饰

`ytvidhub` 中部分页面使用了：

- `Sparkles`
- 强渐变背景
- 彩色装饰块
- 较重阴影
- 大圆角

这些不符合当前项目 AGENTS.md 的约束。当前项目应该保持：

- 克制
- 真实
- 工具型
- 黑白主按钮
- 浅灰边框
- 少量青绿色强调
- 不使用 sparkles、magic、wand、robot、orb、bokeh、强渐变光效

### 16.2 语言名和 emoji 乱码风险

读取 `LanguageSwitcher.tsx` 时，终端显示语言名和旗帜出现乱码。说明源码或终端编码存在不一致风险。

当前项目建议：

- 不使用 emoji 旗帜。
- 语言显示用纯文本：`English`, `Deutsch`, `中文`。
- 或使用短码：`EN`, `DE`, `ZH`。

### 16.3 不要所有页面强行多语言

`ytvidhub` 自己也通过 middleware 避免了这个问题。

当前项目如果要做 SEO，宁可少而真实：

- 页面真的翻译了，再给 hreflang。
- 页面没翻译，就只给英文 canonical。

### 16.4 不要把支付 plan 映射散落多个文件

`ytvidhub` 里 Stripe plan mapping 在多个位置重复出现：

- `PaymentChoiceModal.tsx`
- `useSubtitleDownloader.types.ts`
- `InsufficientCreditsModal` 等

当前项目应抽成统一配置：

```txt
src/config/plans.ts
```

包括：

- plan id
- 后端 type
- Stripe price id
- price
- currency
- credits
- billing mode
- GA4 item name

## 17. 推荐落地顺序

### 阶段一：SEO 与多语言骨架

1. 建立 `routing.ts`。
2. 建立 `request.ts`。
3. 建立 `messages/en.json`。
4. 首页 metadata 从 messages 读取。
5. 增加 `buildCanonicalUrl` 和 `buildAlternates`。
6. sitemap 先区分 English-only 和 multilingual。
7. middleware 保护未完成翻译页面。

### 阶段二：登录

1. 建立 `AuthProvider`。
2. 建立 `GlobalAuthModal`。
3. 登录成功后保存 user 和 token。
4. 增加 `/api/sync-user`。
5. 所有需要登录的动作统一走 `openLoginModal`。

### 阶段三：支付

1. 建立统一 plans 配置。
2. pricing 页点击 plan。
3. 发起 Stripe checkout。
4. 保存 purchase context。
5. 建立 Stripe 回跳页。
6. 轮询订单状态。
7. 刷新 user plan/credits。
8. GA4 purchase pending + retry。

### 阶段四：积分扣除

1. 建立 credit cost 配置。
2. 生成前检查 credits。
3. 服务端扣 credits。
4. 防重复扣除。
5. 生成失败时定义是否退还 credits。

## 18. 关键源码索引

| 主题 | 文件 |
|---|---|
| 多语言路由 | `src/i18n/routing.ts` |
| 服务端消息加载 | `src/i18n/request.ts` |
| 全站 metadata | `src/app/[locale]/layout.tsx` |
| 页面 metadata 示例 | `src/app/[locale]/(main)/pricing/layout.tsx` |
| About metadata 示例 | `src/app/[locale]/(main)/about/layout.tsx` |
| canonical URL | `src/lib/url.ts` |
| alternates | `src/lib/seo.ts` |
| sitemap | `src/app/sitemap.ts` |
| middleware | `src/middleware.ts` |
| 语言切换 | `src/components/ui/LanguageSwitcher.tsx` |
| 语言预加载 | `src/components/LanguagePreloader.tsx` |
| 客户端语言缓存 | `src/lib/globalCacheManager.ts` |
| 登录上下文 | `src/context/AuthContext.tsx` |
| 登录弹窗 | `src/components/LoginModel.tsx` |
| 全局登录弹窗挂载 | `src/components/GlobalAuthModal.tsx` |
| API 封装 | `src/lib/api.ts` |
| 积分成本 | `src/config/credits.ts` |
| 用户同步 | `src/app/api/sync-user/route.ts` |
| 扣积分 | `src/app/api/deduct-credits/route.ts` |
| Stripe checkout hook | `src/hooks/useStripeCheckout.ts` |
| pricing 支付弹窗 | `src/components/pricing/PaymentChoiceModal.tsx` |
| 自定义积分购买 | `src/components/pricing/CustomCreditSlider.tsx` |
| Stripe 购买上下文 | `src/lib/stripePurchaseContext.ts` |
| Stripe 回跳页 | `src/app/[locale]/(main)/stripePayment/page.tsx` |
| PayPal 回跳页 | `src/app/[locale]/(main)/payment/page.tsx` |
| GA4/Clarity/购买追踪 | `src/lib/analytics.ts` |

## 19. 对 aiclotheschanger.me 的最终结论

`ytvidhub` 最值得借鉴的不是视觉，而是工程边界：

- 多语言 SEO 必须以真实翻译完成度为边界。
- canonical 和 hreflang 必须集中生成，不要每个页面手写。
- 首页可以先完整多语言，其它页面可以先 English-only。
- 登录态要全站统一，不要散落在按钮里。
- 支付要由后端生成 checkout URL，前端不要直接处理敏感支付逻辑。
- 支付成功后的 GA4 purchase 需要 pending + retry，避免转化丢失。
- AI 生成类产品必须有服务端扣点和防重复扣点。

当前项目如果继续做海外 SEO，建议先把 `pricing`、`about`、`mens-ai-clothes-changer`、`plus-size-virtual-try-on` 的英文页面质量做好，再逐步开放多语言版本。这样比一次性铺很多语言 URL 更稳，也更符合真实产品信任感。
