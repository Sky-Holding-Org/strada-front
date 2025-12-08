import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  fetchPropertyBySlug,
  fetchPropertiesByCompoundSlug,
  fetchCompoundBySlug,
} from "@/app/api/fetchers";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { GallerySlider } from "@/components/shared/sections/gallery-slider";
import { ContactButtons } from "@/components/shared/contact-buttons";
import { PropertyDetailsTabs } from "@/components/property/property-details-tabs";
import { PropertyPaymentPlan } from "@/components/property/property-payment-plan";
import { PaymentPlans } from "@/components/compound/payment-plans";
import { AmenitiesSection } from "@/components/shared/sections/amenities-sec";
import { AboutSec } from "@/components/shared/sections/about-sec";
import { RelatedProperties } from "@/components/property/related-properties";
import { PropertyInfo } from "@/components/property/property-info";
import { PropertySkeleton } from "@/components/property/property-skeleton";
import { Badge } from "@/components/ui/badge";
import type { Image } from "@/app/api/types";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateBreadcrumbSchema,
  generatePropertySchema,
} from "@/lib/structured-data";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);
  if (!property) return {};

  const compound = property.compound?.slug
    ? await fetchCompoundBySlug(property.compound.slug)
    : null;

  const image = property.imageGallery?.[0]?.url;
  return generatePageMetadata({
    title: `${property.name} - ${property.propertyType} in ${
      compound?.name || "Egypt"
    }`,
    description: `${property.propertyType} for sale in ${
      compound?.name || "Egypt"
    }. ${property.bedrooms || ""} bedrooms, ${
      property.bathrooms || ""
    } bathrooms, ${property.builtUpArea || ""} sqm. Starting from ${
      property.startPrice
    } EGP.`,
    keywords: [
      property.name,
      property.propertyType,
      compound?.name || "",
      compound?.area?.name || "",
      "property for sale Egypt",
    ],
    path: `/properties/${slug}`,
    images: image
      ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: property.name,
          },
        ]
      : undefined,
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const compound = property.compound?.slug
    ? await fetchCompoundBySlug(property.compound.slug)
    : null;

  const relatedProperties = property.compound?.slug
    ? await fetchPropertiesByCompoundSlug(property.compound.slug)
    : [];

  const filteredRelated = relatedProperties.filter(
    (p) => p.documentId !== property.documentId
  );

  const breadcrumbPaths = [
    {
      title: compound?.area?.name || "Areas",
      href: compound?.area?.slug ? `/areas/${compound.area.slug}` : "/areas",
    },
    {
      title: compound?.name || "Compounds",
      href: compound?.slug ? `/compounds/${compound.slug}` : "/compounds",
    },
    {
      title: property.name,
    },
  ];

  const images =
    property.imageGallery?.map((img: Image) => ({
      url: img.url,
      alt: property.name,
    })) || [];

  const masterPlanUrl = Array.isArray(property.masterPlanImage)
    ? property.masterPlanImage[0]?.url
    : property.masterPlanImage?.url;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.strada-properties.com" },
    {
      name: compound?.area?.name || "Areas",
      url: compound?.area?.slug
        ? `https://www.strada-properties.com/areas/${compound.area.slug}`
        : "https://www.strada-properties.com/areas",
    },
    {
      name: compound?.name || "Compounds",
      url: compound?.slug
        ? `https://www.strada-properties.com/compounds/${compound.slug}`
        : "https://www.strada-properties.com/search",
    },
    {
      name: property.name,
      url: `https://www.strada-properties.com/properties/${slug}`,
    },
  ]);

  const propertySchema = generatePropertySchema({
    name: property.name,
    description: `${property.propertyType} in ${compound?.name || "Egypt"}`,
    price:
      typeof property.startPrice === "string"
        ? parseFloat(property.startPrice)
        : property.startPrice,
    currency: "EGP",
    image: property.imageGallery?.[0]?.url,
    url: `https://www.strada-properties.com/properties/${slug}`,
    address: compound?.area?.name,
  });

  return (
    <main className="min-h-screen bg-background pt-20 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-[#013344]/60 via-[#028180]/40 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <BreadcrumbCustom paths={breadcrumbPaths} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-8 space-y-8">
            <GallerySlider images={images} />

            <div className="lg:hidden space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#05596B]">
                  {property.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-[#05596B]">
                    {property.propertyType}
                  </Badge>
                  {property.isResale && (
                    <Badge className="bg-orange-100 text-[#05596B]">
                      Resale
                    </Badge>
                  )}
                  {property.isRecommended && (
                    <Badge className="bg-cyan-100 text-[#05596B]">
                      Recommended
                    </Badge>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-2xl font-bold text-[#05596B]">
                    {formatPrice(property.startPrice)}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Developer</p>
                  <Link
                    href={`/developers/${compound?.developer?.slug}`}
                    className="font-semibold text-[#05596B] hover:underline"
                  >
                    {compound?.developer?.name || "N/A"}
                  </Link>
                </div>
              </div>

              <ContactButtons
                phoneNumber="+201123960001"
                compoundName={property.name}
              />
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#05596B]">
                  {property.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-[#05596B]">
                    {property.propertyType}
                  </Badge>
                  {property.isResale && (
                    <Badge className="bg-orange-100 text-[#05596B]">
                      Resale
                    </Badge>
                  )}
                  {property.isRecommended && (
                    <Badge className="bg-cyan-100 text-[#05596B]">
                      Recommended
                    </Badge>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-2xl font-bold text-[#05596B]">
                    {formatPrice(property.startPrice)}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Developer</p>
                  <Link
                    href={`/developers/${compound?.developer?.slug}`}
                    className="font-semibold text-[#05596B] hover:underline"
                  >
                    {compound?.developer?.name || "N/A"}
                  </Link>
                </div>
              </div>

              <ContactButtons
                phoneNumber="+201123960001"
                compoundName={property.name}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
                Property Information
              </h2>
              <PropertyInfo property={property} compound={compound} />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
                Details
              </h2>
              <PropertyDetailsTabs
                locationCoords={
                  property.compound?.locationOnMap || { lat: 0, lng: 0 }
                }
                propertyName={property.name}
                masterPlanUrl={masterPlanUrl}
                floorPlanImages={property.floorPlanImage || []}
              />
            </section>

            {property.originalPlan && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
                  Payment Plan
                </h2>
                <PropertyPaymentPlan plan={property.originalPlan} />
              </section>
            )}

            {property.compound?.Offers &&
              property.compound.Offers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
                    Available Payment Plans
                  </h2>
                  <PaymentPlans plans={property.compound.Offers} />
                </section>
              )}

            {property.compound?.amenities &&
              property.compound.amenities.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
                    Amenities
                  </h2>
                  <AmenitiesSection amenities={property.compound.amenities} />
                </section>
              )}

            {property.compound?.description && (
              <section>
                <AboutSec
                  title={`About ${property.compound.name}`}
                  content={property.compound.description}
                />
              </section>
            )}

            {filteredRelated.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
                  More Properties in {property.compound?.name}
                </h2>
                <Suspense fallback={<PropertySkeleton count={6} />}>
                  <RelatedProperties properties={filteredRelated} />
                </Suspense>
              </section>
            )}
          </div>
          <div className="hidden lg:block lg:col-span-4" />
        </div>
      </div>
    </main>
  );
}
