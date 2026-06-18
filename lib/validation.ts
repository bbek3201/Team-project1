// Shared client-side validation patterns

// Standard "something@something.tld" email check
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username: 3–20 chars, letters, numbers and underscore only
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidUsername(value: string) {
  return USERNAME_REGEX.test(value.trim());
}
