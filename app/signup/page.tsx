"use client";

import { useEffect, useState } from "react";
import { isValidEmail, isValidUsername } from "@/lib/validation";
import { AuthLayout } from "../components/AuthLayout";
import { useAuthFlow } from "../components/useAuthFlow";
import { UsernameStep, type UsernameStatus } from "./_components/UsernameStep";
import { AccountStep } from "./_components/AccountStep";

export default function SignUpPage() {
  const { loading, error, setError, submit } = useAuthFlow("/api/auth/signup");
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    name: string;
    status: "available" | "taken";
  } | null>(null);

  const usernameFormatError =
    username && !isValidUsername(username)
      ? "Username must be 3–20 characters (letters, numbers, _)"
      : "";
  const emailError =
    email && !isValidEmail(email) ? "Please enter a valid email" : "";

  // Live username availability check (debounced) — mirrors the Figma states
  useEffect(() => {
    if (!isValidUsername(username)) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        setCheckResult({
          name: username,
          status: res.ok ? "available" : "taken",
        });
      } catch {
        setCheckResult(null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [username]);

  // Derive status from input + last resolved check (avoids setState in effect)
  const usernameStatus: UsernameStatus = !isValidUsername(username)
    ? "idle"
    : checkResult?.name === username
      ? checkResult.status
      : "checking";

  function handleUsernameContinue(e?: React.FormEvent) {
    e?.preventDefault();
    setUsernameTouched(true);
    if (!isValidUsername(username) || usernameStatus !== "available") return;
    setError("");
    setStep(2);
  }

  async function handleSignupContinue(e?: React.FormEvent) {
    e?.preventDefault();
    setEmailTouched(true);
    if (!isValidEmail(email) || !password) return;
    await submit({ username, email, password });
  }

  return (
    <AuthLayout linkHref="/login" linkLabel="Log in">
      {step === 1 ? (
        <UsernameStep
          username={username}
          setUsername={setUsername}
          usernameTouched={usernameTouched}
          setUsernameTouched={setUsernameTouched}
          usernameFormatError={usernameFormatError}
          usernameStatus={usernameStatus}
          loading={loading}
          onSubmit={handleUsernameContinue}
        />
      ) : (
        <AccountStep
          username={username}
          email={email}
          setEmail={setEmail}
          emailTouched={emailTouched}
          setEmailTouched={setEmailTouched}
          emailError={emailError}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={handleSignupContinue}
        />
      )}
    </AuthLayout>
  );
}
