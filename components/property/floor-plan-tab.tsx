"use client";

import { useState } from "react";
import Image from "@/components/ui/NextImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloorPlanTabProps {
  images: Array<{ url: string }>;
}

export function FloorPlanTab({ images }: FloorPlanTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <Image
          src={images[currentIndex].url}
          alt={`Floor Plan ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full",
              "bg-white/90 backdrop-blur-md border shadow-lg",
              "hover:bg-white transition-all hover:scale-110"
            )}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full",
              "bg-white/90 backdrop-blur-md border shadow-lg",
              "hover:bg-white transition-all hover:scale-110"
            )}
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
