"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../../../components/Spinner";
import { CoffeeIcon } from "./Icons";
import { AMOUNTS } from "./types";

export function DonationForm({
  username,
  creatorName,
  isOwner,
  onDone,
}: {
  username: string;
  creatorName: string;
  isOwner: boolean;
  onDone: () => void;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(5);
  const [social, setSocial] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUsername: username,
          amount,
          specialMessage: message,
          socialURLOrBuyMeACoffee: social,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      onDone();
    } finally {
      setLoading(false);
    }
  }

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

      {error && <p className="mb-3 text-sm text-red-500">⊗ {error}</p>}

      <button
        onClick={handleSend}
        disabled={isOwner || !social || loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181b] py-3 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        {loading && <Spinner />}
        {loading ? "Sending…" : "Support"}
      </button>
    </div>
  );
}
