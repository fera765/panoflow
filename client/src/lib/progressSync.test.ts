import { describe, expect, it } from "vitest";
import {
  canRetryProgressSync,
  getProgressSyncLabel,
  getProgressSyncMessage,
} from "./progressSync";

describe("progress sync UI states", () => {
  it("exposes clear labels for idle, saving, saved, and error", () => {
    expect(getProgressSyncLabel("idle")).toBe("Sincronização");
    expect(getProgressSyncLabel("saving")).toBe("Salvando...");
    expect(getProgressSyncLabel("saved")).toBe("Salvo");
    expect(getProgressSyncLabel("error")).toBe("Local");
  });

  it("shows distinct messages for read and write failures", () => {
    expect(getProgressSyncMessage("idle")).toBeNull();
    expect(getProgressSyncMessage("error", true)).toContain("modo local");
    expect(getProgressSyncMessage("error")).toContain("sincronizar");
  });

  it("enables retry only after an error", () => {
    expect(canRetryProgressSync("saving")).toBe(false);
    expect(canRetryProgressSync("saved")).toBe(false);
    expect(canRetryProgressSync("error")).toBe(true);
  });
});
