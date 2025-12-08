import { Suspense } from "react";
import type { Metadata } from "next";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { DevelopersGrid } from "@/components/developers/developers-grid";
import { DevelopersGridSkeleton } from "@/components/shared/loading/developers-grid-skeleton";
import { fetchDevelopersPaginated } from "../api/fetchers";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Developers - Top Real Estate Developers in Egypt",
  description:
    "Discover Egypt's leading real estate developers. Browse projects from trusted developers creating luxury compounds and properties across Egypt.",
  keywords: [
    "real estate developers Egypt",
    "top developers",
    "property developers",
    "construction companies Egypt",
    "trusted developers",
  ],
  path: "/developers",
});

export default async function DevelopersPage() {
  const { data: developers } = await fetchDevelopersPaginated(1, 100);

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
        <BreadcrumbCustom paths={[{ title: "Developers" }]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#05596B] mb-2">
            Top Developers
          </h1>
          <p className="text-muted-foreground">
            Discover Egypt's leading real estate developers
          </p>
        </div>

        <Suspense fallback={<DevelopersGridSkeleton />}>
          <DevelopersGrid developers={developers} />
        </Suspense>
      </div>
    </main>
  );
}
