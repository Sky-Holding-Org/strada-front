"use client";

import Image from "@/components/ui/NextImage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/app/api/text";
import { cn } from "@/lib/utils";

interface CompoundCardProps {
  name: string;
  slug: string;
  imageUrl: string | null;
  price: string;
  developer: string | null;
  location: string | null;
  isNew: boolean;
  isTrending: boolean;
  onClick: () => void;
  className?: string;
}

export function CompoundCard({
  name,
  slug,
  imageUrl,
  price,
  developer,
  location,
  isNew,
  isTrending,
  onClick,
  className,
}: CompoundCardProps) {
  return (
    <Card
      className={cn(
        "p-3 border border-gray-200 rounded-lg",
        "transition-all duration-200 hover:shadow-md group",
        className
      )}
    >
      <div className="flex gap-3" onClick={onClick}>
        {/* Circular Image Thumbnail */}
        <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-gray-100 cursor-pointer">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
              🏢
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 cursor-pointer">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
            {name}
          </h3>
          
          {location && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <span className="text-blue-600">📍</span>
              {location}
            </p>
          )}
          
          <p className="text-sm font-bold text-gray-900 mb-1">
            {formatPrice(price)}
          </p>

          {developer && (
            <p className="text-xs text-gray-400 line-clamp-1 mb-1">
              {developer}
            </p>
          )}
          
          <div className="flex gap-1.5 flex-wrap">
            {isNew && (
              <Badge
                variant="secondary"
                className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium border-0"
              >
                New
              </Badge>
            )}
            {isTrending && (
              <Badge
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium border-0"
              >
                🔥 Hot
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/compounds/${slug}`;
        }}
        className="w-full mt-3 px-3 py-2 bg-[#2D3748] hover:bg-[#1a202c] text-white text-xs font-semibold rounded-lg transition-colors"
      >
        View Compound Details
      </button>
    </Card>
  );
}
