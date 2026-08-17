export function normalizeSiteBase(baseUrl: string): string | undefined {
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized || undefined;
}

export function siteHomePath(baseUrl: string): string {
  if (!baseUrl || baseUrl === "/") return "/";
  return `${baseUrl.replace(/\/+$/, "")}/`;
}
