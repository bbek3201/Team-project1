export function FieldMessage({
  message,
  type = "error",
  className = "",
}: {
  message?: string;
  type?: "error" | "success";
  className?: string;
}) {
  if (!message) return null;
  const color = type === "error" ? "text-red-500" : "text-green-600";
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {type === "error" ? (
        <XCircleIcon className={color} />
      ) : (
        <CheckCircleIcon className={color} />
      )}
      <p className={`text-xs ${color}`}>{message}</p>
    </div>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className ?? ""}`}
    >
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 7.5l5 5M12.5 7.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 ${className ?? ""}`}
    >
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
