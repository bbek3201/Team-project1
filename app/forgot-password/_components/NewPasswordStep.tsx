import { FieldMessage } from "../../components/FieldMessage";
import { Spinner } from "../../components/Spinner";

export function NewPasswordStep({
  password,
  setPassword,
  confirm,
  setConfirm,
  touched,
  setTouched,
  passwordError,
  confirmError,
  error,
  loading,
  onSubmit,
}: {
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
  touched: boolean;
  setTouched: (v: boolean) => void;
  passwordError: string;
  confirmError: string;
  error: string;
  loading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}) {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Set new password</h2>
      <p className="mb-6 text-gray-500">Choose a new password for your account.</p>

      <form onSubmit={onSubmit}>
        <label className="mb-1 block font-medium">New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Enter new password here"
          className={`w-full rounded-md border px-4 py-3 outline-none ${
            touched && passwordError ? "border-red-400" : "border-gray-300"
          }`}
        />
        <FieldMessage
          message={touched ? passwordError : ""}
          className="mt-1.5"
        />

        <label className="mb-1 mt-4 block font-medium">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Re-enter new password"
          className={`w-full rounded-md border px-4 py-3 outline-none ${
            touched && confirmError ? "border-red-400" : "border-gray-300"
          }`}
        />
        <FieldMessage
          message={touched ? confirmError : ""}
          className="mt-1.5"
        />

        {error && <p className="mb-4 mt-2 text-sm text-red-500">⊗ {error}</p>}

        <button
          type="submit"
          disabled={!password || !confirm || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? "Saving..." : "Reset password"}
        </button>
      </form>
    </>
  );
}
