"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import type { Compound } from "@/app/api/types";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/NextImage";

interface CompoundCardProps extends HTMLMotionProps<"div"> {
  compound: Compound;
  showDeveloper?: boolean;
  showThumbnailNavigator?: boolean;
}

const TrinfingCard = React.forwardRef<HTMLDivElement, CompoundCardProps>(
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

    const images = React.useMemo(() => {
      const imgs = [];
      if (compound.imageGallery) imgs.push(...compound.imageGallery);
      return showThumbnailNavigator ? imgs.slice(0, 5) : imgs.slice(0, 1);
    }, [compound, showThumbnailNavigator]);

    return (
      <motion.div
        ref={ref}
        className={cn("w-full space-y-2  p-3 md:p-4  max-w-96", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <div className="relative h-full w-full overflow-hidden rounded-xl">
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

          <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1  content-between h-44">
            <Badge className="bg-cyan-100 text-cyan-800 font-semibold">
              Trending
            </Badge>
            {compound.area && (
              <div className="flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                <MapPin size={12} />
                <span>{compound.area.name}</span>
              </div>
            )}
            <h2 className="text-sm md:text-base font-bold p-1 drop-shadow-md text-white/85">
              {compound.name}
            </h2>
          </div>
        </div>
      </motion.div>
    );
  }
);

TrinfingCard.displayName = "TrinfingCard";

export { TrinfingCard };
