import { Skeleton } from "@/components/ui/skeleton";

export function LaunchesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-full overflow-hidden rounded-xl bg-white shadow-lg"
          >
            <Skeleton className="aspect-4/3 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
