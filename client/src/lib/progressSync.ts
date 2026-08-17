export type ProgressSyncState = "idle" | "saving" | "saved" | "error";

export function getProgressSyncLabel(state: ProgressSyncState) {
  if (state === "saving") return "Salvando...";
  if (state === "saved") return "Salvo";
  if (state === "error") return "Local";
  return "Sincronização";
}

export function getProgressSyncMessage(state: ProgressSyncState, isReadError = false) {
  if (state === "error" && isReadError) return "A conta não respondeu. O modo local continua ativo.";
  if (state === "error") return "Não foi possível sincronizar agora. O progresso continua salvo neste dispositivo.";
  return null;
}

export function canRetryProgressSync(state: ProgressSyncState) {
  return state === "error";
}
