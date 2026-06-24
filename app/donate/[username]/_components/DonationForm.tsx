"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoffeeIcon } from "./Icons";
import { AMOUNTS } from "./types";
import { PaymentModal } from "./PaymentModal";

export function DonationForm({
  username,
  creatorName,
  isOwner,
  isLoggedIn,
  onDone,
}: {
  username: string;
  creatorName: string;
  isOwner: boolean;
  isLoggedIn: boolean;
  onDone: () => void;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(5);
  const [social, setSocial] = useState("");
  const [message, setMessage] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">Buy {creatorName} a Coffee</h2>

      <label className="mb-2 block text-sm font-medium">Select amount:</label>
      <div className="mb-5 flex gap-3">
        {AMOUNTS.map((n) => (
          <button
            key={n}
            onClick={() => setAmount(n)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium ${
              amount === n
                ? "border-[#18181b] ring-1 ring-[#18181b]"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <CoffeeIcon className="text-gray-700" />${n}
          </button>
        ))}
      </div>

      <label className="mb-1 block text-sm font-medium">
        Enter BuyMeCoffee or social acount URL:
      </label>
      <input
        value={social}
        onChange={(e) => setSocial(e.target.value)}
        placeholder="buymeacoffee.com/"
        disabled={isOwner}
        className="mb-4 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 disabled:bg-gray-50"
      />

      <label className="mb-1 block text-sm font-medium">Special message:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Please write your message here"
        rows={4}
        disabled={isOwner}
        className="mb-4 w-full resize-none rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 disabled:bg-gray-50"
      />

      <button
        onClick={() => (isLoggedIn ? setShowPay(true) : setShowAuth(true))}
        disabled={isOwner || (isLoggedIn && !social)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181b] py-3 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        Support
      </button>

      {showAuth && !isLoggedIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuth(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h3 className="text-lg font-bold">Log in to support {creatorName}</h3>
            <p className="mt-1 text-sm text-gray-500">
              You need an account to send a donation.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push("/login")}
                className="rounded-lg bg-[#18181b] py-3 text-sm font-medium text-white hover:bg-black"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {showPay && (
        <PaymentModal
          recipientUsername={username}
          amount={amount}
          social={social}
          message={message}
          onClose={() => setShowPay(false)}
          onCompleted={() => {
            setShowPay(false);
            onDone();
          }}
        />
      )}
    </div>
  );
}
