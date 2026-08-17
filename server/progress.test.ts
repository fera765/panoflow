import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  getTrainingProgress: vi.fn(),
  upsertTrainingProgress: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

function createContext(user: TrpcContext["user"] = {
  id: 7,
  openId: "progress-user",
  email: "progress@example.com",
  name: "Progress User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
}): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("progress router", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when the authenticated user has no saved profile", async () => {
    dbMocks.getTrainingProgress.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createContext());
    await expect(caller.progress.get()).resolves.toBeNull();
  });

  it("returns null instead of throwing when stored JSON is invalid", async () => {
    dbMocks.getTrainingProgress.mockResolvedValue({ profileJson: "not-json" });
    const caller = appRouter.createCaller(createContext());
    await expect(caller.progress.get()).resolves.toBeNull();
  });

  it("parses a saved profile and persists a validated JSON payload", async () => {
    dbMocks.getTrainingProgress.mockResolvedValue({ profileJson: JSON.stringify({ xp: 160, streak: 1 }) });
    dbMocks.upsertTrainingProgress.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createContext());

    await expect(caller.progress.get()).resolves.toEqual({ xp: 160, streak: 1 });
    await expect(caller.progress.save({ profileJson: JSON.stringify({ xp: 160 }) })).resolves.toEqual({ success: true });
    expect(dbMocks.upsertTrainingProgress).toHaveBeenCalledWith(7, JSON.stringify({ xp: 160 }));
  });

  it("requires authentication for progress procedures", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.progress.get()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
