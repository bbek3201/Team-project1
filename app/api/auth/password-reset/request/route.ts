import { prisma } from "@/lib/prisma";
import { EMAIL_REGEX } from "@/lib/validation";
import { generateOtp, hashOtp, otpExpiry } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email" },
      { status: 400 },
    );
  }

  const normalizedEmail = String(email).trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Only send a code when the account actually exists, but always respond the
  // same way so we don't leak which emails are registered.
  if (user) {
    const code = generateOtp();
    const codeHash = await hashOtp(code);

    await prisma.passwordResetOtp.deleteMany({
      where: { email: normalizedEmail },
    });
    await prisma.passwordResetOtp.create({
      data: { email: normalizedEmail, codeHash, expiresAt: otpExpiry() },
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
