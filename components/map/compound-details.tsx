"use client";

import Image from "@/components/ui/NextImage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/app/api/text";
import { ArrowLeft, MapPin, Home } from "lucide-react";

interface Property {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  startPrice: string; // Changed from price to startPrice
  propertyType: string;
  imageUrl: string | null;
  compoundSlug: string | null;
  compoundName: string | null;
  compoundDocumentId: string | null;
  developer?: string | null; // Added developer name
  developerSlug?: string | null; // Added developer slug for link
  bedrooms: number | null;
  bathrooms: number | null;
  squareMeters: number | null;
  deliveryIn: number | null;
  isResale: boolean;
}

interface CompoundDetailsProps {
  compound: {
    name: string;
    slug: string;
    imageUrl: string | null;
    developer: {
      name: string;
      logo: string | null;
    } | null;
    developerPrice: string;
    resalePrice: string | null;
  };
  properties: Property[];
  onBackClick: () => void;
  onPropertyClick: (property: Property) => void;
}

export function CompoundDetails({
  compound,
  properties,
  onBackClick,
  onPropertyClick,
}: CompoundDetailsProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Compound Header with Thumbnail */}
      <div className="relative">
        {compound.imageUrl ? (
          <div className="relative w-full h-52 -mx-5 -mt-5">
            <Image
              src={compound.imageUrl}
              alt={compound.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60" />

            {/* Back Button Overlay */}
            <button
              onClick={onBackClick}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-all flex items-center gap-2 text-sm font-medium z-10"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {/* Compound Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                    {compound.name}
                  </h2>
                  {compound.developer && (
                    <p className="text-sm opacity-90 drop-shadow">
                      by {compound.developer.name}
                    </p>
                  )}
                </div>
                {compound.developer?.logo && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white p-1.5 shadow-lg">
                    <div className="relative w-full h-full">
                      <Image
                        src={compound.developer.logo}
                        alt={compound.developer.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 pb-0">
            <button
              onClick={onBackClick}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Compounds
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {compound.name}
            </h2>
            {compound.developer && (
              <p className="text-sm text-gray-600">
                by {compound.developer.name}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex gap-3">
          {compound.developerPrice && (
            <div className="flex-1 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-600 mb-0.5 uppercase tracking-wide font-medium">
                Starting From
              </p>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(compound.developerPrice)}
              </p>
            </div>
          )}
          {compound.resalePrice && (
            <div className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 mb-0.5 uppercase tracking-wide font-medium">
                Resale
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(compound.resalePrice)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Properties List */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Home size={18} className="text-gray-600" />
            Available Units
          </h3>
          <Badge variant="secondary" className="font-semibold">
            {properties.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No properties available</p>
            </div>
          ) : (
            properties.map((property) => (
              <Card
                key={property.documentId}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group border-gray-200"
                onClick={() => onPropertyClick(property)}
              >
                <div className="flex gap-3 p-3">
                  {/* Circular Avatar Image */}
                  <div className="relative shrink-0">
                    {property.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all">
                        <Image
                          src={property.imageUrl}
                          alt={property.name || "Property"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-2 ring-gray-200">
                        <Home size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {property.name || property.propertyType}
                      </h4>
                      {property.isResale && (
                        <Badge
                          variant="secondary"
                          className="ml-2 text-xs shrink-0"
                        >
                          Resale
                        </Badge>
                      )}
                    </div>

                    {/* Developer Link */}
                    {property.developer && (
                      <a
                        href={
                          property.developerSlug
                            ? `/developers/${property.developerSlug}`
                            : "#"
                        }
                        className="text-xs text-gray-600 hover:text-blue-600 mb-1 inline-block transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        by {property.developer}
                      </a>
                    )}

                    <p className="text-blue-600 font-bold text-base mb-2">
                      {formatPrice(property.startPrice)}
                    </p>

                    {/* Property Details */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                          🛏️ {property.bedrooms} BD
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                          🚿 {property.bathrooms} BA
                        </span>
                      )}
                      {property.squareMeters && (
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                          📐 {property.squareMeters}m²
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Details Footer */}
                <div className="border-t border-gray-100 px-3 py-2 bg-gray-50/50">
                  <a
                    href={`/properties/${property.slug}`}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MapPin size={12} />
                    View Property Details
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
