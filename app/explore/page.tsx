"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../components/AppShell";
import { CreatorCard, type Creator } from "./_components/CreatorCard";
import { CreatorCardSkeleton } from "./_components/CreatorCardSkeleton";
import { SearchIcon } from "./_components/SearchIcon";

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
    <AppShell mainClassName="flex flex-1 flex-col gap-6 mb-10">
      <h1 className="text-xl font-semibold tracking-tight">Explore creators</h1>

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
        <div className="flex flex-col gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CreatorCardSkeleton key={i} />
          ))}
        </div>
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
    </AppShell>
  );
}
