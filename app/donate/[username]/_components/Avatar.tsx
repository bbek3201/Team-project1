export function Avatar({
  src,
  name,
  size = "h-12 w-12",
  textSize = "text-sm",
}: {
  src: string;
  name: string;
  size?: string;
  textSize?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`${size} ${textSize} flex shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-500`}
    >
      {(name || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}
