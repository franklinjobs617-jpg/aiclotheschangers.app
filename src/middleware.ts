import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
  alternateLinks: false,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 30 * 24 * 60 * 60,
    sameSite: true,
    path: "/"
  }
});

export default function middleware(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const canonicalHost = "aiclotheschanger.me";

  if (host === `www.${canonicalHost}` || (proto === "http" && (host === canonicalHost || host === `www.${canonicalHost}`))) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = canonicalHost;
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;
  const localePrefixMatch = pathname.match(/^\/(en|zh)(\/.*)?$/);
  if (localePrefixMatch) {
    const locale = localePrefixMatch[1];
    const restPath = localePrefixMatch[2] ?? "";

    if (locale === routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = restPath || "/";
      return NextResponse.redirect(url, 301);
    }

    if (locale !== routing.defaultLocale && restPath && restPath !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = restPath;
      return NextResponse.redirect(url, 307);
    }
  }

  if (/\/{2,}/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/{2,}/g, "/");
    return NextResponse.redirect(url, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)", "/"]
};
