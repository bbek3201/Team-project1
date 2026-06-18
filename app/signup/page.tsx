"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../providers/user-provider";
import { isValidEmail, isValidUsername } from "@/lib/validation";
import { FieldMessage } from "../components/field-message";
import { Spinner } from "../components/spinner";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

export default function SignUpPage() {
  const router = useRouter();
  const { refresh } = useUser();
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setCheckResult({ name: username, status: res.ok ? "available" : "taken" });
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
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      await refresh();
      if (data.hasProfile) {
        router.push("/");
      } else {
        router.push("/complete-profile");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <img
            src="coffee.svg
"
            alt=""
          />
          <span>Buy Me Coffee</span>
        </div>
        <Link
          href="/login"
          className="rounded-md bg-white px-5 py-2 font-medium text-gray-800 shadow-sm"
        >
          Log in
        </Link>
      </header>

      <div className="flex min-h-screen">
        <div className="flex w-1/2 flex-col items-center justify-center bg-amber-400 px-12 text-center">
          <div className="mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-amber-500">
            <img src="illustration.svg" alt="" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Fund your creative work</h1>
          <p className="max-w-md text-lg">
            Accept support. Start a membership. Setup a shop. It&apos;s easier
            than you think.
          </p>
        </div>

        <div className="flex w-1/2 items-center justify-center px-12">
          <div className="w-full max-w-sm">
            {step === 1 ? (
              <>
                <h2 className="mb-2 text-3xl font-bold">Create Your Account</h2>
                <p className="mb-6 text-gray-500">
                  Choose a username for your page
                </p>

                <form onSubmit={handleUsernameContinue}>
                  <label className="mb-1 block font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => setUsernameTouched(true)}
                    placeholder="Enter username here"
                    className={`w-full rounded-md border px-4 py-3 outline-none ${
                      (usernameTouched && usernameFormatError) ||
                      usernameStatus === "taken"
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  <div className="mb-4 mt-1.5 min-h-[16px]">
                    {usernameTouched && usernameFormatError ? (
                      <FieldMessage message={usernameFormatError} />
                    ) : usernameStatus === "taken" ? (
                      <FieldMessage message="This username is already taken" />
                    ) : usernameStatus === "available" ? (
                      <FieldMessage
                        type="success"
                        message="Username available"
                      />
                    ) : usernameStatus === "checking" ? (
                      <p className="text-xs text-gray-400">Checking…</p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={usernameStatus !== "available" || loading}
                    className="w-full rounded-md bg-gray-300 py-3 font-medium text-gray-700 disabled:opacity-60 enabled:bg-black enabled:text-white"
                  >
                    Continue
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-3xl font-bold">Welcome, {username}</h2>
                <p className="mb-6 text-gray-500">
                  Connect email and set a password
                </p>

                <form onSubmit={handleSignupContinue}>
                  <div className="mb-4">
                    <label className="mb-1 block font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="Enter email here"
                      className={`w-full rounded-md border px-4 py-3 outline-none ${
                        emailTouched && emailError
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    <FieldMessage
                      message={emailTouched ? emailError : ""}
                      className="mt-1.5"
                    />
                  </div>

                  <label className="mb-1 block font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password here"
                    className="mb-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
                  />
                  {error && (
                    <p className="mb-4 text-sm text-red-500">⊗ {error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!email || !password || loading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-300 py-3 font-medium text-gray-700 disabled:opacity-60 enabled:bg-black enabled:text-white"
                  >
                    {loading && <Spinner />}
                    {loading ? "Creating..." : "Continue"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
