import { Suspense } from "react";
import type { Metadata } from "next";
import {
  fetchRecommendedNewLaunchCompounds,
  fetchRecommendedTrendingCompounds,
  fetchRecommendedCompounds,
  fetchRecommendedAreas,
  fetchRecommendedProperties,
} from "@/app/api/fetchers";
import { LogoSlider } from "@/components/shared/logo-slider";
import { NewLaunchesSlider } from "@/components/home/sliders/recommended-new-launch-slider";
import { TrendingSlider } from "@/components/home/sliders/recommended-trending-slider";
import { RecommendedCompoundsSlider } from "@/components/home/sliders/recommended-compound-slider";
import { RecommendedAreasSlider } from "@/components/home/sliders/recommended-area-slider";
import { RecommendedPropertiesSlider } from "@/components/home/sliders/recommended-properties-slider";
import { SliderSkeleton } from "@/components/shared/loading/slider-skeleton";
import Image from "@/components/ui/NextImage";
import SearchBar from "@/components/home/search-bar";
import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Strada Properties - Premier Real Estate Brokerage",
  description:
    "Discover luxury properties in Egypt with Strada Properties. Explore new launches, trending projects, top compounds, and investment opportunities across New Capital, North Coast, 6th of October, and more.",
  keywords: [
    "luxury real estate Egypt",
    "properties for sale Egypt",
    "new launches Egypt",
    "compounds Egypt",
    "investment properties",
  ],
  path: "/",
  images: [
    {
      url: "/Home.webp",
      width: 1200,
      height: 630,
      alt: "Strada Properties - Where The Road Leads You Home",
    },
  ],
});

async function NewLaunchesSection() {
  const compounds = await fetchRecommendedNewLaunchCompounds();
  return (
    <NewLaunchesSlider
      compounds={compounds}
      title="New Launches"
      description="Discover the latest Projects"
      variant="compact"
      className="mb-12"
      showAllLink="/new-launches"
    />
  );
}

async function TrendingSection() {
  const compounds = await fetchRecommendedTrendingCompounds();
  return (
    <TrendingSlider
      compounds={compounds}
      title="Trending Projects"
      description="Discover the latest trending projects"
      variant="compact"
      className="mb-12"
      showAllLink="/new-launches"
    />
  );
}

async function CompoundsSection() {
  const compounds = await fetchRecommendedCompounds();
  return (
    <RecommendedCompoundsSlider
      compounds={compounds}
      title="Top Compounds"
      description="Handpicked compounds just for you"
      variant="compact"
      className="mb-12"
      showAllLink="/search"
    />
  );
}

async function AreasSection() {
  const areas = await fetchRecommendedAreas();
  return (
    <RecommendedAreasSlider
      areas={areas}
      title="Top Areas"
      description="Handpicked areas just for you"
      className="mb-12"
      showAllLink="/areas"
    />
  );
}

async function PropertiesSection() {
  const properties = await fetchRecommendedProperties();
  return (
    <RecommendedPropertiesSlider
      properties={properties}
      title="Recommended Properties"
      description="Handpicked properties just for you"
      className="mb-12"
      showAllLink="/search?type=property"
    />
  );
}

export default async function HomePage() {
  return (
    <main>
      <div className="relative h-[560px] sm:h-[600px] lg:h-[690px]">
        <Image
          src="/Home.webp"
          alt="Home background"
          fill
          className="object-cover object-center"
          loading="lazy"
          quality={75}
          sizes="100vw"
        />
        <div className="absolute inset-0 opacity-70 bg-teal-900/70 bg-linear-to-b from-[#013344]/70 via-[#013344]/50 to-[#013344]/30"></div>
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div>
            <section className="text-center space-y-3 sm:space-y-4 mt-6 sm:mt-8 text-white">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                WHERE THE ROAD LEADS YOU HOME
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-white px-4">
                EXPLORE LUXURY PROPERTIES THAT SUIT YOUR EVERY NEED
              </p>
            </section>
          </div>
          <div className="flex justify-center mt-6 sm:mt-8 lg:mt-12">
            <SearchBar />
          </div>
        </div>
      </div>
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#05596B] mb-2">
              Our Trusted Partners
            </h2>
            <p className="text-sm sm:text-base text-[#05596B]">
              Working with Egypt&apos;s leading real estate developers
            </p>
          </div>
          <LogoSlider />
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        <Suspense fallback={<SliderSkeleton />}>
          <NewLaunchesSection />
        </Suspense>

        <Suspense fallback={<SliderSkeleton />}>
          <TrendingSection />
        </Suspense>

        <Suspense fallback={<SliderSkeleton />}>
          <CompoundsSection />
        </Suspense>

        <Suspense fallback={<SliderSkeleton />}>
          <AreasSection />
        </Suspense>

        <Suspense fallback={<SliderSkeleton />}>
          <PropertiesSection />
        </Suspense>
      </div>
    </main>
  );
}
