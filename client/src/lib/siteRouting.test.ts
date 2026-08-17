import { describe, expect, it } from "vitest";
import { normalizeSiteBase, siteHomePath } from "./siteRouting";

describe("site routing", () => {
  it("normalizes a GitHub Pages base without trailing slash", () => {
    expect(normalizeSiteBase("/panoflow/")).toBe("/panoflow");
    expect(normalizeSiteBase("/")).toBeUndefined();
  });

  it("keeps the static home path inside the published base", () => {
    expect(siteHomePath("/panoflow/")).toBe("/panoflow/");
    expect(siteHomePath("/")).toBe("/");
  });
});
