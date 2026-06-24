"use client";

import { useState } from "react";
import { FieldMessage } from "../../components/FieldMessage";
import { Card } from "./Card";
import { SaveButton } from "./SaveButton";
import {
  CARD_REGEX,
  COUNTRIES,
  CVC_REGEX,
  MONTHS,
  NAME_REGEX,
  YEARS,
  fieldClass,
  inputClass,
  labelClass,
  onlyDigits,
} from "./constants";
import { patchAccount } from "./patch-account";

export function PaymentCard({
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
        successMessage="Payment details updated"
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
