import { describe, expect, it } from "vitest";
import { consumeSiteRedirect, getSiteRedirect, normalizeSiteBase, siteHomePath } from "./siteRouting";

describe("site routing", () => {
  it("normalizes a GitHub Pages base without trailing slash", () => {
    expect(normalizeSiteBase("/panoflow/")).toBe("/panoflow");
    expect(normalizeSiteBase("/")).toBeUndefined();
  });

  it("keeps the static home path inside the published base", () => {
    expect(siteHomePath("/panoflow/")).toBe("/panoflow/");
    expect(siteHomePath("/")).toBe("/");
  });

  it("accepts a same-origin deep link inside the GitHub Pages base", () => {
    expect(getSiteRedirect("/panoflow", "?redirect=%2Fpanoflow%2Fcalendar", "https://fera765.github.io"))
      .toBe("/panoflow/calendar");
  });

  it("rejects external redirects and paths outside the published base", () => {
    expect(getSiteRedirect("/panoflow", "?redirect=https%3A%2F%2Fevil.example%2F", "https://fera765.github.io"))
      .toBeNull();
    expect(getSiteRedirect("/panoflow", "?redirect=%2Fother-site%2F", "https://fera765.github.io"))
      .toBeNull();
  });

  it("integrates fallback redirect consumption with the Home history cleanup", () => {
    const replacedPaths: string[] = [];
    const consumed = consumeSiteRedirect(
      "/panoflow",
      { search: "?redirect=%2Fpanoflow%2Fcalendar", origin: "https://fera765.github.io" },
      (path) => replacedPaths.push(path),
    );

    expect(consumed).toBe("/panoflow/calendar");
    expect(replacedPaths).toEqual(["/panoflow/"]);
  });
});
