"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../../components/Spinner";

export function SaveButton({
  onSave,
  disabled,
  label = "Save changes",
  successMessage = "Changes saved successfully",
}: {
  onSave: () => Promise<void>;
  disabled?: boolean;
  label?: string;
  successMessage?: string;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handle() {
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      toast.success(successMessage);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handle}
        disabled={disabled || saving}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving && <Spinner />}
        {saving ? "Saving…" : saved ? "Saved!" : label}
      </button>
    </div>
  );
}
