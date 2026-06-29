import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../components/ui/input-otp";
import { Spinner } from "../../components/Spinner";

export function OtpStep({
  email,
  code,
  setCode,
  error,
  notice,
  loading,
  resending,
  onSubmit,
  onResend,
}: {
  email: string;
  code: string;
  setCode: (v: string) => void;
  error: string;
  notice: string;
  loading: boolean;
  resending: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onResend: () => void;
}) {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Enter code</h2>
      <p className="mb-6 text-gray-500">
        We sent a 6-digit code to <span className="font-medium">{email}</span>.
      </p>

      <form onSubmit={onSubmit}>
        <div className="mb-2 flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="mb-2 mt-2 text-center text-sm text-red-500">⊗ {error}</p>
        )}
        {!error && notice && (
          <p className="mb-2 mt-2 text-center text-sm text-green-600">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={code.length !== 6 || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-black py-3 font-medium text-white disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? "Verifying..." : "Continue"}
        </button>
      </form>

      <button
        type="button"
        onClick={onResend}
        disabled={resending}
        className="mt-4 w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-60"
      >
        {resending ? "Resending..." : "Resend code"}
      </button>
    </>
  );
}
