export function normalizeSiteBase(baseUrl: string): string | undefined {
  const normalized = baseUrl.replace(/\/+$/, "");
  return normalized || undefined;
}

export function siteHomePath(baseUrl: string | undefined): string {
  if (!baseUrl || baseUrl === "/") return "/";
  return `${baseUrl.replace(/\/+$/, "")}/`;
}

export function getSiteRedirect(
  baseUrl: string | undefined,
  search: string,
  origin: string,
): string | null {
  const redirect = new URLSearchParams(search).get("redirect");
  if (!redirect) return null;

  try {
    const parsed = new URL(redirect, origin);
    const normalizedBase = normalizeSiteBase(baseUrl ?? "/");
    const isInsideSite = normalizedBase
      ? parsed.pathname === normalizedBase || parsed.pathname.startsWith(`${normalizedBase}/`)
      : parsed.pathname.startsWith("/");

    if (parsed.origin !== origin || !isInsideSite) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function consumeSiteRedirect(
  baseUrl: string | undefined,
  location: Pick<Location, "search" | "origin">,
  replacePath: (path: string) => void,
): string | null {
  const redirect = getSiteRedirect(baseUrl, location.search, location.origin);
  if (!redirect) return null;
  replacePath(siteHomePath(baseUrl));
  return redirect;
}
