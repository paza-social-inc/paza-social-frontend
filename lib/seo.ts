/**
 * Default SEO config. Override with env:
 * - NEXT_PUBLIC_APP_URL (e.g. https://pazasocial.com)
 */

const defaultBaseUrl =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_APP_URL ?? "https://pazasocial.com" : "";

export const siteConfig = {
  name: "Paza",
  description:
    "Where brands and creators build partnerships and run campaigns. Connect, collaborate, and grow on one platform.",
  url: defaultBaseUrl,
  ogImagePath: "/og.png", // add a static og.png in /public when ready
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
