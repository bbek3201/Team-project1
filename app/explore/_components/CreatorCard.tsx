import Link from "next/link";

export type Creator = {
  username: string;
  name: string;
  avatar: string;
  about: string;
  socialMediaURL: string;
};

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {creator.avatar ? (
            <img
              src={creator.avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
              {creator.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <p className="text-xl font-semibold tracking-tight">{creator.name}</p>
        </div>
        <Link
          href={`/donate/${creator.username}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-gray-200"
        >
          View profile <ExternalIcon />
        </Link>
      </div>

      <div className="flex items-start gap-5">
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-base font-semibold">About {creator.name}</p>
          <p className="line-clamp-4 text-sm text-zinc-700">{creator.about}</p>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-base font-semibold">Social media URL</p>
          <p className="break-all text-sm text-zinc-700">
            {creator.socialMediaURL}
          </p>
        </div>
      </div>
    </section>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-3M12 4h4v4M16 4l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
