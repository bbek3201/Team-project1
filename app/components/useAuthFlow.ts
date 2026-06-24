"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../providers/UserProvider";
import { storeTokens } from "@/lib/auth-client";
import { onboardingPath } from "@/lib/onboarding";

// Shared login/signup submit flow: posts credentials, persists tokens,
// refreshes the session, then routes by onboarding state.
export function useAuthFlow(endpoint: string) {
  const router = useRouter();
  const { refresh } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(body: Record<string, unknown>) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      storeTokens(data);
      await refresh();
      router.push(
        onboardingPath(
          data.hasProfile,
          data.hasBankCard,
          data.hasSuccessMessage,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, setError, submit };
}
