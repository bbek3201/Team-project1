import { BrandLogo } from "./BrandLogo";

export function OnboardingHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between px-12 py-6">
      <BrandLogo />
      {action}
    </header>
  );
}
