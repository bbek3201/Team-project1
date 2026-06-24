"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useUser } from "../../providers/UserProvider";
import { apiFetch } from "@/lib/api";
import { CoverBand } from "./_components/CoverBand";
import { DonateSkeleton } from "./_components/DonateSkeleton";
import { DonationComplete } from "./_components/DonationComplete";
import { DonationForm } from "./_components/DonationForm";
import {
  EditProfileModal,
  type ProfileEdit,
} from "./_components/EditProfileModal";
import {
  ProfileAboutCard,
  SocialCard,
} from "./_components/ProfileAboutCard";
import { SupportersList } from "./_components/SupportersList";
import type { Creator, Supporter } from "./_components/types";

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
  const [done, setDone] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const isOwner = !!user && user.username === username;

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

  async function handleCoverChange(file: File) {
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
    }
  }

  async function handleProfileSaved(updated: ProfileEdit) {
    setCreator((c) =>
      c
        ? {
            ...c,
            name: updated.name,
            about: updated.about,
            socialMediaURL: updated.socialMediaURL,
            avatar: updated.avatar,
          }
        : c,
    );
    await refresh();
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Creator not found.
      </div>
    );
  }

  if (!creator) {
    return <DonateSkeleton />;
  }

  if (done) {
    return (
      <DonationComplete
        creator={creator}
        onReturn={() => router.push("/explore")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <CoverBand
        backgroundImage={creator.backgroundImage}
        isOwner={isOwner}
        uploading={coverUploading}
        onFileSelected={handleCoverChange}
      />

      <div className="relative z-10 mx-auto -mt-16 max-w-304 px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <ProfileAboutCard
              creator={creator}
              isOwner={isOwner}
              onEdit={() => setEditOpen(true)}
            />
            <SocialCard creator={creator} />
            <SupportersList
              supporters={supporters}
              creatorName={creator.name}
            />
          </div>

          <DonationForm
            username={username}
            creatorName={creator.name}
            isOwner={isOwner}
            onDone={() => setDone(true)}
          />
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          creator={creator}
          onClose={() => setEditOpen(false)}
          onSaved={handleProfileSaved}
        />
      )}
    </div>
  );
}
