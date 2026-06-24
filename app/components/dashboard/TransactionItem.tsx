"use client";

import { useState } from "react";
import { timeAgo } from "@/lib/format";
import { Avatar } from "./Avatar";
import type { Transaction } from "./types";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar src={transaction.avatar} name={transaction.name} />
          <div>
            <p className="font-bold">{transaction.name}</p>
            <p className="text-sm text-gray-500">{transaction.socialURL}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">+ ${transaction.amount}</p>
          <p className="text-sm text-gray-400">
            {timeAgo(transaction.createdAt)}
          </p>
        </div>
      </div>
      {transaction.message && (
        <Message
          text={transaction.message}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
        />
      )}
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
