"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch } from "../../lib/api";
import { clearTokens, hasStoredToken } from "@/lib/auth-client";

export type CurrentUser = {
  id: number;
  name: string;
  avatar: string;
  username: string;
  email: string;
  hasProfile: boolean;
};

type UserContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  hasToken: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(() =>
    typeof window !== "undefined" ? hasStoredToken() : false,
  );

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) {
        clearTokens();
        setUser(null);
        setHasToken(false);
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setHasToken(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearTokens();
    setUser(null);
    setHasToken(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, loading, hasToken, refresh, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
