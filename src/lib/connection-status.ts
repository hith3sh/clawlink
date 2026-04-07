export type ConnectionAuthState = "active" | "needs_reauth";
export type ConnectionStatus = "active" | "expiring" | "expired" | "needs_reauth";

export function getConnectionStatus(
  authState: ConnectionAuthState,
  expiresAt: string | null,
): ConnectionStatus {
  if (authState === "needs_reauth") {
    return "needs_reauth";
  }

  if (!expiresAt) {
    return "active";
  }

  const expiresAtTime = new Date(expiresAt).getTime();

  if (Number.isNaN(expiresAtTime)) {
    return "active";
  }

  if (expiresAtTime <= Date.now()) {
    return "expired";
  }

  const msUntilExpiry = expiresAtTime - Date.now();
  const daysUntilExpiry = msUntilExpiry / (1000 * 60 * 60 * 24);

  return daysUntilExpiry <= 7 ? "expiring" : "active";
}
