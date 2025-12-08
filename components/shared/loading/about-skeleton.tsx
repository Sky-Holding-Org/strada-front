import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
  return (
    <section className="bg-linear-to-br from-gray-50 to-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center space-y-3 sm:space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-64 w-full rounded-xl" />

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>

          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
