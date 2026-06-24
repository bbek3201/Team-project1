"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../../components/Spinner";
import { CameraIcon } from "./CameraIcon";
import { FieldError } from "./FieldError";

// Name: letters, numbers, spaces and a few common punctuation marks, 2–50 chars
const NAME_REGEX = /^[\p{L}\p{N} .,'-]{2,50}$/u;

type FieldErrors = {
  photo?: string;
  name?: string;
  about?: string;
  socialMediaURL?: string;
};

export function ProfileForm() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialMediaURL, setSocialMediaURL] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const inputClass = (invalid?: string) =>
    `w-full rounded-md border px-4 py-3 outline-none ${
      invalid ? "border-red-400" : "border-gray-300 focus:border-gray-400"
    }`;

  return (
    <>
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
    </>
  );
}
