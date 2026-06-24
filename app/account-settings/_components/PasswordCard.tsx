"use client";

import { useState } from "react";
import { FieldMessage } from "../../components/FieldMessage";
import { Card } from "./Card";
import { SaveButton } from "./SaveButton";
import { PASSWORD_REGEX, fieldClass, labelClass } from "./constants";
import { patchAccount } from "./patch-account";

export function PasswordCard({
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
            className={fieldClass(
              touched.newPassword ? passwordError : undefined,
            )}
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
        successMessage="Password updated"
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
