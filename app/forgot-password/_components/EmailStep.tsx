import { FieldMessage } from "../../components/FieldMessage";
import { Spinner } from "../../components/Spinner";

export function EmailStep({
  email,
  setEmail,
  emailTouched,
  setEmailTouched,
  emailError,
  error,
  loading,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  emailTouched: boolean;
  setEmailTouched: (v: boolean) => void;
  emailError: string;
  error: string;
  loading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}) {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Reset password</h2>
      <p className="mb-6 text-gray-500">
        Enter your email and we&apos;ll send you a 6-digit code.
      </p>

      <form onSubmit={onSubmit}>
        <label className="mb-1 block font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          placeholder="Enter email here"
          className={`w-full rounded-md border px-4 py-3 outline-none ${
            emailTouched && emailError ? "border-red-400" : "border-gray-300"
          }`}
        />
        <FieldMessage
          message={emailTouched ? emailError : ""}
          className="mt-1.5"
        />

        {error && <p className="mb-4 mt-2 text-sm text-red-500">⊗ {error}</p>}

        <button
          type="submit"
          disabled={!email || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? "Sending..." : "Continue"}
        </button>
      </form>
    </>
  );
}
