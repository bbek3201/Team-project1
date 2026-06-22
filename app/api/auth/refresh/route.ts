import {
  REFRESH_TOKEN_KEY,
  setAuthCookies,
  signTokens,
  verifyRefreshToken,
} from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_TOKEN_KEY)?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tokens = signTokens({
    userId: payload.userId,
    username: payload.username,
  });

  const res = NextResponse.json({ ok: true, ...tokens });
  setAuthCookies(res, tokens);
  return res;
}
