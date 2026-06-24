"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../components/AppShell";
import { Skeleton } from "../components/Skeleton";
import { useUser } from "../providers/UserProvider";
import { apiFetch } from "@/lib/api";
import { CardSkeleton } from "./_components/Card";
import { PersonalInfoCard } from "./_components/PersonalInfoCard";
import { PasswordCard } from "./_components/PasswordCard";
import { PaymentCard } from "./_components/PaymentCard";
import { SuccessCard } from "./_components/SuccessCard";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { refresh } = useUser();
  const [loaded, setLoaded] = useState(false);

  // Personal info
  const [avatarImage, setAvatarImage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [socialMediaURL, setSocialMediaURL] = useState("");

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Payment
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Success page
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await apiFetch("/api/account");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setName(data.profile.name);
      setAbout(data.profile.about);
      setAvatarImage(data.profile.avatarImage);
      setSocialMediaURL(data.profile.socialMediaURL);
      setSuccessMessage(data.profile.successMessage);
      setCountry(data.payment.country);
      setFirstName(data.payment.firstName);
      setLastName(data.payment.lastName);
      setCardNumber(data.payment.cardNumber);
      setMonth(data.payment.month ? String(data.payment.month) : "");
      setYear(data.payment.year ? String(data.payment.year) : "");
      setLoaded(true);
    }
    load();
  }, [router]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  if (!loaded) {
    return (
      <AppShell mainClassName="flex w-full max-w-[650px] flex-col gap-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="flex w-full max-w-[650px] flex-col gap-8 mb-10">
      <h1 className="text-2xl font-semibold tracking-tight">My account</h1>

      <PersonalInfoCard
        avatarImage={avatarImage}
        setAvatarImage={setAvatarImage}
        avatarPreview={avatarPreview}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        onPhotoChange={handlePhotoChange}
        name={name}
        setName={setName}
        about={about}
        setAbout={setAbout}
        socialMediaURL={socialMediaURL}
        setSocialMediaURL={setSocialMediaURL}
        onSaved={refresh}
      />

      <PasswordCard
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      <PaymentCard
        country={country}
        setCountry={setCountry}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />

      <SuccessCard
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    </AppShell>
  );
}
