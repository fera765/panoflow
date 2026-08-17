import { describe, expect, it, vi } from "vitest";
import { loadProgressWithStatus, saveProgressWithStatus } from "./progressPersistence";

describe("progress persistence flow", () => {
  it("loads a remote profile successfully", async () => {
    const load = vi.fn().mockResolvedValue({ xp: 160 });
    await expect(loadProgressWithStatus(load)).resolves.toEqual({
      state: "loaded",
      data: { xp: 160 },
      error: null,
    });
    expect(load).toHaveBeenCalledOnce();
  });

  it("keeps a local fallback when remote loading fails", async () => {
    const load = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(loadProgressWithStatus(load)).resolves.toMatchObject({
      state: "error",
      data: null,
    });
  });

  it("reports saved after a successful write and error after a failed write", async () => {
    const save = vi.fn().mockResolvedValue({ success: true });
    await expect(saveProgressWithStatus(save, "{\"xp\":160}")).resolves.toEqual({ state: "saved", error: null });
    expect(save).toHaveBeenCalledWith("{\"xp\":160}");

    const failingSave = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(saveProgressWithStatus(failingSave, "{\"xp\":160}")).resolves.toMatchObject({ state: "error" });
  });
});
