// Validation patterns (mirrors the complete-profile onboarding flow)
// Name: letters, numbers, spaces and a few common punctuation marks, 2–50 chars
export const NAME_REGEX = /^[\p{L}\p{N} .,'-]{2,50}$/u;
// Success confirmation message: at least 10 trimmed characters
export const ABOUT_MIN = 10;
// Password: at least 8 chars, containing a letter and a number
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
// Card number: exactly 16 digits
export const CARD_REGEX = /^\d{16}$/;
// CVC: exactly 3 digits
export const CVC_REGEX = /^\d{3}$/;

export const onlyDigits = (value: string, max: number) =>
  value.replace(/\D/g, "").slice(0, max);

export const COUNTRIES = [
  "Mongolia",
  "United States",
  "United Kingdom",
  "Germany",
  "Japan",
  "South Korea",
  "China",
  "Singapore",
];

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: 15 }, (_, i) => currentYear + i);
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400";
export const labelClass = "mb-2 block text-sm font-medium text-zinc-950";

export const fieldClass = (invalid?: string) =>
  `w-full rounded-md border px-3 py-2 text-sm outline-none ${
    invalid ? "border-red-400" : "border-gray-200 focus:border-gray-400"
  }`;
