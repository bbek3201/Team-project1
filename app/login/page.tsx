"use client";

import { useState } from "react";
import { isValidEmail, isValidUsername } from "@/lib/validation";
import { FieldMessage } from "../components/FieldMessage";
import { Spinner } from "../components/Spinner";
import { AuthLayout } from "../components/AuthLayout";
import { useAuthFlow } from "../components/useAuthFlow";

export default function LoginPage() {
  const { loading, error, submit } = useAuthFlow("/api/auth/login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierTouched, setIdentifierTouched] = useState(false);

  const isValidIdentifier =
    isValidEmail(identifier) || isValidUsername(identifier);
  const identifierError =
    identifier && !isValidIdentifier
      ? "Please enter a valid email or username"
      : "";

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setIdentifierTouched(true);
    if (!isValidIdentifier || !password) return;
    await submit({ identifier, password });
  }

  return (
    <AuthLayout linkHref="/signup" linkLabel="Sign up">
      <h2 className="mb-6 text-3xl font-bold">Welcome back</h2>

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="mb-1 block font-medium">Email or username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onBlur={() => setIdentifierTouched(true)}
            placeholder="Enter email or username here"
            className={`w-full rounded-md border px-4 py-3 outline-none ${
              identifierTouched && identifierError
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
          <FieldMessage
            message={identifierTouched ? identifierError : ""}
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
        {error && <p className="mb-4 text-sm text-red-500">⊗ {error}</p>}

        <button
          type="submit"
          disabled={!identifier || !password || loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>
    </AuthLayout>
  );
}
