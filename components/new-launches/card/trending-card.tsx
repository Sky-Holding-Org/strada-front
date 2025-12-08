"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { Compound } from "@/app/api/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/app/api/text";
import Image from "@/components/ui/NextImage";

interface CompoundCardProps extends HTMLMotionProps<"div"> {
  compound: Compound;
}

const TrinfingCard = React.forwardRef<HTMLDivElement, CompoundCardProps>(
  ({ compound, className, ...props }, ref) => {
    const images = React.useMemo(() => {
      const imgs = [];
      if (compound.imageGallery) imgs.push(...compound.imageGallery);
      return imgs.slice(0, 1);
    }, [compound]);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        <div className="relative aspect-4/3 w-full overflow-hidden">
          {images.length > 0 ? (
            <Image
              src={images[0].url || "/placeholder.svg"}
              alt={compound.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
            <p className="text-xs sm:text-sm font-medium mb-1 opacity-90">
              {compound.area?.name || "Unknown Area"} •
              {formatPrice(compound.startPrice)}
            </p>
            <h3 className="text-sm sm:text-base font-bold line-clamp-2">
              {compound.name}
            </h3>
          </div>
        </div>
      </motion.div>
    );
  }
);

TrinfingCard.displayName = "TrinfingCard";

export { TrinfingCard };
