"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "./components/AppShell";
import { apiFetch } from "@/lib/api";
import { hasStoredToken } from "@/lib/auth-client";
import { useUser } from "./providers/UserProvider";
import { AmountFilter } from "./components/dashboard/AmountFilter";
import { EarningsCard } from "./components/dashboard/EarningsCard";
import { EmptyState } from "./components/dashboard/EmptyState";
import {
  ProfileEarningsSkeleton,
  TransactionSkeleton,
} from "./components/dashboard/Skeletons";
import { TransactionItem } from "./components/dashboard/TransactionItem";
import type { DashboardData } from "./components/dashboard/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("30");
  const [amounts, setAmounts] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const [origin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "",
  );

  // Redirect logged-out visitors before any dashboard content renders:
  // first by the synchronous token presence check, then by the verified
  // session from the provider (covers expired/invalid tokens).
  useEffect(() => {
    if (!hasStoredToken() || (!authLoading && !authUser)) {
      router.replace("/login");
    }
  }, [authLoading, authUser, router]);

  useEffect(() => {
    if (!authUser) return;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({ range });
      if (amounts.length) params.set("amounts", amounts.join(","));
      const res = await apiFetch(`/api/dashboard?${params.toString()}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, [authUser, range, amounts, router]);

  function toggleAmount(n: number) {
    setAmounts((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  }

  const pageUrl = data ? `${origin}/donate/${data.user.username}` : "";
  const pageUrlDisplay = pageUrl.replace(/^https?:\/\//, "");

  async function copyPageLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // While the session is being verified (or for logged-out users mid-redirect)
  // render a blank screen so the dashboard never flashes.
  if (!authUser) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <AppShell mainClassName="flex-1">
      {!data ? (
        <ProfileEarningsSkeleton />
      ) : (
        <EarningsCard
          data={data}
          range={range}
          setRange={setRange}
          pageUrlDisplay={pageUrlDisplay}
          onCopy={copyPageLink}
          copied={copied}
        />
      )}

      <div className="mt-8 flex items-center justify-between">
        <h3 className="font-semibold">Recent transactions</h3>
        <AmountFilter amounts={amounts} toggleAmount={toggleAmount} />
      </div>

      <section className="mt-4 rounded-lg border border-gray-200">
        {loading ? (
          <ul className="flex flex-col gap-4 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <TransactionSkeleton key={i} />
            ))}
          </ul>
        ) : !data || data.transactions.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-4 p-6">
            {data.transactions.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
