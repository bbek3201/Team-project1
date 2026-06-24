"use client";

import { use, useEffect, useState } from "react";

export default function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  // Opening this page (e.g. by scanning the QR) completes the QPay payment.
  useEffect(() => {
    fetch(`/api/transactions/${id}/pay`, { method: "POST" })
      .then((res) => setStatus(res.ok ? "done" : "error"))
      .catch(() => setStatus("error"));
  }, [id]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
        {status === "loading" && (
          <p className="text-gray-600">Processing your payment…</p>
        )}
        {status === "done" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5l4 4 10-10"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold">Payment successful</h1>
            <p className="mt-2 text-sm text-gray-500">
              You can return to the page you were donating from.
            </p>
          </>
        )}
        {status === "error" && (
          <p className="text-red-500">⊗ This payment link is invalid.</p>
        )}
      </div>
    </div>
  );
}
