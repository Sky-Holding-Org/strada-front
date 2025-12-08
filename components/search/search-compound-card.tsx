"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { Phone, Heart, Share2, Check, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Compound } from "@/app/api/types";
import { useFavorites } from "@/contexts/favorites-context";
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (!numPrice || numPrice === 0) return "-";
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
  }).format(numPrice);
};
import { FaWhatsapp } from "react-icons/fa6";

interface SearchCompoundCardProps {
  compound: Compound;
}

export function SearchCompoundCard({ compound }: SearchCompoundCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleShare = async () => {
    const url = `${window.location.origin}/compounds/${compound.slug}`;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative">
        <Link href={`/compounds/${compound.slug}`}>
          <div className="relative aspect-4/3 overflow-hidden">
            {compound.imageGallery?.[0] ? (
              <Image
                src={compound.imageGallery[0].url}
                alt={compound.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
        </Link>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(compound.documentId);
            }}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite(compound.documentId)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleShare();
            }}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Share2 className="w-4 h-4 text-gray-700" />
            )}
          </button>
        </div>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1 w-1/2">
          {compound.isNewLaunch && (
            <Badge className="bg-white/60 text-[#05596B] text-xs">
              New Launch
            </Badge>
          )}
          {compound.isTrendingProject && (
            <Badge className="bg-white/60 text-[#05596B] text-xs">
              Trending
            </Badge>
          )}
          {compound.isRecommended && (
            <Badge className="bg-white/60 text-[#05596B] text-xs">
              Recommended
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/compounds/${compound.slug}`} className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {compound.developer?.logo && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
                <Image
                  src={compound.developer.logo.url}
                  alt={compound.developer.name}
                  fill
                  className="object-contain p-1.5"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {compound.developer?.name || "Developer"}
              </p>
              {compound.area && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  <span className="truncate">{compound.area.name}</span>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-base font-bold line-clamp-2 mb-2">
            {compound.name}
          </h3>

          {compound.properties && compound.properties.length > 0 && (
            <p className="text-xs text-muted-foreground mb-2">
              {compound.properties.length}{" "}
              {compound.properties.length === 1 ? "Property" : "Properties"}{" "}
              Available
            </p>
          )}

          {compound.properties && compound.properties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {Array.from(
                new Set(
                  compound.properties.map(
                    (p: { propertyType: string }) => p.propertyType
                  )
                )
              )
                .slice(0, 3)
                .map((type, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-semibold"
                  >
                    {type as string}
                  </span>
                ))}
              {(() => {
                const totalTypes = Array.from(
                  new Set(
                    compound.properties.map(
                      (p: { propertyType: string }) => p.propertyType
                    )
                  )
                ).length;
                return totalTypes > 3 ? (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-semibold">
                    +{totalTypes - 3}
                  </span>
                ) : null;
              })()}
            </div>
          )}

          {compound.Offers && compound.Offers.length > 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              {compound.Offers[0].paymentPercentage}% down payment •{" "}
              {compound.Offers[0].paymentDuration} years
            </div>
          )}

          {compound.amenities && compound.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {compound.amenities
                .slice(0, 3)
                .map((amenity: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
              {compound.amenities.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  +{compound.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </Link>

        <div className="flex items-center justify-between mt-auto pt-3 border-t">
          <p className="text-lg font-bold text-primary">
            {formatPrice(compound.startPrice)}
          </p>
          <div className="flex gap-1.5">
            <a
              href="tel:+201123960001"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E9E8E9] hover:bg-[#E9E8E9]/60 text-[#05596B]"
            >
              <Phone className="size-4" />
            </a>
            <a
              href={`https://wa.me/201123960001?text=${encodeURIComponent(
                `Hi, I'm interested in ${compound.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-green-400 hover:bg-green-700"
            >
              <FaWhatsapp className="size-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
