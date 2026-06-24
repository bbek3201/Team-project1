// Decides where a user should land based on how far they got through the
// onboarding steps: complete-profile -> payment-details -> home.
export function onboardingPath(
  hasProfile: boolean,
  hasBankCard: boolean,
): string {
  if (!hasProfile) return "/complete-profile";
  if (!hasBankCard) return "/payment-details";
  return "/";
}
