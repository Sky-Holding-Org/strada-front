"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/app/api/types";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/NextImage";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/favorites-context";

interface RecommendedPropertyCardProps extends HTMLMotionProps<"div"> {
  propertyItem: Property;
}

export const RecommendedPropertyCard = React.forwardRef<
  HTMLDivElement,
  RecommendedPropertyCardProps
>(({ propertyItem, className, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const images = React.useMemo(() => {
    const imgs = [];
    if (propertyItem.imageGallery) imgs.push(...propertyItem.imageGallery);
    return imgs.slice(0, 5); // Max 5 images
  }, [propertyItem]);

  const totalImages = images.length;

  const handleImageChange = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextIndex = (activeIndex + 1) % totalImages;
    handleImageChange(nextIndex);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    const prevIndex = (activeIndex - 1 + totalImages) % totalImages;
    handleImageChange(prevIndex);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "w-full space-y-3 rounded-xl bg-white shadow-md overflow-hidden max-w-96 hover:shadow-xl transition-shadow mb-2",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      <div className="relative aspect-video w-full overflow-hidden">
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
                alt={`${propertyItem.name} – image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy" // Only first image gets LCP boost
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

        {totalImages > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 z-20 size-8 -translate-y-1/2 rounded-full bg-black/40 text-white shadow-md hover:bg-black/60"
              onClick={handlePrevious}
              disabled={isTransitioning}
            >
              <ChevronLeft size={16} />
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 z-20 size-8 -translate-y-1/2 rounded-full bg-black/40 text-white shadow-md hover:bg-black/60"
              onClick={handleNext}
              disabled={isTransitioning}
            >
              <ChevronRight size={16} />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(propertyItem.documentId);
          }}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            size={18}
            className={cn(
              "transition-colors",
              isFavorite(propertyItem.documentId)
                ? "fill-red-500 text-red-500"
                : "text-gray-700"
            )}
          />
        </button>

        <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1">
          {propertyItem.isRecommended && (
            <Badge className="bg-cyan-100/90 text-cyan-800 text-xs">
              Recommended
            </Badge>
          )}
          {propertyItem.isResale && (
            <Badge className="bg-orange-100/90 text-orange-800 text-xs">
              Resale
            </Badge>
          )}
        </div>

        {propertyItem.deliveryIn && (
          <div className="absolute bottom-2 right-2 z-20">
            <Badge className="bg-white/90 text-gray-800 text-xs font-semibold">
              {propertyItem.deliveryIn}
            </Badge>
          </div>
        )}
      </div>
      <Link href={`/properties/${propertyItem.slug}`}>
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            {propertyItem.compound && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {propertyItem.compound.name}
              </p>
            )}
            <Badge variant="outline" className="text-xs">
              {propertyItem.propertyType}
            </Badge>
            <h3 className="font-semibold text-sm line-clamp-2 min-h-10">
              {propertyItem.name}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed size={14} />
              <span>{propertyItem.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{propertyItem.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize size={14} />
              <span>{propertyItem.squareMeters} m²</span>
            </div>
          </div>

          {propertyItem.originalPlan && (
            <div className="pt-2 border-t space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  Monthly
                </span>
                <span className="font-semibold">
                  {formatPrice(propertyItem.originalPlan.monthly_payment)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">
                  {propertyItem.originalPlan.duration_years} years
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-lg font-bold text-primary">
              {formatPrice(propertyItem.startPrice)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

RecommendedPropertyCard.displayName = "RecommendedPropertyCard";
