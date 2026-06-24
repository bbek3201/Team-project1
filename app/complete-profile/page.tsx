"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onboardingPath } from "@/lib/onboarding";
import { useUser } from "../providers/UserProvider";
import { OnboardingHeader } from "../components/OnboardingHeader";
import { ProfileForm } from "./_components/ProfileForm";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  // Users who already completed their profile should skip ahead to the next
  // onboarding step (payment details) or home.
  useEffect(() => {
    if (!userLoading && user?.hasProfile) {
      router.replace(onboardingPath(user.hasProfile, user.hasBankCard));
    }
  }, [userLoading, user, router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  // Avoid flashing the form while we resolve the user or redirect away
  if (userLoading || user?.hasProfile) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <OnboardingHeader
        action={
          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-5 py-2 font-medium text-gray-800"
          >
            Log out
          </button>
        }
      />

      <div className="mx-auto max-w-2xl px-12 py-10">
        <h1 className="mb-8 text-3xl font-bold">Complete your profile page</h1>
        <ProfileForm />
      </div>
    </div>
  );
}
