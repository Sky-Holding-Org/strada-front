import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchCompoundBySlug,
  fetchPropertiesByCompoundSlug,
} from "@/app/api/fetchers";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { GallerySlider } from "@/components/shared/sections/gallery-slider";
import { ContactButtons } from "@/components/shared/contact-buttons";
import { DetailsTabs } from "@/components/compound/details-tabs";
import { PaymentPlans } from "@/components/compound/payment-plans";
import { AmenitiesSection } from "@/components/shared/sections/amenities-sec";
import { AboutSec } from "@/components/shared/sections/about-sec";
import { PropertiesSection } from "@/components/compound/properties-section";
import { Badge } from "@/components/ui/badge";
import type { Image } from "@/app/api/types";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateBreadcrumbSchema,
  generatePropertySchema,
} from "@/lib/structured-data";

interface CompoundPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CompoundPageProps): Promise<Metadata> {
  const { slug } = await params;
  const compound = await fetchCompoundBySlug(slug);
  if (!compound) return {};

  const image = compound.imageGallery?.[0]?.url;
  return generatePageMetadata({
    title: `${compound.name} - ${compound.area?.name || "Egypt"}`,
    description:
      compound.description ||
      `Discover ${compound.name} by ${
        compound.developer?.name || "top developer"
      } in ${compound.area?.name || "Egypt"}. Starting from ${
        compound.startPrice
      } EGP. Explore amenities, payment plans, and available properties.`,
    keywords: [
      compound.name,
      compound.area?.name || "",
      compound.developer?.name || "",
      "compound Egypt",
      "luxury compound",
    ],
    path: `/compounds/${slug}`,
    images: image
      ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: compound.name,
          },
        ]
      : undefined,
  });
}

export default async function CompoundPage({ params }: CompoundPageProps) {
  const { slug } = await params;
  const [compound, properties] = await Promise.all([
    fetchCompoundBySlug(slug),
    fetchPropertiesByCompoundSlug(slug),
  ]);

  if (!compound) {
    notFound();
  }

  const breadcrumbPaths = [
    {
      title: compound.area?.name || "Areas",
      href: compound.area?.slug ? `/areas/${compound.area.slug}` : "/areas",
    },
    {
      title: compound.name,
    },
  ];

  const images =
    compound.imageGallery?.map((img: Image) => ({
      url: img.url,
      alt: compound.name,
    })) || [];

  const masterPlanUrl = compound.masterPlanImage?.[0]?.url;

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
      name: compound.area?.name || "Areas",
      url: compound.area?.slug
        ? `https://www.strada-properties.com/areas/${compound.area.slug}`
        : "https://www.strada-properties.com/areas",
    },
    {
      name: compound.name,
      url: `https://www.strada-properties.com/compounds/${slug}`,
    },
  ]);

  const propertySchema = generatePropertySchema({
    name: compound.name,
    description:
      compound.description ||
      `${compound.name} in ${compound.area?.name || "Egypt"}`,
    price:
      typeof compound.startPrice === "string"
        ? parseFloat(compound.startPrice)
        : compound.startPrice,
    currency: "EGP",
    image: compound.imageGallery?.[0]?.url,
    url: `https://www.strada-properties.com/compounds/${slug}`,
    address: compound.area?.name,
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            <GallerySlider images={images} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#05596B]">
                {compound.name}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {compound.isNewLaunch && (
                  <Badge className="bg-cyan-100 text-[#05596B]">
                    New Launch
                  </Badge>
                )}
                {compound.isTrendingProject && (
                  <Badge className="bg-cyan-100 text-[#05596B]">Trending</Badge>
                )}
                {compound.isRecommended && (
                  <Badge className="bg-cyan-100 text-[#05596B]">
                    Recommended
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-[#05596B]">
                  {compound.area?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Developer</p>
                <p className="font-semibold text-[#05596B]">
                  {compound.developer?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-semibold text-[#05596B]">Compound</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">
                  Starting Price
                </p>
                <p className="text-2xl font-bold text-[#05596B]">
                  {formatPrice(compound.startPrice)}
                </p>
              </div>
            </div>

            <ContactButtons
              phoneNumber="+201123960001"
              compoundName={compound.name}
            />
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-[#05596B]">Details</h2>
          <DetailsTabs
            locationCoords={compound.locationOnMap || { lat: 0, lng: 0 }}
            compoundName={compound.name}
            masterPlanUrl={masterPlanUrl}
          />
        </section>

        {compound.Offers && compound.Offers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
              Payment Plans
            </h2>
            <PaymentPlans plans={compound.Offers} />
          </section>
        )}

        {properties && properties.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
              Available Properties
            </h2>
            <PropertiesSection properties={properties} />
          </section>
        )}

        {compound.amenities && compound.amenities.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-[#05596B]">
              Amenities
            </h2>
            <AmenitiesSection amenities={compound.amenities} />
          </section>
        )}

        {compound.description && (
          <section className="mt-12">
            <AboutSec
              title={`About ${compound.name}`}
              content={compound.description}
            />
          </section>
        )}
      </div>
    </main>
  );
}
