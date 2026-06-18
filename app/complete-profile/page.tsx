"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [avatarImage, setAvatarImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialMediaURL, setSocialMediaURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });
      const blob = await response.json();
      setAvatarImage(blob.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleContinue() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, about, avatarImage, socialMediaURL }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      router.push("/payment-details");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span>☕</span>
          <span>Buy Me Coffee</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md bg-gray-100 px-5 py-2 font-medium text-gray-800"
        >
          Log out
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-12 py-10">
        <h1 className="mb-8 text-3xl font-bold">Complete your profile page</h1>

        <label className="mb-2 block font-medium">Add photo</label>
        <label className="mb-8 block w-fit cursor-pointer">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {uploading ? (
              <span className="text-sm text-gray-500">Uploading...</span>
            ) : avatarImage ? (
              <img
                src={avatarImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500">Upload</span>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>

        <label className="mb-1 block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
        />

        <label className="mb-1 block font-medium">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
        />

        <label className="mb-1 block font-medium">Social media URL</label>
        <input
          type="text"
          value={socialMediaURL}
          onChange={(e) => setSocialMediaURL(e.target.value)}
          placeholder="https://buymeacoffee.com/username"
          className="mb-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
        />
        {error && <p className="mb-4 text-sm text-red-500">⊗ {error}</p>}

        <button
          onClick={handleContinue}
          disabled={!name || !about || !socialMediaURL || uploading || loading}
          className="mt-4 w-full rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
