// Client-side token helpers. These never run on the server and only deal with
// presence/storage of tokens so the UI can decide instantly whether to show a
// protected screen or redirect to /login (avoids the "homescreen flash").

export const ACCESS_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY ?? "accessToken";
export const REFRESH_TOKEN_KEY =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? "refreshToken";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Reads a token from localStorage, then sessionStorage, then cookies. */
export function getStoredToken(key: string = ACCESS_TOKEN_KEY): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(key) ||
    window.sessionStorage.getItem(key) ||
    readCookie(key)
  );
}

/** True if any auth token is present in any client storage. */
export function hasStoredToken(): boolean {
  return Boolean(getStoredToken(ACCESS_TOKEN_KEY) || getStoredToken(REFRESH_TOKEN_KEY));
}

export function storeTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
}) {
  if (typeof window === "undefined") return;
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
