"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onboardingPath } from "@/lib/onboarding";
import { useUser } from "../providers/UserProvider";
import { OnboardingHeader } from "../components/OnboardingHeader";
import { PaymentForm } from "./_components/PaymentForm";

export default function PaymentDetailsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  // Send users to the right step: those who haven't completed their profile
  // go back, and those who already added a card skip ahead.
  useEffect(() => {
    if (!userLoading && user && (!user.hasProfile || user.hasBankCard)) {
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
  if (userLoading || !user || !user.hasProfile || user.hasBankCard) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <OnboardingHeader />

      <div className="mx-auto max-w-2xl px-12 py-10">
        <h1 className="mb-2 text-3xl font-bold">
          How would you like to be paid?
        </h1>
        <p className="mb-8 text-gray-500">Enter location and payment details</p>

        <PaymentForm />
      </div>
    </div>
  );
}
