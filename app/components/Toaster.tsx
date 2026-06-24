"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-zinc-950 shadow-lg",
          title: "text-sm font-medium text-zinc-950",
          description: "text-xs text-gray-500",
          icon: "shrink-0",
          success: "[&_[data-icon]]:text-green-600",
          error: "[&_[data-icon]]:text-red-500",
          actionButton:
            "rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white",
          cancelButton:
            "rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-zinc-950",
        },
      }}
    />
  );
}
