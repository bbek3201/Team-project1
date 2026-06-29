import bcrypt from "bcrypt";

// How long a generated OTP stays valid.
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Returns a zero-padded 6-digit code, e.g. "042913".
export function generateOtp(): string {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
}

export function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export function verifyOtp(code: string, codeHash: string): Promise<boolean> {
  return bcrypt.compare(code, codeHash);
}

export function otpExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MS);
}
