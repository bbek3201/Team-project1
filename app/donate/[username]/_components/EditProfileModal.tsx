"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Spinner } from "../../../components/Spinner";
import { CameraIcon } from "./Icons";
import type { Creator } from "./types";

export type ProfileEdit = {
  name: string;
  about: string;
  socialMediaURL: string;
  avatar: string;
};

export function EditProfileModal({
  creator,
  onClose,
  onSaved,
}: {
  creator: Creator;
  onClose: () => void;
  onSaved: (updated: ProfileEdit) => Promise<void> | void;
}) {
  const router = useRouter();
  const [name, setName] = useState(creator.name);
  const [about, setAbout] = useState(creator.about);
  const [social, setSocial] = useState(creator.socialMediaURL);
  const [avatar] = useState(creator.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    try {
      let finalAvatar = avatar;
      if (avatarFile) {
        const response = await fetch(
          `/api/avatar/upload?filename=${avatarFile.name}`,
          { method: "POST", body: avatarFile },
        );
        if (!response.ok) throw new Error("Failed to upload image");
        const blob = await response.json();
        finalAvatar = blob.url;
      }
      const res = await apiFetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "profile",
          name,
          about,
          socialMediaURL: social,
          avatarImage: finalAvatar,
        }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      await onSaved({ name, about, socialMediaURL: social, avatar: finalAvatar });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-139.5 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Edit profile</h2>
            <p className="mt-1 text-sm text-gray-500">
              Make changes to your profile here. Click save when you&apos;re
              done.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Add photo */}
        <p className="mb-2 mt-6 text-sm font-medium">Add photo</p>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <button
          onClick={() => avatarInputRef.current?.click()}
          className="group relative h-40 w-40 overflow-hidden rounded-full bg-gray-100"
        >
          {preview || avatar ? (
            <img
              src={preview || avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
            <CameraIcon className="h-6 w-6" />
          </span>
        </button>

        {/* Name */}
        <label className="mb-1 mt-6 block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
        />

        {/* About */}
        <label className="mb-1 mt-4 block text-sm font-medium">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
        />

        {/* Social media URL */}
        <label className="mb-1 mt-4 block text-sm font-medium">
          Social media URL
        </label>
        <input
          value={social}
          onChange={(e) => setSocial(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
        />

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#18181b] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {saving && <Spinner />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
