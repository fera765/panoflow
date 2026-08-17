import { describe, expect, it, vi } from "vitest";
import { createProgressPersistenceController } from "./progressPersistenceController";

describe("progress persistence controller", () => {
  it("retries a failed read and returns the remote profile", async () => {
    const load = vi.fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ xp: 320 });
    const states: string[] = [];
    const controller = createProgressPersistenceController({
      load,
      save: vi.fn(),
      onStateChange: (state) => states.push(state.status),
    });

    await expect(controller.load()).resolves.toMatchObject({ state: "error", data: null });
    await expect(controller.retry()).resolves.toMatchObject({ state: "loaded", data: { xp: 320 } });
    expect(states).toEqual(["loading", "error", "loading", "idle"]);
  });

  it("retries the last failed write and reaches saved", async () => {
    const save = vi.fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ success: true });
    const states: string[] = [];
    const controller = createProgressPersistenceController({
      load: vi.fn(),
      save,
      onStateChange: (state) => states.push(state.status),
    });

    await expect(controller.save("{\"xp\":320}")).resolves.toMatchObject({ state: "error" });
    await expect(controller.retry()).resolves.toMatchObject({ state: "saved" });
    expect(save).toHaveBeenNthCalledWith(2, "{\"xp\":320}");
    expect(states).toEqual(["saving", "error", "saving", "saved"]);
  });
});
