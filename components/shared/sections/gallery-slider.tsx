"use client";

import Image from "@/components/ui/NextImage";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageItem {
  url: string;
  alt?: string;
}

interface GallerySliderProps {
  images: ImageItem[];
}

export function GallerySlider({ images }: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images.length) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gray-200">
        <div className="relative w-full aspect-16/10 flex items-center justify-center">
          <span className="text-gray-500 text-lg">No images available</span>
        </div>
      </div>
    );
  }

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < images.length - 1;

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden ">
        <div className="relative w-full aspect-16/10">
          <Image
            src={images[currentIndex].url || "/placeholder.svg"}
            alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
            fill
            className="object-center rounded-2xl"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={!canScrollPrev}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-16 z-30 p-2 rounded-full",
                "bg-white/70 backdrop-blur-md border border-white/30 shadow-lg",
                "text-gray-900 hover:bg-white/90 transition-all duration-300",
                "disabled:opacity-0 disabled:cursor-not-allowed disabled:pointer-events-none",
                "hover:scale-110 active:scale-95"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              disabled={!canScrollNext}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-16 z-30 p-2 rounded-full",
                "bg-white/70 backdrop-blur-md border border-white/30 shadow-lg",
                "text-gray-900 hover:bg-white/90 transition-all duration-300",
                "disabled:opacity-0 disabled:cursor-not-allowed disabled:pointer-events-none",
                "hover:scale-110 active:scale-95"
              )}
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 md:grid-cols-6 gap-2 px-2 pb-2">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary shadow-md scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
