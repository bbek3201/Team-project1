"use client";

import { useRef } from "react";
import { Spinner } from "../../../components/Spinner";
import { CameraIcon } from "./Icons";

export function CoverBand({
  backgroundImage,
  isOwner,
  uploading,
  onFileSelected,
}: {
  backgroundImage: string;
  isOwner: boolean;
  uploading: boolean;
  onFileSelected: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCover = !!backgroundImage;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="relative">
      <div
        className="h-80 w-full bg-gray-100 bg-cover bg-center"
        style={
          hasCover ? { backgroundImage: `url(${backgroundImage})` } : undefined
        }
      >
        {isOwner && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            {hasCover ? (
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="absolute right-6 top-6 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60"
              >
                {uploading ? <Spinner /> : <CameraIcon />}
                Change cover
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-md bg-[#18181b] px-4 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                >
                  {uploading ? <Spinner /> : <CameraIcon />}
                  Add a cover image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
