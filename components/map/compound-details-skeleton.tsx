"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CompoundDetailsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Image Skeleton */}
      <Skeleton className="w-full h-48 -mx-5 -mt-5 mb-4 rounded-none" />

      {/* Compound Info Skeleton */}
      <div className="px-5 pb-4 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="w-12 h-12 rounded" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-40" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>

      {/* Properties List Skeleton */}
      <div className="flex-1 overflow-y-auto px-5">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-3">
                <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
