"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { Chevron, CheckIcon, CopyIcon } from "./Icons";
import { useOutsideClose } from "./use-outside-close";
import { RANGE_LABELS, type DashboardData } from "./types";

export function EarningsCard({
  data,
  range,
  setRange,
  pageUrlDisplay,
  onCopy,
  copied,
}: {
  data: DashboardData;
  range: string;
  setRange: (v: string) => void;
  pageUrlDisplay: string;
  onCopy: () => void;
  copied: boolean;
}) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useOutsideClose(() => setRangeOpen(false));

  return (
    <section className="rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={data.user.avatar} name={data.user.name ?? ""} size={48} />
          <div className="min-w-0">
            <p className="truncate font-bold">{data.user.name}</p>
            <p className="truncate text-sm text-gray-500">{pageUrlDisplay}</p>
          </div>
        </div>
        <button
          onClick={onCopy}
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
        ${data.earnings ?? 0}
      </p>
    </section>
  );
}
