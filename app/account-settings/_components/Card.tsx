import { Skeleton } from "../../components/Skeleton";

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white px-6 py-6">
      <h2 className="text-base font-bold">{title}</h2>
      {children}
    </section>
  );
}

export function CardSkeleton() {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white px-6 py-6">
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </section>
  );
}
