"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

type Creator = {
  username: string;
  name: string;
  avatar: string;
  about: string;
};

const AMOUNTS = [1, 2, 5, 10];

export default function DonatePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();

  const [creator, setCreator] = useState<Creator | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [amount, setAmount] = useState(1);
  const [social, setSocial] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/creators/${username}`).then(async (res) => {
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      setCreator(await res.json());
    });
  }, [username]);

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
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Creator not found.
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>
          <h1 className="text-xl font-bold">
            Thank you for supporting {creator?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your ${amount} donation was sent.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-gray-900">
      <div className="mx-auto max-w-xl">
        {/* Creator header */}
        <div className="mb-6 flex items-center gap-3">
          {creator?.avatar ? (
            <img
              src={creator.avatar}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
              {(creator?.name ?? username).slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold">{creator?.name ?? username}</p>
            <p className="text-sm text-gray-500">
              buymeacoffee.com/{username}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-bold">Buy {creator?.name ?? username} a coffee</h2>

          {/* Amount */}
          <label className="mb-2 block text-sm font-medium">Select amount</label>
          <div className="mb-5 flex gap-2">
            {AMOUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setAmount(n)}
                className={`flex-1 rounded-lg border py-2.5 font-medium ${
                  amount === n
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                }`}
              >
                ${n}
              </button>
            ))}
          </div>

          {/* Social URL */}
          <label className="mb-1 block text-sm font-medium">
            Your social media URL
          </label>
          <input
            value={social}
            onChange={(e) => setSocial(e.target.value)}
            placeholder="instagram.com/yourname"
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
          />

          {/* Message */}
          <label className="mb-1 block text-sm font-medium">
            Special message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something nice…"
            rows={3}
            className="mb-4 w-full resize-none rounded-md border border-gray-300 px-4 py-3 outline-none"
          />

          {error && <p className="mb-3 text-sm text-red-500">⊗ {error}</p>}

          <button
            onClick={handleSend}
            disabled={!social || loading}
            className="w-full rounded-lg bg-black py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : `Support $${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
}
