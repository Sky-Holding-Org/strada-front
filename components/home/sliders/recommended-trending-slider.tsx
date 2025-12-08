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
import { TrinfingCard } from "@/components/home/card/recommended-trending-card";
import Link from "next/link";

interface TrendingSliderProps {
  compounds: Compound[];
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact";
  showAllLink?: string;
}

export function TrendingSlider({
  compounds,
  title = "Trending Projects",
  description = "Discover our latest trending projects",
  className,
  variant = "default",
  showAllLink,
}: TrendingSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const displayedCompounds = compounds;
  const isCompact = variant === "compact";

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (displayedCompounds.length === 0) return null;

  const canScrollPrev = current > 0;
  const canScrollNext = current < count - 1;

  return (
    <section className={className}>
      <div className="mb-3 sm:mb-4 md:mb-6 px-4 sm:px-6 md:px-8 lg:px-12 flex justify-between items-start">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#05596B] font-bold">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              {description}
            </p>
          )}
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {displayedCompounds.length} available
          </p>
        </div>
        {showAllLink && (
          <Link
            href={showAllLink}
            className="flex items-center gap-1 sm:gap-2 text-primary hover:text-primary/80 text-xs sm:text-sm md:text-base font-medium pr-4 sm:pr-6 md:pr-8 lg:pr-12 transition-colors duration-300 group"
          >
            <span className="hidden sm:inline">Show All</span>
            <span className="sm:hidden">All</span>
            <ChevronRight
              size={16}
              className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        )}
      </div>

      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full px-4 sm:px-6 md:px-8 lg:px-7"
        >
          <CarouselContent className="gap-2 sm:gap-3 md:gap-4">
            {displayedCompounds.map((compound) => (
              <CarouselItem
                key={compound.documentId}
                className={cn(
                  isCompact
                    ? "basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/3"
                    : "basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
                )}
              >
                <Link href={`/compounds/${compound.slug}`}>
                  <TrinfingCard
                    compound={compound}
                    showThumbnailNavigator={!isCompact}
                    showDeveloper={!isCompact}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <button
          onClick={() => api?.scrollPrev()}
          disabled={!canScrollPrev}
          className={cn(
            "absolute -left-2 sm:-left-3 md:-left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full",
            "bg-white/70 backdrop-blur-md border border-white/30 shadow-lg",
            "text-gray-900 hover:bg-white/90 transition-all duration-300",
            "disabled:opacity-0 disabled:cursor-not-allowed disabled:pointer-events-none",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={() => api?.scrollNext()}
          disabled={!canScrollNext}
          className={cn(
            "absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full",
            "bg-white/70 backdrop-blur-md border border-white/30 shadow-lg",
            "text-gray-900 hover:bg-white/90 transition-all duration-300",
            "disabled:opacity-0 disabled:cursor-not-allowed disabled:pointer-events-none",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 mt-3 sm:mt-4 md:mt-5 lg:mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-1 w-1 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2 rounded-full transition-all duration-300",
                index === current
                  ? "bg-primary w-4 sm:w-6 md:w-8"
                  : "bg-gray-300"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
