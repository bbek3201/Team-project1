import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (String(newPassword).length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  const normalizedEmail = String(email).trim();

  const record = await prisma.passwordResetOtp.findFirst({
    where: { email: normalizedEmail, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record || !(await verifyOtp(String(code), record.codeHash))) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(String(newPassword), 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  // Code is single-use — clear all codes for this email once consumed.
  await prisma.passwordResetOtp.deleteMany({
    where: { email: normalizedEmail },
  });

  return NextResponse.json({ ok: true });
}
