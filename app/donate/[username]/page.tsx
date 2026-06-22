"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import { Spinner } from "../../components/spinner";
import { Skeleton } from "../../components/skeleton";
import { useUser } from "../../providers/user-provider";
import { apiFetch } from "@/lib/api";

type Creator = {
  username: string;
  name: string;
  avatar: string;
  about: string;
  socialMediaURL: string;
  backgroundImage: string;
  successMessage: string;
};

type Supporter = {
  id: number;
  name: string;
  avatar: string;
  socialURL: string;
  amount: number;
  message: string;
  createdAt: string;
};

const AMOUNTS = [1, 2, 5, 10];

function CoffeeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function Avatar({
  src,
  name,
  size = "h-12 w-12",
  textSize = "text-sm",
}: {
  src: string;
  name: string;
  size?: string;
  textSize?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`${size} ${textSize} flex shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-500`}
    >
      {(name || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function DonatePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();
  const { user, refresh } = useUser();

  const [creator, setCreator] = useState<Creator | null>(null);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [showAllSupporters, setShowAllSupporters] = useState(false);

  const [amount, setAmount] = useState(5);
  const [social, setSocial] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Edit profile modal
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editSocial, setEditSocial] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const editAvatarInputRef = useRef<HTMLInputElement>(null);

  const isOwner = !!user && user.username === username;

  function openEdit() {
    if (!creator) return;
    setEditName(creator.name);
    setEditAbout(creator.about);
    setEditSocial(creator.socialMediaURL);
    setEditAvatar(creator.avatar);
    setEditAvatarFile(null);
    setEditPreview("");
    setEditOpen(true);
  }

  function handleEditAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditAvatarFile(file);
    setEditPreview(URL.createObjectURL(file));
  }

  async function handleSaveProfile() {
    setEditSaving(true);
    try {
      let finalAvatar = editAvatar;
      if (editAvatarFile) {
        const response = await fetch(
          `/api/avatar/upload?filename=${editAvatarFile.name}`,
          { method: "POST", body: editAvatarFile },
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
          name: editName,
          about: editAbout,
          socialMediaURL: editSocial,
          avatarImage: finalAvatar,
        }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      setCreator((c) =>
        c
          ? {
              ...c,
              name: editName,
              about: editAbout,
              socialMediaURL: editSocial,
              avatar: finalAvatar,
            }
          : c,
      );
      await refresh();
      setEditOpen(false);
    } finally {
      setEditSaving(false);
    }
  }

  useEffect(() => {
    fetch(`/api/creators/${username}`).then(async (res) => {
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      setCreator(await res.json());
    });
    fetch(`/api/creators/${username}/supporters`).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setSupporters(data.supporters ?? []);
      }
    });
  }, [username]);

  async function handleSend() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUsername: username,
          amount,
          specialMessage: message,
          socialURLOrBuyMeACoffee: social,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const response = await fetch(`/api/avatar/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      const blob = await response.json();
      const res = await apiFetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "profile", backgroundImage: blob.url }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      setCreator((c) => (c ? { ...c, backgroundImage: blob.url } : c));
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Creator not found.
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />

        {/* Cover band skeleton */}
        <Skeleton className="h-80 w-full rounded-none" />

        {/* Two columns skeleton */}
        <div className="relative z-10 mx-auto -mt-16 max-w-304 px-4 pb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              {/* Profile + about */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
                <hr className="my-4 border-gray-200" />
                <Skeleton className="mb-3 h-4 w-28" />
                <Skeleton className="mb-2 h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>

              {/* Social media URL */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <Skeleton className="mb-3 h-4 w-32" />
                <Skeleton className="h-3 w-1/2" />
              </div>

              {/* Recent supporters */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <Skeleton className="mb-4 h-4 w-36" />
                <div className="flex flex-col gap-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="mb-2 h-3 w-40" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: donation form */}
            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <Skeleton className="mb-5 h-6 w-48" />
              <Skeleton className="mb-2 h-4 w-28" />
              <div className="mb-5 flex gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-11 flex-1" />
                ))}
              </div>
              <Skeleton className="mb-2 h-4 w-64" />
              <Skeleton className="mb-4 h-11 w-full" />
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="mb-4 h-28 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5l4 4 10-10"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mb-6 text-xl font-bold">Donation Complete !</h1>
          <div className="w-full max-w-md rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2">
              <Avatar
                src={creator.avatar}
                name={creator.name}
                size="h-7 w-7"
                textSize="text-[10px]"
              />
              <p className="text-sm font-semibold">{creator.name}:</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {creator.successMessage ||
                "Thank you for supporting me! It means a lot to have your support."}
            </p>
          </div>
          <button
            onClick={() => router.push("/explore")}
            className="mt-6 rounded-lg bg-[#18181b] px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
          >
            Return to explore
          </button>
        </div>
      </div>
    );
  }

  const hasCover = !!creator.backgroundImage;
  const visibleSupporters = showAllSupporters
    ? supporters
    : supporters.slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Cover band */}
      <div className="relative">
        <div
          className="h-80 w-full bg-gray-100 bg-cover bg-center"
          style={
            hasCover
              ? { backgroundImage: `url(${creator.backgroundImage})` }
              : undefined
          }
        >
          {isOwner && (
            <>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              {hasCover ? (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={coverUploading}
                  className="absolute right-6 top-6 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                >
                  {coverUploading ? <Spinner /> : <CameraIcon />}
                  Change cover
                </button>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    disabled={coverUploading}
                    className="flex items-center gap-2 rounded-md bg-[#18181b] px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                  >
                    {coverUploading ? <Spinner /> : <CameraIcon />}
                    Add a cover image
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Two columns */}
      <div className="relative z-10 mx-auto -mt-16 max-w-304 px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            {/* Profile + about */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={creator.avatar} name={creator.name} />
                  <p className="text-xl font-bold">{creator.name}</p>
                </div>
                {isOwner && (
                  <button
                    onClick={openEdit}
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                  >
                    Edit page
                  </button>
                )}
              </div>
              <hr className="my-4 border-gray-200" />
              <h2 className="mb-2 font-semibold">About {creator.name}</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {creator.about || "No description yet."}
              </p>
            </div>

            {/* Social media URL */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-2 font-semibold">Social media URL</h2>
              {creator.socialMediaURL ? (
                <a
                  href={creator.socialMediaURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-700 underline-offset-2 hover:underline"
                >
                  {creator.socialMediaURL}
                </a>
              ) : (
                <p className="text-sm text-gray-400">No social link yet.</p>
              )}
            </div>

            {/* Recent supporters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold">Recent Supporters</h2>
              {supporters.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 py-12">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-gray-900"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <p className="font-medium">
                    Be the first one to support {creator.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {visibleSupporters.map((s) => (
                    <div key={s.id} className="flex gap-3">
                      <Avatar
                        src={s.avatar}
                        name={s.name}
                        size="h-8 w-8"
                        textSize="text-xs"
                      />
                      <div className="min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{s.name}</span> bought
                          ${s.amount} coffee
                        </p>
                        {s.message && (
                          <p className="mt-1 text-sm text-gray-600">
                            {s.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {supporters.length > 3 && (
                    <button
                      onClick={() => setShowAllSupporters((v) => !v)}
                      className="flex items-center justify-center gap-1 rounded-md border border-gray-200 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                      {showAllSupporters ? "Show less" : "See more"}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={showAllSupporters ? "rotate-180" : ""}
                      >
                        <path
                          d="M6 8l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column: donation form */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              Buy {creator.name} a Coffee
            </h2>

            <label className="mb-2 block text-sm font-medium">
              Select amount:
            </label>
            <div className="mb-5 flex gap-3">
              {AMOUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(n)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium ${
                    amount === n
                      ? "border-[#18181b] ring-1 ring-[#18181b]"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <CoffeeIcon className="text-gray-700" />${n}
                </button>
              ))}
            </div>

            <label className="mb-1 block text-sm font-medium">
              Enter BuyMeCoffee or social acount URL:
            </label>
            <input
              value={social}
              onChange={(e) => setSocial(e.target.value)}
              placeholder="buymeacoffee.com/"
              disabled={isOwner}
              className="mb-4 w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 disabled:bg-gray-50"
            />

            <label className="mb-1 block text-sm font-medium">
              Special message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please write your message here"
              rows={4}
              disabled={isOwner}
              className="mb-4 w-full resize-none rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400 disabled:bg-gray-50"
            />

            {error && <p className="mb-3 text-sm text-red-500">⊗ {error}</p>}

            <button
              onClick={handleSend}
              disabled={isOwner || !social || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181b] py-3 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {loading && <Spinner />}
              {loading ? "Sending…" : "Support"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !editSaving && setEditOpen(false)}
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
                onClick={() => setEditOpen(false)}
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
              ref={editAvatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleEditAvatarChange}
              className="hidden"
            />
            <button
              onClick={() => editAvatarInputRef.current?.click()}
              className="group relative h-40 w-40 overflow-hidden rounded-full bg-gray-100"
            >
              {editPreview || editAvatar ? (
                <img
                  src={editPreview || editAvatar}
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
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            {/* About */}
            <label className="mb-1 mt-4 block text-sm font-medium">About</label>
            <textarea
              value={editAbout}
              onChange={(e) => setEditAbout(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            {/* Social media URL */}
            <label className="mb-1 mt-4 block text-sm font-medium">
              Social media URL
            </label>
            <input
              value={editSocial}
              onChange={(e) => setEditSocial(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
            />

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                disabled={editSaving}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editSaving}
                className="flex items-center gap-2 rounded-md bg-[#18181b] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
              >
                {editSaving && <Spinner />}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
