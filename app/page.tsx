"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import { Skeleton } from "./components/skeleton";

type Transaction = {
  id: number;
  name: string;
  avatar: string;
  socialURL: string;
  amount: number;
  message: string;
  createdAt: string;
};

type DashboardData = {
  user: { name: string; avatar: string; username: string };
  earnings: number;
  transactions: Transaction[];
};

const RANGE_LABELS: Record<string, string> = {
  "30": "Last 30 days",
  "90": "Last 90 days",
  all: "All time",
};

const AMOUNT_OPTIONS = [1, 2, 5, 10];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 2) || "?").toUpperCase();
}

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("30");
  const [amounts, setAmounts] = useState<number[]>([]);

  const [rangeOpen, setRangeOpen] = useState(false);
  const [amountOpen, setAmountOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const rangeRef = useOutsideClose(() => setRangeOpen(false));
  const amountRef = useOutsideClose(() => setAmountOpen(false));

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({ range });
      if (amounts.length) params.set("amounts", amounts.join(","));
      const res = await fetch(`/api/dashboard?${params.toString()}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, [range, amounts, router]);

  function toggleAmount(n: number) {
    setAmounts((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  }

  function toggleExpanded(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const pageUrl = data ? `buymeacoffee.com/${data.user.username}` : "";

  async function copyPageLink() {
    await navigator.clipboard.writeText(`https://${pageUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="mx-auto flex max-w-6xl gap-10 px-8 py-8">
        <Sidebar />

        {/* Main */}
        <main className="flex-1">
          {/* Profile + earnings card */}
          {!data ? (
            <ProfileEarningsSkeleton />
          ) : (
          <section className="rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  src={data?.user.avatar}
                  name={data?.user.name ?? ""}
                  size={48}
                />
                <div className="min-w-0">
                  <p className="truncate font-bold">{data?.user.name}</p>
                  <p className="truncate text-sm text-gray-500">{pageUrl}</p>
                </div>
              </div>
              <button
                onClick={copyPageLink}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white"
              >
                <CopyIcon />
                {copied ? "Copied!" : "Share page link"}
              </button>
            </div>

            <hr className="my-5 border-gray-100" />

            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold tracking-tight">Earnings</h2>
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setRangeOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                >
                  {RANGE_LABELS[range]}
                  <Chevron />
                </button>
                {rangeOpen && (
                  <div className="absolute z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {Object.entries(RANGE_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setRange(key);
                          setRangeOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {label}
                        {range === key && <CheckIcon />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-4xl font-extrabold tracking-tight">
              ${data?.earnings ?? 0}
            </p>
          </section>
          )}

          {/* Recent transactions */}
          <div className="mt-8 flex items-center justify-between">
            <h3 className="font-semibold">Recent transactions</h3>
            <div className="relative" ref={amountRef}>
              <button
                onClick={() => setAmountOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm"
              >
                <Chevron />
                Amount
                {amounts.length > 0 && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                    {amounts.map((a) => `$${a}`).join(", ")}
                  </span>
                )}
              </button>
              {amountOpen && (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                  {AMOUNT_OPTIONS.map((n) => (
                    <label
                      key={n}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={amounts.includes(n)}
                        onChange={() => toggleAmount(n)}
                        className="h-4 w-4 accent-black"
                      />
                      ${n}
                    </label>
                  ))}
                </div>
              )}
            </div>
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
                  <li key={t.id} className="rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar src={t.avatar} name={t.name} />
                        <div>
                          <p className="font-bold">{t.name}</p>
                          <p className="text-sm text-gray-500">{t.socialURL}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">+ ${t.amount}</p>
                        <p className="text-sm text-gray-400">
                          {timeAgo(t.createdAt)}
                        </p>
                      </div>
                    </div>
                    {t.message && (
                      <Message
                        text={t.message}
                        expanded={expanded.has(t.id)}
                        onToggle={() => toggleExpanded(t.id)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function ProfileEarningsSkeleton() {
  return (
    <section className="rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <hr className="my-5 border-gray-100" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-10 w-40" />
    </section>
  );
}

function TransactionSkeleton() {
  return (
    <li className="rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </li>
  );
}

function Message({
  text,
  expanded,
  onToggle,
}: {
  text: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isLong = text.length > 120;
  const shown = expanded || !isLong ? text : text.slice(0, 120) + "…";
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-gray-800">
      {shown}{" "}
      {isLong && (
        <button
          onClick={onToggle}
          className="font-medium text-gray-900 underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </p>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <HeartIcon />
      </div>
      <p className="font-bold">You don&apos;t have any supporters yet</p>
      <p className="mt-1 text-sm text-gray-500">
        Share your page with your audience to get started.
      </p>
    </div>
  );
}

function Avatar({
  src,
  name,
  size = 40,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500"
    >
      {initials(name)}
    </div>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 10l3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect
        x="7"
        y="7"
        width="9"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M13 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2h2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 10c0 5.65-7 10-7 10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
