import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "compound";
  const limit = searchParams.get("limit") || "10";

  try {
    // Build fetches in parallel to reduce latency
    const results: any[] = [];

    const limitNum = parseInt(limit, 10) || 10;

    const mainPromise = (async () => {
      if (type === "compound") {
        const url = `${API_BASE_URL}/compounds?filters[name][$containsi]=${query}&pagination[limit]=${limitNum}&populate=*`;
        const response = await fetch(url, { next: { revalidate: 3600 } });
        if (response.ok) {
          const data = await response.json();
          return data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: "compound",
            slug: item.slug,
            imageUrl: item.imageGallery?.[0]?.url || null,
            startPrice: item.startPrice,
            isNewLaunch: item.isNewLaunch || false,
            isTrendingProject: item.isTrendingProject || false,
            developer: item.developer?.name || null,
            area: item.area?.name || null,
          }));
        }
      } else {
        const url = `${API_BASE_URL}/properties?filters[name][$containsi]=${query}&pagination[limit]=${limitNum}&populate=*`;
        const response = await fetch(url, { next: { revalidate: 3600 } });
        if (response.ok) {
          const data = await response.json();
          return data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: "property",
            slug: item.slug,
            imageUrl: item.imageGallery?.[0]?.url || null,
            startPrice: item.startPrice,
            developer: item.compound?.developer?.name || null,
            area: item.compound?.area?.name || null,
          }));
        }
      }
      return [];
    })();

    const devPromise = fetch(
      `${API_BASE_URL}/developers?filters[name][$containsi]=${query}&pagination[limit]=3&populate=*`,
      { next: { revalidate: 3600 } }
    ).then(async (res) => (res.ok ? (await res.json()).data : []));

    const areaPromise = fetch(
      `${API_BASE_URL}/areas?filters[name][$containsi]=${query}&pagination[limit]=3&populate=*`,
      { next: { revalidate: 3600 } }
    ).then(async (res) => (res.ok ? (await res.json()).data : []));

    const [mainResults, devs, areas] = await Promise.all([
      mainPromise,
      devPromise,
      areaPromise,
    ]);

    // Prioritize developers and areas first, then fill remaining slots with compounds/properties
    const priorityResults: any[] = [];

    // Add areas first, then developers (change prioritization per request)
    if (areas && areas.length) {
      priorityResults.push(
        ...areas.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: "area",
          slug: item.slug,
          imageUrl: item.banner?.url || null,
        }))
      );
    }

    if (devs && devs.length) {
      priorityResults.push(
        ...devs.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: "developer",
          slug: item.slug,
          imageUrl: item.logo?.url || null,
          startPrice: item.startPrice,
        }))
      );
    }

    // Then add main results (compounds/properties) to fill remaining slots
    const remainingSlots = Math.max(0, 10 - priorityResults.length);
    if (mainResults && mainResults.length) {
      priorityResults.push(...mainResults.slice(0, remainingSlots));
    }

    const response = NextResponse.json({
      results: priorityResults.slice(0, 10),
    });
    // Cache search results at edge for 1 hour with stale-while-revalidate
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );
    return response;
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
