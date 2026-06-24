"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../providers/UserProvider";
import { initials } from "@/lib/format";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-center border-b border-gray-100 bg-white px-4 py-2">
      <div className="flex w-full max-w-[1280px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-base font-bold">
          <img src="/coffee.svg" alt="" className="h-6 w-6" />
          <span>Buy Me Coffee</span>
        </Link>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md px-4 py-2"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                {initials(user?.name ?? "")}
              </div>
            )}
            <span className="max-w-[160px] truncate text-sm font-medium">
              {user?.name}
            </span>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
