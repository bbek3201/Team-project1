import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? process.env.JWT_SECRET!;

// Key names are shared with the client, so they live under NEXT_PUBLIC_*.
export const ACCESS_TOKEN_KEY =
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY ?? "accessToken";
export const REFRESH_TOKEN_KEY =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? "refreshToken";

// Access token is short-lived; refresh token keeps the session alive.
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type TokenPayload = { userId: number; username: string };

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_KEY)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function signTokens(payload: TokenPayload) {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

/**
 * Sets the access + refresh tokens as httpOnly cookies on the response.
 * The same tokens are usually also returned in the JSON body so the client can
 * store them (localStorage/sessionStorage) for fast presence checks.
 */
export function setAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  res.cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
    ...cookieBase,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
    ...cookieBase,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_TOKEN_KEY, "", { path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_TOKEN_KEY, "", { path: "/", maxAge: 0 });
}
