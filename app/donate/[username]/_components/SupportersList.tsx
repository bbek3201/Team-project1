"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import type { Supporter } from "./types";

export function SupportersList({
  supporters,
  creatorName,
}: {
  supporters: Supporter[];
  creatorName: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? supporters : supporters.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold">Recent Supporters</h2>
      {supporters.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 py-12">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-gray-900"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <p className="font-medium">
            Be the first one to support {creatorName}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {visible.map((s) => (
            <div key={s.id} className="flex gap-3">
              <Avatar
                src={s.avatar}
                name={s.name}
                size="h-8 w-8"
                textSize="text-xs"
              />
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{s.name}</span> bought $
                  {s.amount} coffee
                </p>
                {s.message && (
                  <p className="mt-1 text-sm text-gray-600">{s.message}</p>
                )}
              </div>
            </div>
          ))}
          {supporters.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="flex items-center justify-center gap-1 rounded-md border border-gray-200 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              {showAll ? "Show less" : "See more"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                className={showAll ? "rotate-180" : ""}
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
