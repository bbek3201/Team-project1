import { BrandLogo } from "./BrandLogo";

export function OnboardingHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-[1280px] items-center justify-between">
        <BrandLogo />
        {action}
      </div>
    </header>
  );
}
