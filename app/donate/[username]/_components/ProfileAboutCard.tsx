import { Avatar } from "./Avatar";
import type { Creator } from "./types";

export function ProfileAboutCard({
  creator,
  isOwner,
  onEdit,
}: {
  creator: Creator;
  isOwner: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={creator.avatar} name={creator.name} />
          <p className="text-xl font-bold">{creator.name}</p>
        </div>
        {isOwner && (
          <button
            onClick={onEdit}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            Edit page
          </button>
        )}
      </div>
      <hr className="my-4 border-gray-200" />
      <h2 className="mb-2 font-semibold">About {creator.name}</h2>
      <p className="text-sm leading-relaxed text-gray-600">
        {creator.about || "No description yet."}
      </p>
    </div>
  );
}

export function SocialCard({ creator }: { creator: Creator }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 font-semibold">Social media URL</h2>
      {creator.socialMediaURL ? (
        <a
          href={creator.socialMediaURL}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-gray-700 underline-offset-2 hover:underline"
        >
          {creator.socialMediaURL}
        </a>
      ) : (
        <p className="text-sm text-gray-400">No social link yet.</p>
      )}
    </div>
  );
}
