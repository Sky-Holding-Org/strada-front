"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Area } from "@/app/api/types";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/NextImage";

interface AreaCardProps extends HTMLMotionProps<"div"> {
  area: Area;
  className?: string;
}

const RecommendedAreaCard = React.forwardRef<HTMLDivElement, AreaCardProps>(
  ({ area, className, ...props }, ref) => {
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
            {area.banner ? (
              <Image
                src={area.banner.url || "/placeholder.svg"}
                alt={area.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                draggable={false}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
                style={{
                  objectPosition: "center",
                }}
              />
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

          {/* Recommended badge at top-left if applicable */}
          {area.isRecommended && (
            <div className="absolute top-1.5 left-1.5 z-20">
              <Badge
                variant="secondary"
                className="bg-cyan-100/90 text-cyan-800 font-medium text-[9px] xs:text-[10px] px-1 py-0.5"
              >
                Recommended
              </Badge>
            </div>
          )}

          {/* Bottom overlay with name and number of compounds */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
            <div className="flex flex-wrap items-center gap-0.5">
              <Badge
                variant="secondary"
                className="bg-white/90 text-gray-800 font-medium text-[9px] xs:text-[10px] px-1 py-0.5"
              >
                {area.compounds?.length || 0} Compounds
              </Badge>
            </div>
            <h2 className="text-xs xs:text-sm sm:text-base font-bold text-white drop-shadow-md line-clamp-2">
              {area.name}
            </h2>
          </div>
        </div>
      </motion.div>
    );
  }
);

RecommendedAreaCard.displayName = "RecommendedAreaCard";

export { RecommendedAreaCard };
