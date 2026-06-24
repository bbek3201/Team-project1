"use client";

import { useState } from "react";
import { FieldMessage } from "../../components/FieldMessage";
import { Card } from "./Card";
import { CameraIcon } from "./CameraIcon";
import { SaveButton } from "./SaveButton";
import { NAME_REGEX, fieldClass, labelClass } from "./constants";
import { patchAccount } from "./patch-account";

export function PersonalInfoCard({
  avatarImage,
  setAvatarImage,
  avatarPreview,
  photoFile,
  setPhotoFile,
  onPhotoChange,
  name,
  setName,
  about,
  setAbout,
  socialMediaURL,
  setSocialMediaURL,
  onSaved,
}: {
  avatarImage: string;
  setAvatarImage: (v: string) => void;
  avatarPreview: string;
  photoFile: File | null;
  setPhotoFile: (v: File | null) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  setName: (v: string) => void;
  about: string;
  setAbout: (v: string) => void;
  socialMediaURL: string;
  setSocialMediaURL: (v: string) => void;
  onSaved: () => Promise<void>;
}) {
  const shownAvatar = avatarPreview || avatarImage;
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors: Record<string, string | undefined> = {};
  if (!name.trim()) errors.name = "Please enter name";
  else if (!NAME_REGEX.test(name.trim()))
    errors.name = "Please enter a valid name";

  if (!about.trim()) errors.about = "Please enter info about yourself";

  if (!socialMediaURL.trim())
    errors.socialMediaURL = "Please enter a social link";

  const isValid = Object.keys(errors).length === 0;
  const show = (field: string) => (touched[field] ? errors[field] : undefined);
  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  return (
    <Card title="Personal Info">
      <div className="flex flex-col gap-3">
        <span className={labelClass + " mb-0"}>Add photo</span>
        <label className="block w-40 cursor-pointer">
          <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {shownAvatar ? (
              <img
                src={shownAvatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : null}
            <CameraIcon className="absolute h-7 w-7 text-white drop-shadow" />
          </div>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={onPhotoChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => markTouched("name")}
            maxLength={50}
            className={fieldClass(show("name"))}
          />
          <FieldMessage message={show("name")} className="mt-1" />
        </div>
        <div>
          <label className={labelClass}>About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            onBlur={() => markTouched("about")}
            rows={5}
            className={fieldClass(show("about")) + " resize-none"}
          />
          <FieldMessage message={show("about")} className="mt-1" />
        </div>
        <div>
          <label className={labelClass}>Social media URL</label>
          <input
            type="text"
            value={socialMediaURL}
            onChange={(e) => setSocialMediaURL(e.target.value)}
            onBlur={() => markTouched("socialMediaURL")}
            placeholder="https://buymeacoffee.com/username"
            className={fieldClass(show("socialMediaURL"))}
          />
          <FieldMessage message={show("socialMediaURL")} className="mt-1" />
        </div>
      </div>

      <SaveButton
        disabled={!isValid}
        successMessage="Personal info updated"
        onSave={async () => {
          let finalAvatar = avatarImage;
          if (photoFile) {
            const response = await fetch(
              `/api/avatar/upload?filename=${photoFile.name}`,
              { method: "POST", body: photoFile },
            );
            if (!response.ok) throw new Error("Failed to upload image");
            const blob = await response.json();
            finalAvatar = blob.url;
            setAvatarImage(finalAvatar);
            setPhotoFile(null);
          }
          await patchAccount({
            section: "profile",
            name,
            about,
            avatarImage: finalAvatar,
            socialMediaURL,
          });
          await onSaved();
        }}
      />
    </Card>
  );
}
