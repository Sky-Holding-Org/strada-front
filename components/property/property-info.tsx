import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Property, Compound } from "@/app/api/types";

interface PropertyInfoProps {
  property: Property;
  compound: Compound | null;
}

export function PropertyInfo({ property, compound }: PropertyInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden max-w-3xl">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <h3 className="text-xl font-bold text-[#05596B]">
          {property.propertyType}
        </h3>
        <p className="text-xl font-bold text-[#05596B]">
          {property.squareMeters}m²
        </p>
      </div>

      <div className="divide-y">
        <div className="grid grid-cols-2 px-4 py-2.5">
          <p className="text-sm text-muted-foreground">Bedrooms</p>
          <p className="text-sm font-semibold">{property.bedrooms}</p>
        </div>

        <div className="grid grid-cols-2 px-4 py-2.5 bg-muted/20">
          <p className="text-sm text-muted-foreground">Bathrooms</p>
          <p className="text-sm font-semibold">{property.bathrooms}</p>
        </div>

        {property.deliveryIn && (
          <div className="grid grid-cols-2 px-4 py-2.5">
            <p className="text-sm text-muted-foreground">Delivery In</p>
            <p className="text-sm font-semibold">{property.deliveryIn}</p>
          </div>
        )}

        {property.compound && (
          <div className="grid grid-cols-2 px-4 py-2.5 bg-muted/20">
            <p className="text-sm text-muted-foreground">Compound</p>
            <Link
              href={`/compounds/${property.compound.slug}`}
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {property.compound.name}
            </Link>
          </div>
        )}
        {compound?.developer && (
          <div className="grid grid-cols-2 px-4 py-2.5 ">
            <p className="text-sm text-muted-foreground">Developer</p>
            <p className="text-sm font-semibold">{compound.developer.name}</p>
          </div>
        )}

        <div className="grid grid-cols-2 px-4 py-2.5 bg-muted/20">
          <p className="text-sm text-muted-foreground">Sale Type</p>
          <p className="text-sm font-semibold">
            {property.isResale ? "Resale" : "Developer Sale"}
          </p>
        </div>

        {property.finishing && (
          <div className="grid grid-cols-2 px-4 py-2.5">
            <p className="text-sm text-muted-foreground">Finishing</p>
            <p className="text-sm font-semibold">{property.finishing}</p>
          </div>
        )}
      </div>
    </div>
  );
}
