export function FieldError({
  message,
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <XCircleIcon />
      <p className="text-xs text-red-500">{message}</p>
    </div>
  );
}

function XCircleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-red-500"
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
