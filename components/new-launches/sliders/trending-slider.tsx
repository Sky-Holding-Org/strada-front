"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Compound } from "@/app/api/types";
import type { CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TrinfingCard } from "@/components/new-launches/card/trending-card";

interface TrendingSliderProps {
  compounds: Compound[];
  title?: string;
  description?: string;
  className?: string;
}

export function TrendingSlider({
  compounds,
  title = "Trending Projects",
  description = "Discover our latest trending projects",
  className,
}: TrendingSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (compounds.length === 0) return null;

  return (
    <section className={className}>
      <div className="mb-6 px-4 sm:px-6 lg:px-12">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {description}
          </p>
        )}
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {compounds.length} available
        </p>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-12">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {compounds.map((compound) => (
              <CarouselItem
                key={compound.documentId}
                className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/compounds/${compound.slug}`}>
                  <TrinfingCard compound={compound} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {current > 0 && (
          <button
            onClick={() => api?.scrollPrev()}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {current < count - 1 && (
          <button
            onClick={() => api?.scrollNext()}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "bg-primary w-8" : "bg-gray-300 w-2"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
