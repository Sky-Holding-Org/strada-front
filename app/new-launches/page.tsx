import {
  fetchAllTrendingCompounds,
  fetchAllNewLaunchCompounds,
} from "@/app/api/fetchers";
import { TrendingSlider } from "@/components/new-launches/sliders/trending-slider";
import { AllLaunchesSection } from "@/components/new-launches/all-launche-sec";
import { AboutSection } from "@/components/new-launches/about-sec";
import { Suspense } from "react";
import { SliderSkeleton } from "@/components/shared/loading/slider-skeleton";
import { LaunchesSkeleton } from "@/components/shared/loading/launches-skeleton";
import { AboutSkeleton } from "@/components/shared/loading/about-skeleton";
import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "New Launches - Latest Property Projects in Egypt",
  description:
    "Explore the latest new launch property projects in Egypt. Be the first to reserve your unit in trending compounds across New Capital, North Coast, and prime locations.",
  keywords: [
    "new launches Egypt",
    "new property projects",
    "latest compounds Egypt",
    "trending projects",
    "pre-launch properties",
  ],
  path: "/new-launches",
  images: [
    {
      url: "/new-launches.webp",
      width: 1200,
      height: 630,
      alt: "New Launches - Strada Properties",
    },
  ],
});

export default async function NewLaunches() {
  async function TrendingSection() {
    const compounds = await fetchAllTrendingCompounds();
    return (
      <TrendingSlider
        compounds={compounds}
        title="Trending Projects"
        description="Discover the latest trending projects"
        className="mb-12"
      />
    );
  }

  async function LaunchesSection() {
    const compounds = await fetchAllNewLaunchCompounds();
    return <AllLaunchesSection compounds={compounds} />;
  }

  return (
    <main>
      <div className="relative h-[350px]">
        <div
          className="absolute inset-0 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url(/new-launches.webp)",
          }}
        />
        <div className="absolute inset-0 opacity-70 bg-teal-900/70 bg-linear-to-b from-[#013344]/70 via-[#013344]/50 to-[#013344]/30 "></div>

        <div className="relative mx-auto px-4 h-full flex flex-col justify-center">
          <div>
            <section className="text-left space-y-4 text-white pl-4 sm:pl-12 lg:pl-24">
              <div className="mb-4"></div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                EXPLORE NEW
                <span className="text-orange-300 text-4xl sm:text-5xl">
                  {" "}
                  LAUNCHES
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white">
                BE THE FIRST ONE TO RESERVE YOUR UNIT
              </p>
            </section>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <BreadcrumbCustom paths={[{ title: "All Launches" }]} />
      </div>

      <section className="container mx-auto px-4 py-12 space-y-16">
        <Suspense fallback={<SliderSkeleton />}>
          <TrendingSection />
        </Suspense>

        <div className="px-12">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">All New Launches</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Browse all available new launch projects
            </p>
          </div>
          <Suspense fallback={<LaunchesSkeleton />}>
            <LaunchesSection />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutSection />
      </Suspense>
    </main>
  );
}
