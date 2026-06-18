"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../providers/user-provider";

export default function SignUpPage() {
  const router = useRouter();
  const { refresh } = useUser();
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUsernameContinue(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupContinue(e?: React.FormEvent) {
    e?.preventDefault();
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
                    placeholder="Enter username here"
                    className={`mb-2 w-full rounded-md border px-4 py-3 outline-none ${
                      error ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {error && (
                    <p className="mb-4 text-sm text-red-500">⊗ {error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!username || loading}
                    className="w-full rounded-md bg-gray-300 py-3 font-medium text-gray-700 disabled:opacity-60 enabled:bg-black enabled:text-white"
                  >
                    {loading ? "Checking..." : "Continue"}
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
                  <label className="mb-1 block font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email here"
                    className={`mb-2 w-full rounded-md border px-4 py-3 outline-none ${
                      error ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {error && (
                    <p className="mb-4 text-sm text-red-500">⊗ {error}</p>
                  )}

                  <label className="mb-1 block font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password here"
                    className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!email || !password || loading}
                    className="w-full rounded-md bg-gray-300 py-3 font-medium text-gray-700 disabled:opacity-60 enabled:bg-black enabled:text-white"
                  >
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
