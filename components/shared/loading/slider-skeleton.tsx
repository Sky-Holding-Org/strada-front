import { Skeleton } from "@/components/ui/skeleton";

export function SliderSkeleton() {
  return (
    <section className="py-8">
      <div className="mb-4 pl-4 md:pl-12">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3 w-32 mt-1" />
      </div>
      <div className="flex gap-4 pl-4 md:pl-12 pr-4 md:pr-12 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shrink-0 w-full sm:w-1/3 lg:w-1/4">
            <Skeleton className="aspect-square w-full rounded-xl mb-2" />
          </div>
        ))}
      </div>
    </section>
  );
}
