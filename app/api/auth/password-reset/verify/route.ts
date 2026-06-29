import { prisma } from "@/lib/prisma";
import { MAX_VERIFY_ATTEMPTS, minutesLeft, verifyOtp } from "@/lib/otp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const record = await prisma.passwordResetOtp.findUnique({
    where: { email: String(email).trim() },
  });

  if (!record || record.expiresAt <= new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 },
    );
  }

  // Respect an active cooldown from too many resends.
  if (record.cooldownUntil && record.cooldownUntil > new Date()) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${minutesLeft(
          record.cooldownUntil,
        )} minutes.`,
      },
      { status: 429 },
    );
  }

  // Code is locked once the attempt limit is hit — user must resend.
  if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Please resend a new code." },
      { status: 429 },
    );
  }

  const isMatch = await verifyOtp(String(code), record.codeHash);

  if (!isMatch) {
    const attempts = record.attempts + 1;
    await prisma.passwordResetOtp.update({
      where: { email: record.email },
      data: { attempts },
    });
    const left = MAX_VERIFY_ATTEMPTS - attempts;
    return NextResponse.json(
      {
        error:
          left > 0
            ? `Invalid code. ${left} attempt${left === 1 ? "" : "s"} left.`
            : "Too many attempts. Please resend a new code.",
      },
      { status: 400 },
    );
  }

  // Success — clear spam counters but keep the code valid for the confirm step.
  await prisma.passwordResetOtp.update({
    where: { email: record.email },
    data: { attempts: 0, resendCount: 0, cooldownUntil: null },
  });

  return NextResponse.json({ ok: true });
}
