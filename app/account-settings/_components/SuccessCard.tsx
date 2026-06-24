"use client";

import { useState } from "react";
import { FieldMessage } from "../../components/FieldMessage";
import { Card } from "./Card";
import { SaveButton } from "./SaveButton";
import { ABOUT_MIN, fieldClass, labelClass } from "./constants";
import { patchAccount } from "./patch-account";

export function SuccessCard({
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
        successMessage="Success page updated"
        onSave={() => patchAccount({ section: "success", successMessage })}
      />
    </Card>
  );
}
