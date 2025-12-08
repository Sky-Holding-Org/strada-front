"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function RateLimitError({
  retryAfter = 60,
}: {
  retryAfter?: number;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-4xl font-bold">Too Many Requests</h1>
        <p className="text-muted-foreground text-lg">
          You've made too many requests. Please wait {retryAfter} seconds before
          trying again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.back()}>Go Back</Button>
          <Button
            variant="outline"
            onClick={() => router.refresh()}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
