import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const record = await prisma.passwordResetOtp.findFirst({
    where: { email: String(email).trim(), expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record || !(await verifyOtp(String(code), record.codeHash))) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
