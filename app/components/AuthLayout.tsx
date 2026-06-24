import Link from "next/link";
import { AuthHero } from "./AuthHero";
import { BrandLogo } from "./BrandLogo";

export function AuthLayout({
  linkHref,
  linkLabel,
  children,
}: {
  linkHref: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-12 py-6">
        <BrandLogo />
        <Link
          href={linkHref}
          className="rounded-md bg-white px-5 py-2 font-medium text-gray-800 shadow-sm"
        >
          {linkLabel}
        </Link>
      </header>

      <div className="flex min-h-screen">
        <AuthHero />

        <div className="flex w-1/2 items-center justify-center px-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
