import { describe, expect, it } from "vitest";
import {
  completeTrainingDay,
  defaultProfile,
  estimateDayXp,
  getDay,
  getStreakAfterCompletion,
  getCalendarDayState,
  getLevelProgress,
  getNextDay,
  getPlanDays,
  isAdvancedUnlocked,
} from "../shared/trainingData";

describe("PanoFlow training data", () => {
  it("provides 30 days for each level", () => {
    expect(getPlanDays("beginner")).toHaveLength(30);
    expect(getPlanDays("advanced")).toHaveLength(30);
    expect(getDay("beginner", 1).exercises.length).toBeGreaterThan(0);
  });

  it("unlocks advanced only after all beginner days", () => {
    expect(isAdvancedUnlocked(defaultProfile)).toBe(false);
    expect(isAdvancedUnlocked({ ...defaultProfile, completedBeginnerDays: Array.from({ length: 29 }, (_, i) => i + 1) })).toBe(false);
    expect(isAdvancedUnlocked({ ...defaultProfile, completedBeginnerDays: Array.from({ length: 30 }, (_, i) => i + 1) })).toBe(true);
  });

  it("calculates level progress and a positive daily XP reward", () => {
    const profile = { ...defaultProfile, completedBeginnerDays: [1, 2, 3] };
    expect(getLevelProgress(profile)).toEqual({ beginner: 10, advanced: 0 });
    expect(estimateDayXp(getDay("beginner", 1))).toBeGreaterThan(0);
  });

  it("keeps, increments, and resets streak by UTC calendar day", () => {
    const day = 86_400_000;
    const profile = { ...defaultProfile, streak: 3, lastCompletedAt: 10 * day + 3_000 };
    expect(getStreakAfterCompletion(profile, 10 * day + 50_000)).toBe(3);
    expect(getStreakAfterCompletion(profile, 11 * day + 50_000)).toBe(4);
    expect(getStreakAfterCompletion(profile, 13 * day + 50_000)).toBe(1);
  });

  it("requires the full checklist, awards XP, and records the next unlocked day", () => {
    const day = getDay("beginner", 1);
    const ids = day.exercises.map((exercise) => exercise.id);
    const incomplete = completeTrainingDay(defaultProfile, "beginner", 1, ids.slice(0, -1), 1_000);
    expect(incomplete.completed).toBe(false);
    expect(incomplete.profile).toEqual(defaultProfile);

    const completed = completeTrainingDay(defaultProfile, "beginner", 1, ids, 1_000);
    expect(completed.completed).toBe(true);
    expect(completed.profile.completedBeginnerDays).toEqual([1]);
    expect(completed.profile.xp).toBe(estimateDayXp(day));
    expect(completed.profile.history).toHaveLength(1);
  });

  it("moves the profile to advanced after completing beginner day 30", () => {
    const profile = { ...defaultProfile, completedBeginnerDays: Array.from({ length: 29 }, (_, index) => index + 1) };
    const day = getDay("beginner", 30);
    const result = completeTrainingDay(profile, "beginner", 30, day.exercises.map((exercise) => exercise.id), 2_000);
    expect(result.completed).toBe(true);
    expect(result.profile.level).toBe("advanced");
    expect(result.profile.completedBeginnerDays).toHaveLength(30);
  });

  it("unlocks the next calendar day after the current day is completed", () => {
    const day = getDay("beginner", 1);
    const result = completeTrainingDay(defaultProfile, "beginner", 1, day.exercises.map((exercise) => exercise.id), 1_000);
    expect(result.completed).toBe(true);
    expect(getNextDay(result.profile, "beginner")).toBe(2);
    expect(getCalendarDayState(result.profile, "beginner", 1)).toEqual({ unlocked: true, completed: true });
    expect(getCalendarDayState(result.profile, "beginner", 2)).toEqual({ unlocked: true, completed: false });
    expect(getCalendarDayState(result.profile, "beginner", 3)).toEqual({ unlocked: false, completed: false });
    expect(getNextDay({ ...result.profile, completedBeginnerDays: [1, 2, 3] }, "beginner")).toBe(4);
  });
});
