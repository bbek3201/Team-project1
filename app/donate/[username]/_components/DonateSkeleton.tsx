import Navbar from "../../../components/Navbar";
import { Skeleton } from "../../../components/Skeleton";

export function DonateSkeleton() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Cover band skeleton */}
      <Skeleton className="h-80 w-full rounded-none" />

      {/* Two columns skeleton */}
      <div className="relative z-10 mx-auto -mt-16 max-w-304 px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            {/* Profile + about */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
              <hr className="my-4 border-gray-200" />
              <Skeleton className="mb-3 h-4 w-28" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            {/* Social media URL */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <Skeleton className="mb-3 h-4 w-32" />
              <Skeleton className="h-3 w-1/2" />
            </div>

            {/* Recent supporters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <Skeleton className="mb-4 h-4 w-36" />
              <div className="flex flex-col gap-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-3 w-40" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: donation form */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Skeleton className="mb-5 h-6 w-48" />
            <Skeleton className="mb-2 h-4 w-28" />
            <div className="mb-5 flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-11 flex-1" />
              ))}
            </div>
            <Skeleton className="mb-2 h-4 w-64" />
            <Skeleton className="mb-4 h-11 w-full" />
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="mb-4 h-28 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
