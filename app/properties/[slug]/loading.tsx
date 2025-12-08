import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyLoading() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Skeleton className="h-6 w-64 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-2xl" />
          </div>

          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-full mb-2" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
