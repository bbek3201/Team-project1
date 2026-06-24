import { Skeleton } from "../../components/Skeleton";

export function CreatorCardSkeleton() {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <div className="flex items-start gap-5">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </section>
  );
}
