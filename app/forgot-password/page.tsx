"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/lib/validation";
import { AuthLayout } from "../components/AuthLayout";
import { EmailStep } from "./_components/EmailStep";
import { OtpStep } from "./_components/OtpStep";
import { NewPasswordStep } from "./_components/NewPasswordStep";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [code, setCode] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailError =
    email && !isValidEmail(email) ? "Please enter a valid email" : "";

  const passwordError = !password
    ? "Please enter a password"
    : password.length < 6
      ? "Password must be at least 6 characters"
      : "";
  const confirmError = !confirm
    ? "Please confirm your password"
    : confirm !== password
      ? "Passwords do not match"
      : "";

  async function handleEmailSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setEmailTouched(true);
    if (!isValidEmail(email)) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resend: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setCode("");
      setNotice("");
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    setResending(true);
    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resend: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setCode("");
      setNotice("A new code has been sent to your email.");
    } finally {
      setResending(false);
    }
  }

  async function handleOtpSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (code.length !== 6) return;
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid or expired code");
        return;
      }
      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setPasswordTouched(true);
    if (passwordError || confirmError) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout linkHref="/login" linkLabel="Log in">
      {step === 1 && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          emailTouched={emailTouched}
          setEmailTouched={setEmailTouched}
          emailError={emailError}
          error={error}
          loading={loading}
          onSubmit={handleEmailSubmit}
        />
      )}

      {step === 2 && (
        <OtpStep
          email={email}
          code={code}
          setCode={setCode}
          error={error}
          notice={notice}
          loading={loading}
          resending={resending}
          onSubmit={handleOtpSubmit}
          onResend={handleResend}
        />
      )}

      {step === 3 && (
        <NewPasswordStep
          password={password}
          setPassword={setPassword}
          confirm={confirm}
          setConfirm={setConfirm}
          touched={passwordTouched}
          setTouched={setPasswordTouched}
          passwordError={passwordError}
          confirmError={confirmError}
          error={error}
          loading={loading}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </AuthLayout>
  );
}
