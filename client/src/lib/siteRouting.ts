export function normalizeSiteBase(baseUrl: string): string | undefined {
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized || undefined;
}

export function siteHomePath(baseUrl: string): string {
  return baseUrl || "/";
}
