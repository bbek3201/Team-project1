"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../providers/user-provider";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const linkClass = (active: boolean) =>
    active
      ? "rounded-md bg-gray-100 px-4 py-2 font-medium"
      : "rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50";

  return (
    <aside className="w-56 shrink-0">
      <nav className="flex flex-col gap-1 text-[15px]">
        <Link href="/" className={linkClass(pathname === "/")}>
          Home
        </Link>
        <Link href="/explore" className={linkClass(pathname === "/explore")}>
          Explore
        </Link>
        <a
          href={user ? `/donate/${user.username}` : "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          View page <ExternalIcon />
        </a>
        <Link
          href="/account-settings"
          className={linkClass(pathname === "/account-settings")}
        >
          Account settings
        </Link>
      </nav>
    </aside>
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
