"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onboardingPath } from "@/lib/onboarding";
import { useUser } from "../providers/UserProvider";
import { OnboardingHeader } from "../components/OnboardingHeader";
import { SuccessMessageForm } from "./_components/SuccessMessageForm";

export default function SuccessMessagePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  // Keep users on the correct onboarding step: send them back if earlier
  // steps are missing, or forward home once this step is done.
  useEffect(() => {
    if (
      !userLoading &&
      user &&
      (!user.hasProfile || !user.hasBankCard || user.hasSuccessMessage)
    ) {
      router.replace(
        onboardingPath(
          user.hasProfile,
          user.hasBankCard,
          user.hasSuccessMessage,
        ),
      );
    }
  }, [userLoading, user, router]);

  // Avoid flashing the form while we resolve the user or redirect away
  if (
    userLoading ||
    !user ||
    !user.hasProfile ||
    !user.hasBankCard ||
    user.hasSuccessMessage
  ) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <OnboardingHeader />

      <div className="mx-auto max-w-2xl px-12 py-10">
        <h1 className="mb-2 text-3xl font-bold">Set your success page</h1>
        <p className="mb-8 text-gray-500">
          Write the message supporters will see after a successful donation.
        </p>

        <SuccessMessageForm />
      </div>
    </div>
  );
}
