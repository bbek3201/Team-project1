"use client";

import { useState } from "react";
import { Chevron } from "./Icons";
import { useOutsideClose } from "./use-outside-close";
import { AMOUNT_OPTIONS } from "./types";

export function AmountFilter({
  amounts,
  toggleAmount,
}: {
  amounts: number[];
  toggleAmount: (n: number) => void;
}) {
  const [amountOpen, setAmountOpen] = useState(false);
  const amountRef = useOutsideClose(() => setAmountOpen(false));

  return (
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
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg mb-10">
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
  );
}
