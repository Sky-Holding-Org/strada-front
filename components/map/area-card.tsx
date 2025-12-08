"use client";

import Image from "@/components/ui/NextImage";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AreaCardProps {
  name: string;
  slug: string;
  imageUrl: string | null;
  compoundCount: number;
  onClick: () => void;
  className?: string;
}

export function AreaCard({
  name,
  slug,
  imageUrl,
  compoundCount,
  onClick,
  className,
}: AreaCardProps) {
  return (
    <Card
      className={cn(
        "p-3 hover:bg-gray-50 border border-gray-200 rounded-lg",
        "transition-all duration-200 hover:shadow-md cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex gap-3 items-center">
        {/* Circular Image Thumbnail */}
        <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
              📍
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1 mb-0.5">
            {name}
          </h3>
          <p className="text-xs text-gray-500">
            {compoundCount} {compoundCount === 1 ? "compound" : "compounds"}
          </p>
        </div>

        {/* Arrow Indicator */}
        <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
}
