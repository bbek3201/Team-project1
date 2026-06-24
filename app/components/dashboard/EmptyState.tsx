import { HeartIcon } from "./Icons";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <HeartIcon />
      </div>
      <p className="font-bold">You don&apos;t have any supporters yet</p>
      <p className="mt-1 text-sm text-gray-500">
        Share your page with your audience to get started.
      </p>
    </div>
  );
}
