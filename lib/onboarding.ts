// Decides where a user should land based on how far they got through the
// onboarding steps: complete-profile -> payment-details -> success-message -> home.
export function onboardingPath(
  hasProfile: boolean,
  hasBankCard: boolean,
  hasSuccessMessage: boolean,
): string {
  if (!hasProfile) return "/complete-profile";
  if (!hasBankCard) return "/payment-details";
  if (!hasSuccessMessage) return "/success-message";
  return "/";
}
