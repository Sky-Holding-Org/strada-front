"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "@/components/ui/NextImage";
import { Bed, Bath, Maximize, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/app/api/types";
import { FaWhatsapp } from "react-icons/fa6";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
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

        <div className="absolute bottom-2 left-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-green-400 hover:bg-green-700"
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
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            {property.compound && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {property.compound.name}
              </p>
            )}
            <Badge className="bg-white/60 text-[#05596B] text-xs">
              {property.propertyType}
            </Badge>
            <h3 className="font-semibold text-sm line-clamp-2 min-h-10">
              {property.name}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed size={14} />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize size={14} />
              <span>{property.squareMeters} m²</span>
            </div>
          </div>

          {property.originalPlan && (
            <div className="pt-2 border-t space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  Monthly
                </span>
                <span className="font-semibold">
                  {formatPrice(property.originalPlan.monthly_payment)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">
                  {property.originalPlan.duration_years} years
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-lg font-bold text-primary">
              {formatPrice(property.startPrice)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
