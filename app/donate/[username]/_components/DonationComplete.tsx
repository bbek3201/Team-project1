import Navbar from "../../../components/Navbar";
import { Avatar } from "./Avatar";
import type { Creator } from "./types";

export function DonationComplete({
  creator,
  onReturn,
}: {
  creator: Creator;
  onReturn: () => void;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mb-6 text-xl font-bold">Donation Complete !</h1>
        <div className="w-full max-w-md rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2">
            <Avatar
              src={creator.avatar}
              name={creator.name}
              size="h-7 w-7"
              textSize="text-[10px]"
            />
            <p className="text-sm font-semibold">{creator.name}:</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {creator.successMessage ||
              "Thank you for supporting me! It means a lot to have your support."}
          </p>
        </div>
        <button
          onClick={onReturn}
          className="mt-6 rounded-lg bg-[#18181b] px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          Return to explore
        </button>
      </div>
    </div>
  );
}
