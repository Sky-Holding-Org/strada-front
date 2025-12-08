import { Suspense } from "react";
import type { Metadata } from "next";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { AreasGrid } from "@/components/areas/areas-grid";
import { AreasGridSkeleton } from "@/components/shared/loading/areas-grid-skeleton";
import { fetchAreasPaginated } from "../api/fetchers";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Areas - Explore Top Locations in Egypt",
  description:
    "Discover the best areas and locations across Egypt. Explore properties in New Capital, North Coast, 6th of October, Alexandria, New Cairo, and more prime locations.",
  keywords: [
    "areas Egypt",
    "locations Egypt",
    "New Capital",
    "North Coast",
    "6th of October",
    "New Cairo",
    "Alexandria",
    "real estate locations",
  ],
  path: "/areas",
});

export default async function AreasPage() {
  const { data: areas } = await fetchAreasPaginated(1, 100);

  return (
    <main className="min-h-screen w-full bg-white relative pt-24 pb-12">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
        radial-gradient(
          circle at top right,
          rgba(56, 193, 182, 0.5),
          transparent 70%
        )
      `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <BreadcrumbCustom paths={[{ title: "Areas" }]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#05596B] mb-2">
            Explore Areas
          </h1>
          <p className="text-muted-foreground">
            Discover the best locations across Egypt
          </p>
        </div>

        <Suspense fallback={<AreasGridSkeleton />}>
          <AreasGrid areas={areas} />
        </Suspense>
      </div>
    </main>
  );
}
