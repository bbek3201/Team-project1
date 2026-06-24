// Name: letters, numbers, spaces and a few common punctuation marks, 2–50 chars
export const NAME_REGEX = /^[\p{L}\p{N} .,'-]{2,50}$/u;
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
