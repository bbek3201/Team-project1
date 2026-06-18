"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
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
          href="/signup"
          className="rounded-md bg-white px-5 py-2 font-medium text-gray-800 shadow-sm"
        >
          Sign up
        </Link>
      </header>

      <div className="flex min-h-screen">
        <div className="flex w-1/2 flex-col items-center justify-center bg-amber-400 px-12 text-center">
          <div className="mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-amber-500">
            <img
              src="illustration.svg
      "
              alt=""
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Fund your creative work</h1>
          <p className="max-w-md text-lg">
            Accept support. Start a membership. Setup a shop. It&apos;s easier
            than you think.
          </p>
        </div>

        <div className="flex w-1/2 items-center justify-center px-12">
          <div className="w-full max-w-sm">
            <h2 className="mb-6 text-3xl font-bold">Welcome back</h2>

            <label className="mb-1 block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email here"
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
            />

            <label className="mb-1 block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password here"
              className="mb-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
            />
            {error && <p className="mb-4 text-sm text-red-500">⊗ {error}</p>}

            <button
              onClick={handleLogin}
              disabled={!email || !password || loading}
              className="w-full rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
