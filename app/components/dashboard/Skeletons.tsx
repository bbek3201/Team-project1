import { Skeleton } from "../Skeleton";

export function ProfileEarningsSkeleton() {
  return (
    <section className="rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <hr className="my-5 border-gray-100" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-10 w-40" />
    </section>
  );
}

export function TransactionSkeleton() {
  return (
    <li className="rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </li>
  );
}
