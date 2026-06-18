"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Creator = {
  username: string;
  name: string;
  avatar: string;
  about: string;
};

export default function ExplorePage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/creators").then(async (res) => {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      setCreators(json.creators ?? []);
      setLoading(false);
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-100 px-10 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <img src="/coffee.svg" alt="" className="h-6 w-6" />
          <span>Buy Me Coffee</span>
        </Link>
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Back to dashboard
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-8 py-8">
        <h1 className="mb-1 text-2xl font-bold">Explore creators</h1>
        <p className="mb-6 text-sm text-gray-500">
          Find a creator and support them with a coffee.
        </p>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading…</div>
        ) : creators.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 py-16 text-center text-gray-500">
            No other creators yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {creators.map((c) => (
              <li
                key={c.username}
                className="flex items-center justify-between rounded-2xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      buymeacoffee.com/{c.username}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/donate/${c.username}`}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                >
                  Support
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
