import { prisma } from "@/lib/prisma";
import { signTokens, setAuthCookies } from "@/lib/auth";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const identifier: string | undefined = (
    body.identifier ??
    body.email ??
    ""
  ).trim();
  const password: string | undefined = body.password;

  if (!identifier || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
    include: { profile: true },
  });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email/username or password" },
      { status: 401 },
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return NextResponse.json(
      { error: "Invalid email/username or password" },
      { status: 401 },
    );
  }

  const tokens = signTokens({ userId: user.id, username: user.username });

  const res = NextResponse.json({
    user: { id: user.id, username: user.username, email: user.email },
    hasProfile: !!user.profileId,
    hasBankCard: !!user.bankCardId,
    hasSuccessMessage: !!user.profile?.successMessage,
    ...tokens,
  });

  setAuthCookies(res, tokens);

  return res;
}
