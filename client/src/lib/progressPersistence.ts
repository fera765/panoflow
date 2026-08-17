import { getProgressSyncMessage } from "./progressSync";

export async function loadProgressWithStatus<T>(load: () => Promise<T>) {
  try {
    return {
      state: "loaded" as const,
      data: await load(),
      error: null,
    };
  } catch {
    return {
      state: "error" as const,
      data: null,
      error: getProgressSyncMessage("error", true),
    };
  }
}

export async function saveProgressWithStatus(save: (profileJson: string) => Promise<unknown>, profileJson: string) {
  try {
    await save(profileJson);
    return {
      state: "saved" as const,
      error: null,
    };
  } catch {
    return {
      state: "error" as const,
      error: getProgressSyncMessage("error"),
    };
  }
}
