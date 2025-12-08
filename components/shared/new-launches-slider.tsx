"use client";

import * as React from "react";
import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Compound } from "@/app/api/types";
import { formatPrice } from "@/app/api/text";

interface AreaNewLaunchesSliderProps {
  compounds: Compound[];
}

export function AreaNewLaunchesSlider({
  compounds,
}: AreaNewLaunchesSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, compounds.length - itemsPerView);

  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  if (compounds.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {compounds.map((compound) => (
            <Link
              key={compound.documentId}
              href={`/compounds/${compound.slug}`}
              className="min-w-[calc(33.333%-1rem)] shrink-0"
            >
              <div className="group relative aspect-4/3 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                {compound.imageGallery?.[0] ? (
                  <Image
                    src={compound.imageGallery[0].url}
                    alt={compound.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="33vw"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-cyan-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    New Launch
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-medium mb-2 opacity-90">
                    {compound.developer?.name || "Developer"}
                  </p>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {compound.name}
                  </h3>
                  <p className="text-lg font-semibold">
                    {formatPrice(compound.startPrice)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {compounds.length > itemsPerView && (
        <>
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}
