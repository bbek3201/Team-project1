"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { Skeleton } from "../components/skeleton";
import { FieldMessage } from "../components/field-message";
import { Spinner } from "../components/spinner";
import { useUser } from "../providers/user-provider";

// Validation patterns (mirrors the complete-profile onboarding flow)
// Name: letters, numbers, spaces and a few common punctuation marks, 2–50 chars
const NAME_REGEX = /^[\p{L}\p{N} .,'-]{2,50}$/u;
// Success confirmation message: at least 10 trimmed characters
const ABOUT_MIN = 10;
// Password: at least 8 chars, containing a letter and a number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
// Card number: exactly 16 digits
const CARD_REGEX = /^\d{16}$/;
// CVC: exactly 3 digits
const CVC_REGEX = /^\d{3}$/;

const onlyDigits = (value: string, max: number) =>
  value.replace(/\D/g, "").slice(0, max);

const COUNTRIES = [
  "Mongolia",
  "United States",
  "United Kingdom",
  "Germany",
  "Japan",
  "South Korea",
  "China",
  "Singapore",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => currentYear + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400";
const labelClass = "mb-2 block text-sm font-medium text-zinc-950";

const fieldClass = (invalid?: string) =>
  `w-full rounded-md border px-3 py-2 text-sm outline-none ${
    invalid ? "border-red-400" : "border-gray-200 focus:border-gray-400"
  }`;

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
      const res = await fetch("/api/account");
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
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="mx-auto flex max-w-6xl gap-10 px-8 py-8">
          <Sidebar />
          <main className="flex w-full max-w-[650px] flex-col gap-8">
            <Skeleton className="h-8 w-40" />
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="mx-auto flex max-w-6xl gap-10 px-8 py-8">
        <Sidebar />

        <main className="flex w-full max-w-[650px] flex-col gap-8 mb-22">
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
        </main>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white px-6 py-6">
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white px-6 py-6">
      <h2 className="text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

function SaveButton({
  onSave,
  disabled,
  label = "Save changes",
}: {
  onSave: () => Promise<void>;
  disabled?: boolean;
  label?: string;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handle() {
    setError("");
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && <p className="w-full text-sm text-red-500">⊗ {error}</p>}
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

async function patchAccount(body: Record<string, unknown>) {
  const res = await fetch("/api/account", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Request failed");
  }
}

function PersonalInfoCard({
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

function PasswordCard({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}: {
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const passwordError = !newPassword
    ? "Please enter a password"
    : !PASSWORD_REGEX.test(newPassword)
      ? "At least 8 characters, with a letter and a number"
      : undefined;
  const confirmError = !confirmPassword
    ? "Please confirm your password"
    : newPassword !== confirmPassword
      ? "Passwords do not match"
      : undefined;

  const isValid = !passwordError && !confirmError;
  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  return (
    <Card title="Set a new password">
      <div className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={() => markTouched("newPassword")}
            placeholder="Enter new password"
            className={fieldClass(touched.newPassword ? passwordError : undefined)}
          />
          <FieldMessage
            message={touched.newPassword ? passwordError : undefined}
            className="mt-1"
          />
        </div>
        <div>
          <label className={labelClass}>Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => markTouched("confirmPassword")}
            placeholder="Confirm password"
            className={fieldClass(
              touched.confirmPassword ? confirmError : undefined,
            )}
          />
          <FieldMessage
            message={touched.confirmPassword ? confirmError : undefined}
            className="mt-1"
          />
        </div>
      </div>

      <SaveButton
        disabled={!isValid}
        onSave={async () => {
          await patchAccount({ section: "password", newPassword });
          setNewPassword("");
          setConfirmPassword("");
          setTouched({});
        }}
      />
    </Card>
  );
}

function PaymentCard({
  country,
  setCountry,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  cardNumber,
  setCardNumber,
  month,
  setMonth,
  year,
  setYear,
}: {
  country: string;
  setCountry: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  month: string;
  setMonth: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
}) {
  const [cvc, setCvc] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const firstNameError = !firstName.trim()
    ? "Please enter first name"
    : !NAME_REGEX.test(firstName.trim())
      ? "Please enter a valid name"
      : undefined;
  const lastNameError = !lastName.trim()
    ? "Please enter last name"
    : !NAME_REGEX.test(lastName.trim())
      ? "Please enter a valid name"
      : undefined;
  const cardError = !cardNumber
    ? "Please enter card number"
    : !CARD_REGEX.test(cardNumber)
      ? "Card number must be 16 digits"
      : undefined;
  const cvcError = !cvc
    ? "Please enter CVC"
    : !CVC_REGEX.test(cvc)
      ? "CVC must be 3 digits"
      : undefined;

  const valid =
    country &&
    !firstNameError &&
    !lastNameError &&
    !cardError &&
    !cvcError &&
    month &&
    year;
  const show = (field: string, error?: string) =>
    touched[field] ? error : undefined;

  return (
    <Card title="Payment details">
      <div className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>Select country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
          >
            <option value="">Select</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => markTouched("firstName")}
              className={fieldClass(show("firstName", firstNameError))}
            />
            <FieldMessage
              message={show("firstName", firstNameError)}
              className="mt-1"
            />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => markTouched("lastName")}
              className={fieldClass(show("lastName", lastNameError))}
            />
            <FieldMessage
              message={show("lastName", lastNameError)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Enter card number</label>
          <input
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => setCardNumber(onlyDigits(e.target.value, 16))}
            onBlur={() => markTouched("cardNumber")}
            maxLength={16}
            placeholder="XXXXXXXXXXXXXXXX"
            className={fieldClass(show("cardNumber", cardError))}
          />
          <FieldMessage
            message={show("cardNumber", cardError)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Expires</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={inputClass}
            >
              <option value="">Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            >
              <option value="">Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>CVC</label>
            <input
              type="text"
              inputMode="numeric"
              value={cvc}
              onChange={(e) => setCvc(onlyDigits(e.target.value, 3))}
              onBlur={() => markTouched("cvc")}
              maxLength={3}
              placeholder="CVC"
              className={fieldClass(show("cvc", cvcError))}
            />
            <FieldMessage message={show("cvc", cvcError)} className="mt-1" />
          </div>
        </div>
      </div>

      <SaveButton
        disabled={!valid}
        onSave={() =>
          patchAccount({
            section: "payment",
            country,
            firstName,
            lastName,
            cardNumber,
            month,
            year,
          })
        }
      />
    </Card>
  );
}

function SuccessCard({
  successMessage,
  setSuccessMessage,
}: {
  successMessage: string;
  setSuccessMessage: (v: string) => void;
}) {
  const [touched, setTouched] = useState(false);
  const error = !successMessage.trim()
    ? "Please enter a confirmation message"
    : successMessage.trim().length < ABOUT_MIN
      ? `Please write at least ${ABOUT_MIN} characters`
      : undefined;

  return (
    <Card title="Success page">
      <div>
        <label className={labelClass}>Confirmation message</label>
        <textarea
          value={successMessage}
          onChange={(e) => setSuccessMessage(e.target.value)}
          onBlur={() => setTouched(true)}
          rows={5}
          className={fieldClass(touched ? error : undefined) + " resize-none"}
        />
        <FieldMessage message={touched ? error : undefined} className="mt-1" />
      </div>

      <SaveButton
        disabled={!!error}
        onSave={() => patchAccount({ section: "success", successMessage })}
      />
    </Card>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
