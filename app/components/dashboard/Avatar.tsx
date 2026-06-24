import { initials } from "@/lib/format";

export function Avatar({
  src,
  name,
  size = 40,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500"
    >
      {initials(name)}
    </div>
  );
}
