import { FieldMessage } from "../../components/FieldMessage";

export type UsernameStatus = "idle" | "checking" | "available" | "taken";

export function UsernameStep({
  username,
  setUsername,
  usernameTouched,
  setUsernameTouched,
  usernameFormatError,
  usernameStatus,
  loading,
  onSubmit,
}: {
  username: string;
  setUsername: (v: string) => void;
  usernameTouched: boolean;
  setUsernameTouched: (v: boolean) => void;
  usernameFormatError: string;
  usernameStatus: UsernameStatus;
  loading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}) {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Create Your Account</h2>
      <p className="mb-6 text-gray-500">Choose a username for your page</p>

      <form onSubmit={onSubmit}>
        <label className="mb-1 block font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => setUsernameTouched(true)}
          placeholder="Enter username here"
          className={`w-full rounded-md border px-4 py-3 outline-none ${
            (usernameTouched && usernameFormatError) ||
            usernameStatus === "taken"
              ? "border-red-400"
              : "border-gray-300"
          }`}
        />
        <div className="mb-4 mt-1.5 min-h-[16px]">
          {usernameTouched && usernameFormatError ? (
            <FieldMessage message={usernameFormatError} />
          ) : usernameStatus === "taken" ? (
            <FieldMessage message="This username is already taken" />
          ) : usernameStatus === "available" ? (
            <FieldMessage type="success" message="Username available" />
          ) : usernameStatus === "checking" ? (
            <p className="text-xs text-gray-400">Checking…</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={usernameStatus !== "available" || loading}
          className="w-full rounded-md bg-gray-300 py-3 font-medium text-gray-700 disabled:opacity-60 enabled:bg-black enabled:text-white"
        >
          Continue
        </button>
      </form>
    </>
  );
}
