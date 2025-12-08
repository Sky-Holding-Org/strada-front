import { Suspense } from "react";
import { SearchContent } from "@/components/search/search-content";
import { PageLoader } from "@/components/shared/loading/page-loader";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Search Properties - Find Your Dream Home in Egypt",
  description:
    "Search and filter luxury properties, compounds, and developments across Egypt. Find your perfect home in New Capital, North Coast, 6th of October, New Cairo, and more.",
  keywords: [
    "search properties Egypt",
    "find properties",
    "property search",
    "real estate search Egypt",
    "filter properties",
  ],
  path: "/search",
});

export default function SearchPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SearchContent />
    </Suspense>
  );
}
