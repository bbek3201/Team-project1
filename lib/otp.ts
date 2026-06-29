import bcrypt from "bcrypt";

// How long a generated OTP stays valid.
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Spam protection limits.
export const MAX_VERIFY_ATTEMPTS = 5; // wrong-code tries before a code is locked
export const MAX_RESENDS = 3; // resend presses before a cooldown kicks in
export const RESEND_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

export function cooldownExpiry(): Date {
  return new Date(Date.now() + RESEND_COOLDOWN_MS);
}

// Minutes (rounded up) remaining until the given cooldown timestamp.
export function minutesLeft(until: Date): number {
  return Math.max(1, Math.ceil((until.getTime() - Date.now()) / 60_000));
}

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
