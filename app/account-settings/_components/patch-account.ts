import { apiFetch } from "@/lib/api";

export async function patchAccount(body: Record<string, unknown>) {
  const res = await apiFetch("/api/account", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Request failed");
  }
}
