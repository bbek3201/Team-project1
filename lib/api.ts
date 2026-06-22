import { clearTokens, storeTokens } from "@/lib/auth-client";

/**
 * fetch wrapper for authenticated requests. If the request returns 401 (access
 * token expired), it tries to mint a new access token via the refresh token
 * cookie once, then replays the original request.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let res = await fetch(input, init);

  if (res.status !== 401 || input === "/api/auth/refresh") {
    return res;
  }

  const refreshed = await fetch("/api/auth/refresh", { method: "POST" });
  if (!refreshed.ok) {
    clearTokens();
    return res;
  }

  const data = await refreshed.json().catch(() => null);
  if (data) storeTokens(data);

  res = await fetch(input, init);
  return res;
}
