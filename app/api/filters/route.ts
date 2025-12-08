import { NextResponse } from "next/server";
import {
  fetchUniquePropertyTypes,
  fetchAllDeveloperNames,
  fetchAllAreaNames,
} from "@/app/api/fetchers";

const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Fetch all property data and extract unique finishing types and delivery years
 * Combines two fields in a single request to reduce API calls
 */
async function fetchPropertyFilterData(): Promise<{
  finishingTypes: string[];
  deliveryYears: number[];
}> {
  const res = await fetch(
    `${API_BASE_URL}/properties?fields[0]=finishing&fields[1]=deliveryIn&pagination[limit]=1000`,
    {
      next: { revalidate: 3600, tags: ["property-filters"] },
    }
  );
  if (!res.ok) return { finishingTypes: [], deliveryYears: [] };

  const data = await res.json();
  const finishingTypes = [
    ...new Set(data.data.map((p: any) => p.finishing).filter(Boolean)),
  ] as string[];
  const deliveryYears = (
    [
      ...new Set(data.data.map((p: any) => p.deliveryIn).filter(Boolean)),
    ] as number[]
  ).sort((a, b) => a - b);

  return { finishingTypes, deliveryYears };
}

export async function GET() {
  try {
    const [propertyTypes, developers, areas, propertyFilters] =
      await Promise.all([
        fetchUniquePropertyTypes(),
        fetchAllDeveloperNames(),
        fetchAllAreaNames(),
        fetchPropertyFilterData(),
      ]);

    const response = NextResponse.json({
      propertyTypes,
      developers,
      areas,
      finishingTypes: propertyFilters.finishingTypes,
      deliveryYears: propertyFilters.deliveryYears,
    });

    // Add cache headers for edge caching
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );

    return response;
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json(
      {
        propertyTypes: [],
        developers: [],
        areas: [],
        finishingTypes: [],
        deliveryYears: [],
      },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;
