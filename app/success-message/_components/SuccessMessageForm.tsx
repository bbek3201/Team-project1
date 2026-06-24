"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../providers/UserProvider";
import { FieldMessage } from "../../components/FieldMessage";
import { Spinner } from "../../components/Spinner";

const MIN_LENGTH = 10;

export function SuccessMessageForm() {
  const router = useRouter();
  const { refresh } = useUser();
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fieldError = !message.trim()
    ? "Please enter a confirmation message"
    : message.trim().length < MIN_LENGTH
      ? `Please write at least ${MIN_LENGTH} characters`
      : undefined;

  async function handleContinue() {
    setTouched(true);
    if (fieldError) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "success",
          successMessage: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      // Onboarding finished — refresh so the header and explore reflect the
      // now fully set-up account before we land on the home page.
      await refresh();
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <label className="mb-1 block font-medium">Confirmation message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onBlur={() => setTouched(true)}
        rows={5}
        placeholder="The message your supporters will see after they donate"
        className={`w-full resize-none rounded-md border px-4 py-3 outline-none ${
          touched && fieldError
            ? "border-red-400"
            : "border-gray-300 focus:border-gray-400"
        }`}
      />
      <FieldMessage
        message={touched ? fieldError : undefined}
        className="mt-2"
      />

      {error && <p className="mb-4 mt-2 text-sm text-red-500">⊗ {error}</p>}

      <button
        onClick={handleContinue}
        disabled={!!fieldError || loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "Saving..." : "Continue"}
      </button>
    </>
  );
}
