import { prisma } from "@/lib/prisma";
import { EMAIL_REGEX } from "@/lib/validation";
import {
  MAX_RESENDS,
  cooldownExpiry,
  generateOtp,
  hashOtp,
  minutesLeft,
  otpExpiry,
} from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, resend } = await req.json();

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email" },
      { status: 400 },
    );
  }

  const normalizedEmail = String(email).trim();
  const existing = await prisma.passwordResetOtp.findUnique({
    where: { email: normalizedEmail },
  });

  // A cooldown blocks any new code (initial or resend) until it expires.
  if (existing?.cooldownUntil && existing.cooldownUntil > new Date()) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${minutesLeft(
          existing.cooldownUntil,
        )} minutes.`,
      },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Only send a code when the account exists, but always respond the same way
  // so we don't leak which emails are registered.
  if (user) {
    // Resends accumulate; a fresh "Continue" (resend falsy) starts over.
    const resendCount = resend && existing ? existing.resendCount + 1 : 0;
    const cooldownUntil =
      resendCount >= MAX_RESENDS ? cooldownExpiry() : null;

    const code = generateOtp();
    const codeHash = await hashOtp(code);

    await prisma.passwordResetOtp.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        codeHash,
        expiresAt: otpExpiry(),
        attempts: 0,
        resendCount,
        cooldownUntil,
      },
      update: {
        codeHash,
        expiresAt: otpExpiry(),
        attempts: 0,
        resendCount,
        cooldownUntil,
      },
    });

    try {
      await sendOtpEmail(normalizedEmail, code);
    } catch (e) {
      console.error("Failed to send OTP email", e);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
