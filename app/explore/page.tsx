"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

type Creator = {
  username: string;
  name: string;
  avatar: string;
  about: string;
  socialMediaURL: string;
};

export default function ExplorePage() {
  const router = useRouter();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return creators;
    return creators.filter((c) => c.name.toLowerCase().includes(q));
  }, [creators, query]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="mx-auto flex max-w-6xl gap-10 px-8 py-8">
        <Sidebar />

        <main className="flex flex-1 flex-col gap-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Explore creators
          </h1>

          <div className="flex h-9 w-60 items-center gap-2 rounded-lg border border-gray-200 px-3">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name"
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-gray-200 py-16 text-center text-gray-500">
              {creators.length === 0
                ? "No other creators yet."
                : "No creators match your search."}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filtered.map((c) => (
                <CreatorCard key={c.username} creator={c} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {creator.avatar ? (
            <img
              src={creator.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
              {creator.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <p className="text-xl font-semibold tracking-tight">{creator.name}</p>
        </div>
        <Link
          href={`/donate/${creator.username}`}
          className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-gray-200"
        >
          View profile <ExternalIcon />
        </Link>
      </div>

      <div className="flex items-start gap-5">
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-base font-semibold">About {creator.name}</p>
          <p className="line-clamp-4 text-sm text-zinc-700">{creator.about}</p>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-base font-semibold">Social media URL</p>
          <p className="break-all text-sm text-zinc-700">
            {creator.socialMediaURL}
          </p>
        </div>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-gray-400"
    >
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14 14l3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-3M12 4h4v4M16 4l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
