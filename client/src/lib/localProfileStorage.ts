import { defaultProfile, type TrainingLevel, type TrainingProfile } from "@shared/trainingData";

export const PROFILE_KEY = "panoflow-profile-v1";
export const ACTIVE_DAY_KEY = "panoflow-active-day-v1";
export const ACTIVE_LEVEL_KEY = "panoflow-active-level-v1";

export type StoredProfile = TrainingProfile & { lastCompletedAt?: number };

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  clear(): void;
}

function storageOrNull(storage?: StorageLike | null) {
  if (storage !== undefined) return storage;
  return typeof window === "undefined" ? null : window.localStorage;
}

export function normalizeStoredProfile(value: unknown): StoredProfile {
  const candidate = value && typeof value === "object" ? value as Partial<StoredProfile> : {};
  const completedExercises = candidate.completedExercises && typeof candidate.completedExercises === "object"
    ? candidate.completedExercises
    : {};

  return {
    ...defaultProfile,
    ...candidate,
    completedExercises: { ...defaultProfile.completedExercises, ...completedExercises },
    completedBeginnerDays: Array.isArray(candidate.completedBeginnerDays) ? candidate.completedBeginnerDays : [],
    completedAdvancedDays: Array.isArray(candidate.completedAdvancedDays) ? candidate.completedAdvancedDays : [],
    history: Array.isArray(candidate.history) ? candidate.history : [],
  };
}

export function loadStoredProfile(storage?: StorageLike | null): StoredProfile {
  const target = storageOrNull(storage);
  if (!target) return normalizeStoredProfile(null);
  try {
    const raw = target.getItem(PROFILE_KEY);
    return raw ? normalizeStoredProfile(JSON.parse(raw)) : normalizeStoredProfile(null);
  } catch {
    return normalizeStoredProfile(null);
  }
}

export function saveStoredProfile(profile: StoredProfile, storage?: StorageLike | null) {
  const target = storageOrNull(storage);
  if (!target) return false;
  try {
    target.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

export function loadStoredDay(storage?: StorageLike | null) {
  const target = storageOrNull(storage);
  if (!target) return 1;
  try {
    const value = Number(target.getItem(ACTIVE_DAY_KEY));
    return Number.isInteger(value) && value >= 1 && value <= 30 ? value : 1;
  } catch {
    return 1;
  }
}

export function saveStoredDay(day: number, storage?: StorageLike | null) {
  const target = storageOrNull(storage);
  if (!target) return false;
  try {
    target.setItem(ACTIVE_DAY_KEY, String(day));
    return true;
  } catch {
    return false;
  }
}

export function loadStoredLevel(fallback: TrainingLevel, storage?: StorageLike | null): TrainingLevel {
  const target = storageOrNull(storage);
  if (!target) return fallback;
  try {
    const value = target.getItem(ACTIVE_LEVEL_KEY);
    return value === "advanced" || value === "beginner" ? value : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredLevel(level: TrainingLevel, storage?: StorageLike | null) {
  const target = storageOrNull(storage);
  if (!target) return false;
  try {
    target.setItem(ACTIVE_LEVEL_KEY, level);
    return true;
  } catch {
    return false;
  }
}

export function resetStoredProgress(storage?: StorageLike | null) {
  const target = storageOrNull(storage);
  if (!target) return false;
  try {
    target.clear();
    return true;
  } catch {
    return false;
  }
}

export function profileProgressScore(profile: TrainingProfile) {
  const completedDays = profile.completedBeginnerDays.length + profile.completedAdvancedDays.length;
  return profile.xp + completedDays * 1000 + profile.history.length * 250;
}

export function chooseMostProgressedProfile(local: StoredProfile, remote: StoredProfile) {
  return profileProgressScore(remote) >= profileProgressScore(local) ? remote : local;
}
