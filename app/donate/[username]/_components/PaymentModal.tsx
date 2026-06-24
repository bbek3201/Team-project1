"use client";

import { useState } from "react";
import { CardTab } from "./CardTab";
import { QpayTab } from "./QpayTab";

export function PaymentModal({
  recipientUsername,
  amount,
  social,
  message,
  onClose,
  onCompleted,
}: {
  recipientUsername: string;
  amount: number;
  social: string;
  message: string;
  onClose: () => void;
  onCompleted: () => void;
}) {
  const [tab, setTab] = useState<"card" | "qpay">("card");

  const tabClass = (active: boolean) =>
    `rounded-md px-10 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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

        <div className="mx-auto flex w-fit gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setTab("card")}
            className={tabClass(tab === "card")}
          >
            Card
          </button>
          <button
            onClick={() => setTab("qpay")}
            className={tabClass(tab === "qpay")}
          >
            Q Pay
          </button>
        </div>

        <div className="mt-6">
          {tab === "card" ? (
            <CardTab
              recipientUsername={recipientUsername}
              amount={amount}
              social={social}
              message={message}
              onCompleted={onCompleted}
            />
          ) : (
            <QpayTab
              recipientUsername={recipientUsername}
              amount={amount}
              social={social}
              message={message}
              onCompleted={onCompleted}
            />
          )}
        </div>
      </div>
    </div>
  );
}
