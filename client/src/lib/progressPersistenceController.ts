import { loadProgressWithStatus, saveProgressWithStatus } from "./progressPersistence";

export type ProgressControllerStatus = "idle" | "loading" | "saving" | "saved" | "error";
export type ProgressControllerState = {
  status: ProgressControllerStatus;
  error: string | null;
};

type ControllerOptions<T> = {
  load: () => Promise<T | null>;
  save: (profileJson: string) => Promise<unknown>;
  onStateChange?: (state: ProgressControllerState) => void;
};

export function createProgressPersistenceController<T>({ load, save, onStateChange }: ControllerOptions<T>) {
  let state: ProgressControllerState = { status: "idle", error: null };
  let lastPayload: string | null = null;

  const update = (next: ProgressControllerState) => {
    state = next;
    onStateChange?.(state);
  };

  const loadCurrent = async () => {
    update({ status: "loading", error: null });
    const result = await loadProgressWithStatus(load);
    if (result.state === "error") update({ status: "error", error: result.error });
    else update({ status: "idle", error: null });
    return result;
  };

  const saveCurrent = async (profileJson: string) => {
    lastPayload = profileJson;
    update({ status: "saving", error: null });
    const result = await saveProgressWithStatus(save, profileJson);
    update({ status: result.state, error: result.error });
    return result;
  };

  const retry = async () => {
    if (lastPayload === null) return loadCurrent();
    return saveCurrent(lastPayload);
  };

  return {
    getState: () => state,
    load: loadCurrent,
    save: saveCurrent,
    retry,
  };
}
