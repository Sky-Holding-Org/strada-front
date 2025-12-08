"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/NextImage";
import {
  Bed,
  Bath,
  Maximize,
  Heart,
  Share2,
  Check,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/app/api/types";
import { useFavorites } from "@/contexts/favorites-context";
import { FaWhatsapp } from "react-icons/fa6";

interface SearchPropertyCardProps {
  property: Property;
}

export function SearchPropertyCard({ property }: SearchPropertyCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (!numPrice || numPrice === 0) return "-";
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/properties/${property.slug}`;
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const mainImage = property.imageGallery?.[0]?.url || "/placeholder.svg";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={mainImage}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />

        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {property.isRecommended && (
            <Badge className="bg-white/60 text-[#05596B]">Recommended</Badge>
          )}
          {property.isResale && (
            <Badge className="bg-white/60 text-[#05596B]">Resale</Badge>
          )}
        </div>

        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/60 hover:bg-white"
            onClick={() => toggleFavorite(property.documentId)}
          >
            <Heart
              color="black"
              className={`h-4 w-4 ${
                isFavorite(property.documentId)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/60 hover:bg-white"
            onClick={handleShare}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Share2 className="h-4 w-4" color="black" />
            )}
          </Button>
        </div>

        <div className="absolute bottom-2 left-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-[#25D366] hover:bg-[#20BA5A]"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                `https://wa.me/201123960001?text=I'm interested in ${property.name}`,
                "_blank"
              );
            }}
          >
            <FaWhatsapp className="size-4 text-white" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-[#05596B] hover:bg-[#028180]"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "tel:+201123960001";
            }}
          >
            <Phone className="h-5 w-5 text-white" />
          </Button>
        </div>

        {property.deliveryIn && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-white/60 text-[#05596B]">
              {property.deliveryIn}
            </Badge>
          </div>
        )}
      </div>

      <Link href={`/properties/${property.slug}`}>
        <div className="p-3 space-y-2">
          <div className="space-y-1">
            {property.compound && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
                  {property.compound.name}
                </p>
                {property.compound.area && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    <span>{property.compound.area.name}</span>
                  </div>
                )}
              </div>
            )}
            <Badge className="bg-gray-100 text-[#05596B] text-xs">
              {property.propertyType}
            </Badge>
            <h3 className="font-semibold text-sm line-clamp-2">
              {property.name}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bed size={14} />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bath size={14} />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Maximize size={14} />
              <span>{property.squareMeters} m²</span>
            </div>
            <div className="text-muted-foreground">
              <span className="font-medium">Finishing:</span>{" "}
              {property.finishing || "N/A"}
            </div>
            <div className="text-muted-foreground">
              <span className="font-medium">Delivery:</span>{" "}
              {property.deliveryIn || "N/A"}
            </div>
            <div className="text-muted-foreground">
              <span className="font-medium">
                {property.isResale ? "Resale" : "Developer Sale"}
              </span>
            </div>
          </div>

          {property.originalPlan && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Monthly</span>
                <span className="font-semibold">
                  {formatPrice(property.originalPlan.monthly_payment)}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-base font-bold text-primary">
              {formatPrice(property.startPrice)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
