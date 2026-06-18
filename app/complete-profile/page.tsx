"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../providers/user-provider";
import { Spinner } from "../components/spinner";

// Validation patterns
// Name: letters, numbers, spaces and a few common punctuation marks, 2–50 chars
const NAME_REGEX = /^[\p{L}\p{N} .,'-]{2,50}$/u;

type FieldErrors = {
  photo?: string;
  name?: string;
  about?: string;
  socialMediaURL?: string;
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialMediaURL, setSocialMediaURL] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Users who already completed their profile shouldn't see this onboarding page
  useEffect(() => {
    if (!userLoading && user?.hasProfile) {
      router.replace("/");
    }
  }, [userLoading, user, router]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!photoFile) {
      errors.photo = "Please enter image";
    }

    if (!name.trim()) {
      errors.name = "Please enter name";
    } else if (!NAME_REGEX.test(name.trim())) {
      errors.name = "Please enter a valid name";
    }

    if (!about.trim()) {
      errors.about = "Please enter info about yourself";
    }

    if (!socialMediaURL.trim()) {
      errors.socialMediaURL = "Please enter a social link";
    }

    return errors;
  }

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  function show(field: keyof FieldErrors) {
    return touched[field] ? errors[field] : undefined;
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setTouched((t) => ({ ...t, photo: true }));
    if (!file) return;
    setPhotoFile(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function handleContinue() {
    setTouched({ photo: true, name: true, about: true, socialMediaURL: true });
    if (!isValid) return;

    setServerError("");
    setLoading(true);
    try {
      let avatarImage = "";
      if (photoFile) {
        const response = await fetch(
          `/api/avatar/upload?filename=${photoFile.name}`,
          { method: "POST", body: photoFile },
        );
        if (!response.ok) {
          setServerError("Failed to upload image");
          return;
        }
        const blob = await response.json();
        avatarImage = blob.url;
      }

      const res = await fetch("/api/profile/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          about: about.trim(),
          avatarImage,
          socialMediaURL: socialMediaURL.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error);
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

  const inputClass = (invalid?: string) =>
    `w-full rounded-md border px-4 py-3 outline-none ${
      invalid ? "border-red-400" : "border-gray-300 focus:border-gray-400"
    }`;

  // Avoid flashing the form while we resolve the user or redirect away
  if (userLoading || user?.hasProfile) {
    return <div className="min-h-screen" />;
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
        <label className="mb-2 block w-fit cursor-pointer">
          <div
            className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-full ${
              show("photo")
                ? "border-2 border-dashed border-red-400"
                : "bg-gray-200"
            }`}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <CameraIcon />
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
        <FieldError message={show("photo")} className="mb-6" />

        <label className="mb-1 block font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Enter your name here"
          maxLength={50}
          className={inputClass(show("name"))}
        />
        <FieldError message={show("name")} className="mb-6 mt-2" />

        <label className="mb-1 block font-medium">About</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, about: true }))}
          rows={4}
          placeholder="Write about yourself here"
          className={inputClass(show("about"))}
        />
        <FieldError message={show("about")} className="mb-6 mt-2" />

        <label className="mb-1 block font-medium">Social media URL</label>
        <input
          type="text"
          value={socialMediaURL}
          onChange={(e) => setSocialMediaURL(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, socialMediaURL: true }))}
          placeholder="https://"
          className={inputClass(show("socialMediaURL"))}
        />
        <FieldError message={show("socialMediaURL")} className="mb-2 mt-2" />

        {serverError && (
          <p className="mb-4 text-sm text-red-500">⊗ {serverError}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={!isValid || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-20"
        >
          {loading && <Spinner />}
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

function FieldError({
  message,
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <XCircleIcon />
      <p className="text-xs text-red-500">{message}</p>
    </div>
  );
}

function XCircleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-red-500"
    >
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 7.5l5 5M12.5 7.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
