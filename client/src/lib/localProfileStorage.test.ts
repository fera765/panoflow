import { describe, expect, it } from "vitest";
import { defaultProfile, type TrainingLevel } from "@shared/trainingData";
import {
  ACTIVE_DAY_KEY,
  ACTIVE_LEVEL_KEY,
  PROFILE_KEY,
  chooseMostProgressedProfile,
  loadStoredDay,
  loadStoredLevel,
  loadStoredProfile,
  resetStoredProgress,
  saveStoredDay,
  saveStoredLevel,
  saveStoredProfile,
  type StorageLike,
} from "./localProfileStorage";

function createStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    clear: () => { values.clear(); },
  };
}

describe("localProfileStorage", () => {
  it("persists and restores profile, active day and level", () => {
    const storage = createStorage();
    const profile = { ...defaultProfile, xp: 840, streak: 4, completedBeginnerDays: [1, 2] };

    expect(saveStoredProfile(profile, storage)).toBe(true);
    expect(saveStoredDay(7, storage)).toBe(true);
    expect(saveStoredLevel("advanced", storage)).toBe(true);

    expect(loadStoredProfile(storage)).toMatchObject({ xp: 840, streak: 4, completedBeginnerDays: [1, 2] });
    expect(loadStoredDay(storage)).toBe(7);
    expect(loadStoredLevel("beginner", storage)).toBe("advanced");
    expect(storage.getItem(PROFILE_KEY)).toContain("840");
    expect(storage.getItem(ACTIVE_DAY_KEY)).toBe("7");
    expect(storage.getItem(ACTIVE_LEVEL_KEY)).toBe("advanced");
  });

  it("normalizes invalid profile data and day values without crashing", () => {
    const storage = createStorage();
    storage.setItem(PROFILE_KEY, "{not-json");
    storage.setItem(ACTIVE_DAY_KEY, "999");
    storage.setItem(ACTIVE_LEVEL_KEY, "invalid");

    expect(loadStoredProfile(storage)).toMatchObject(defaultProfile);
    expect(loadStoredDay(storage)).toBe(1);
    expect(loadStoredLevel("beginner", storage)).toBe("beginner");
  });

  it("keeps the more progressed profile when remote data is empty or behind", () => {
    const local = { ...defaultProfile, xp: 1200, completedBeginnerDays: [1, 2, 3], history: [{ level: "beginner" as TrainingLevel, day: 3, completedAt: 100, xp: 400 }] };
    const remote = { ...defaultProfile, xp: 0 };
    const selected = chooseMostProgressedProfile(local, remote);

    expect(selected.xp).toBe(1200);
    expect(selected.completedBeginnerDays).toEqual([1, 2, 3]);
  });

  it("clears all local progress keys on reset", () => {
    const storage = createStorage();
    saveStoredProfile({ ...defaultProfile, xp: 100 }, storage);
    saveStoredDay(5, storage);
    saveStoredLevel("advanced", storage);

    expect(resetStoredProgress(storage)).toBe(true);
    expect(storage.getItem(PROFILE_KEY)).toBeNull();
    expect(storage.getItem(ACTIVE_DAY_KEY)).toBeNull();
    expect(storage.getItem(ACTIVE_LEVEL_KEY)).toBeNull();
    expect(loadStoredProfile(storage).xp).toBe(defaultProfile.xp);
  });
});
