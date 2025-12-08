"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DrawerSkeleton() {
  return (
    <div className="p-5 space-y-4">
      {/* Header Skeleton */}
      <Skeleton className="h-6 w-40" />

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-3">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-14 h-14 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-5 h-5" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
