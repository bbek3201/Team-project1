import { FieldMessage } from "../../components/FieldMessage";
import { Spinner } from "../../components/Spinner";

export function AccountStep({
  username,
  email,
  setEmail,
  emailTouched,
  setEmailTouched,
  emailError,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
}: {
  username: string;
  email: string;
  setEmail: (v: string) => void;
  emailTouched: boolean;
  setEmailTouched: (v: boolean) => void;
  emailError: string;
  password: string;
  setPassword: (v: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}) {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Welcome, {username}</h2>
      <p className="mb-6 text-gray-500">Connect email and set a password</p>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
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
        </div>

        <label className="mb-1 block font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password here"
          className="mb-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
        />
        {error && <p className="mb-4 text-sm text-red-500">⊗ {error}</p>}

        <button
          type="submit"
          disabled={!email || !password || loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-300 py-3 font-medium text-gray-700 disabled:opacity-60 enabled:bg-black enabled:text-white"
        >
          {loading && <Spinner />}
          {loading ? "Creating..." : "Continue"}
        </button>
      </form>
    </>
  );
}
