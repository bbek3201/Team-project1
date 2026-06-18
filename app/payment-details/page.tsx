"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function PaymentDetailsPage() {
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

  const isValid =
    country && firstName && lastName && cardNumber && month && year && cvc;

  async function handleContinue() {
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
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center px-12 py-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span>☕</span>
          <span>Buy Me Coffee</span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-12 py-10">
        <h1 className="mb-2 text-3xl font-bold">
          How would you like to be paid?
        </h1>
        <p className="mb-8 text-gray-500">Enter location and payment details</p>

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
              placeholder="Enter your name here"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your name here"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <label className="mb-1 block font-medium">Enter card number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
        />

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
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder="CVC"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
            />
          </div>
        </div>
        {error && <p className="mb-4 text-sm text-red-500">⊗ {error}</p>}

        <button
          onClick={handleContinue}
          disabled={!isValid || loading}
          className="mt-6 w-full rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
