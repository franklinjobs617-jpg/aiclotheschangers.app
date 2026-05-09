import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "zh")) {
    locale = routing.defaultLocale;
  }

  const baseMessages = (await import(`../messages/${routing.defaultLocale}.json`)).default;
  if (locale === routing.defaultLocale) {
    return {
      locale,
      messages: baseMessages
    };
  }

  const targetMessages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: deepMerge(baseMessages, targetMessages)
  };
});

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  }

  return output;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
