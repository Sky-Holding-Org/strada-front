"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Compound } from "@/app/api/types";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/NextImage";
import { useFavorites } from "@/contexts/favorites-context";

interface CompoundCardProps extends HTMLMotionProps<"div"> {
  compound: Compound;
  showDeveloper?: boolean;
  showThumbnailNavigator?: boolean;
}

const RecommendedCompound = React.forwardRef<HTMLDivElement, CompoundCardProps>(
  (
    {
      compound,
      showDeveloper = true,
      showThumbnailNavigator = true,
      className,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const { toggleFavorite, isFavorite } = useFavorites();

    const images = React.useMemo(() => {
      const imgs = [];
      if (compound.imageGallery) imgs.push(...compound.imageGallery);
      return showThumbnailNavigator ? imgs.slice(0, 5) : imgs.slice(0, 1);
    }, [compound, showThumbnailNavigator]);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-64 overflow-hidden rounded-lg bg-white shadow-md",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        <div className="relative aspect-square w-full">
          <div className="relative h-full w-full overflow-hidden">
            {images.length > 0 ? (
              images.map((img, index) => (
                <div
                  key={img.url}
                  className={cn(
                    "absolute inset-0 h-full w-full transition-all duration-500 ease-out",
                    activeIndex === index
                      ? "opacity-100 transform-none z-10"
                      : "opacity-0 scale-95 z-0"
                  )}
                  style={{
                    transform:
                      activeIndex === index
                        ? "none"
                        : index < activeIndex
                        ? "translateX(-100%)"
                        : "translateX(100%)",
                  }}
                >
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={`${compound.name} – image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                    draggable={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                    style={{
                      objectPosition: index === 0 ? "top" : "center",
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, transparent 70%)",
              }}
            />
          </div>

          {/* Recommended badge at top-left */}
          <div className="absolute top-1.5 left-1.5 z-20">
            <Badge
              variant="secondary"
              className="bg-cyan-100/90 text-cyan-800 font-medium text-[9px] xs:text-[10px] px-1 py-0.5"
            >
              Recommended
            </Badge>
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(compound.documentId);
            }}
            className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                isFavorite(compound.documentId)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              )}
            />
          </button>

          {/* Bottom overlay with other info */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
            <div className="flex flex-wrap items-center gap-0.5">
              {compound.area && (
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-800 font-medium text-[9px] xs:text-[10px] px-1 py-0.5 flex items-center gap-0.5"
                >
                  <MapPin size={9} className="shrink-0" />
                  <span>{compound.area.name}</span>
                </Badge>
              )}
              {compound.developer && (
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-800 font-medium text-[9px] xs:text-[10px] px-1 py-0.5"
                >
                  By {compound.developer.name}
                </Badge>
              )}
            </div>
            <h2 className="text-xs font-bold text-white drop-shadow-md line-clamp-3">
              {compound.name}
            </h2>
          </div>

          {/* Thumbnail navigator (if enabled), overlaid at bottom to keep card square */}
          {showThumbnailNavigator && images.length > 1 && (
            <div className="absolute bottom-10 xs:bottom-11 sm:bottom-12 left-0 right-0 z-20 flex justify-center gap-0.5 px-1.5 pointer-events-auto">
              {images.map((img, index) => (
                <button
                  key={img.url}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative w-6 h-6 xs:w-7 xs:h-7 overflow-hidden rounded-sm border transition-all",
                    activeIndex === index
                      ? "border-cyan-500"
                      : "border-white/50"
                  )}
                >
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="28px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

RecommendedCompound.displayName = "RecommendedCompound";

export { RecommendedCompound };
