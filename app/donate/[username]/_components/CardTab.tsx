"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { FieldMessage } from "../../../components/FieldMessage";
import { Skeleton } from "../../../components/Skeleton";
import { Spinner } from "../../../components/Spinner";
import {
  CARD_REGEX,
  CVC_REGEX,
  MONTHS,
  NAME_REGEX,
  YEARS,
  onlyDigits,
} from "@/lib/payment";

export function CardTab({
  recipientUsername,
  amount,
  social,
  message,
  onCompleted,
}: {
  recipientUsername: string;
  amount: number;
  social: string;
  message: string;
  onCompleted: () => void;
}) {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Snapshot of the prefilled card so we can detect edits on Continue.
  const initialRef = useRef({
    firstName: "",
    lastName: "",
    cardNumber: "",
    month: "",
    year: "",
  });

  // Prefill the donor's previously saved card details (everything except CVC).
  useEffect(() => {
    apiFetch("/api/account")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        const p = data.payment;
        const next = {
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          cardNumber: p.cardNumber ?? "",
          month: p.month ? String(p.month) : "",
          year: p.year ? String(p.year) : "",
        };
        setCountry(p.country ?? "");
        setFirstName(next.firstName);
        setLastName(next.lastName);
        setCardNumber(next.cardNumber);
        setMonth(next.month);
        setYear(next.year);
        initialRef.current = next;
      })
      .finally(() => setInitializing(false));
  }, []);

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
    !firstNameError && !lastNameError && !cardError && !cvcError && month && year;

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));
  const show = (field: string, fieldError?: string) =>
    touched[field] ? fieldError : undefined;
  const borderClass = (invalid?: string) =>
    `w-full rounded-md border px-4 py-2.5 text-sm outline-none ${
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
      // If the donor edited any saved card field, persist it back to their bank card.
      const init = initialRef.current;
      const changed =
        firstName !== init.firstName ||
        lastName !== init.lastName ||
        cardNumber !== init.cardNumber ||
        month !== init.month ||
        year !== init.year;
      if (changed && country) {
        const upd = await apiFetch("/api/account", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "payment",
            country,
            firstName,
            lastName,
            cardNumber,
            month,
            year,
          }),
        });
        if (upd.status === 401) {
          router.push("/login");
          return;
        }
        if (!upd.ok) {
          const e = await upd.json();
          setError(e.error ?? "Failed to update card");
          return;
        }
        initialRef.current = { firstName, lastName, cardNumber, month, year };
      }

      const res = await apiFetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientUsername,
          amount,
          specialMessage: message,
          socialURLOrBuyMeACoffee: social,
          paymentType: "CARD",
        }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      onCompleted();
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <Skeleton className="mb-1 mt-4 h-4 w-24" />
        <Skeleton className="h-10 w-full" />

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="mb-1 h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-6 h-11 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">First name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => markTouched("firstName")}
            placeholder="First"
            className={borderClass(show("firstName", firstNameError))}
          />
          <FieldMessage
            message={show("firstName", firstNameError)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => markTouched("lastName")}
            placeholder="Last"
            className={borderClass(show("lastName", lastNameError))}
          />
          <FieldMessage
            message={show("lastName", lastNameError)}
            className="mt-1"
          />
        </div>
      </div>

      <label className="mb-1 mt-4 block text-sm font-medium">Card number</label>
      <input
        type="text"
        inputMode="numeric"
        value={cardNumber}
        onChange={(e) => setCardNumber(onlyDigits(e.target.value, 16))}
        onBlur={() => markTouched("cardNumber")}
        maxLength={16}
        placeholder="XXXX XXXX XXXX XXXX"
        className={borderClass(show("cardNumber", cardError))}
      />
      <FieldMessage message={show("cardNumber", cardError)} className="mt-1" />

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Expires</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none"
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
          <label className="mb-1 block text-sm font-medium">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none"
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
          <label className="mb-1 block text-sm font-medium">CVC</label>
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

      {error && <p className="mt-3 text-sm text-red-500">⊗ {error}</p>}

      <button
        onClick={handleContinue}
        disabled={!isValid || loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#18181b] py-3 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "Processing…" : "Continue"}
      </button>
    </div>
  );
}
