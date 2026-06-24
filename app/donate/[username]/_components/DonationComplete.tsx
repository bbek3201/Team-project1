import { Avatar } from "./Avatar";
import type { Creator } from "./types";

export function DonationComplete({
  creator,
  onClose,
}: {
  creator: Creator;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5l4 4 10-10"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold">Donation Complete !</h1>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Avatar
              src={creator.avatar}
              name={creator.name}
              size="h-7 w-7"
              textSize="text-[10px]"
            />
            <p className="text-sm font-semibold">{creator.name}:</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {creator.successMessage ||
              "Thank you for supporting me! It means a lot to have your support."}
          </p>
        </div>
      </div>
    </div>
  );
}
