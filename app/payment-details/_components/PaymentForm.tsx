"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../providers/UserProvider";
import { FieldMessage } from "../../components/FieldMessage";
import { Spinner } from "../../components/Spinner";
import {
  CARD_REGEX,
  COUNTRIES,
  CVC_REGEX,
  MONTHS,
  NAME_REGEX,
  YEARS,
  onlyDigits,
} from "./constants";

export function PaymentForm() {
  const router = useRouter();
  const { refresh } = useUser();
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const isValid =
    country &&
    !firstNameError &&
    !lastNameError &&
    !cardError &&
    !cvcError &&
    month &&
    year;

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));
  const show = (field: string, fieldError?: string) =>
    touched[field] ? fieldError : undefined;
  const borderClass = (invalid?: string) =>
    `w-full rounded-md border px-4 py-3 outline-none ${
      invalid ? "border-red-400" : "border-gray-300"
    }`;

  async function handleContinue() {
    setTouched({
      firstName: true,
      lastName: true,
      cardNumber: true,
      cvc: true,
    });
    if (!isValid) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/bank-card/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          firstName,
          lastName,
          cardNumber,
          month,
          year,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      // Refresh the cached session so the onboarding guards see the saved
      // card and route us forward to the final success-message step.
      await refresh();
      router.push("/success-message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <label className="mb-1 block font-medium">Select country</label>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
      >
        <option value="">Select</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-medium">First name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => markTouched("firstName")}
            placeholder="Enter your name here"
            className={borderClass(show("firstName", firstNameError))}
          />
          <FieldMessage
            message={show("firstName", firstNameError)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => markTouched("lastName")}
            placeholder="Enter your name here"
            className={borderClass(show("lastName", lastNameError))}
          />
          <FieldMessage
            message={show("lastName", lastNameError)}
            className="mt-1"
          />
        </div>
      </div>

      <label className="mb-1 block font-medium">Enter card number</label>
      <input
        type="text"
        inputMode="numeric"
        value={cardNumber}
        onChange={(e) => setCardNumber(onlyDigits(e.target.value, 16))}
        onBlur={() => markTouched("cardNumber")}
        maxLength={16}
        placeholder="XXXXXXXXXXXXXXXX"
        className={borderClass(show("cardNumber", cardError)) + " mb-1"}
      />
      <FieldMessage message={show("cardNumber", cardError)} className="mb-5" />

      <div className="mb-2 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block font-medium">Expires</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
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
          <label className="mb-1 block font-medium">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
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
          <label className="mb-1 block font-medium">CVC</label>
          <input
            type="text"
            inputMode="numeric"
            value={cvc}
            onChange={(e) => setCvc(onlyDigits(e.target.value, 3))}
            onBlur={() => markTouched("cvc")}
            maxLength={3}
            placeholder="CVC"
            className={borderClass(show("cvc", cvcError))}
          />
          <FieldMessage message={show("cvc", cvcError)} className="mt-1" />
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-red-500">⊗ {error}</p>}

      <button
        onClick={handleContinue}
        disabled={!isValid || loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "Saving..." : "Continue"}
      </button>
    </>
  );
}
