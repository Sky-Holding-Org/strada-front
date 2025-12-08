import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const type = searchParams.get("type") || "compound";

  try {
    const params = new URLSearchParams();

    if (searchParams.get("q"))
      params.set("filters[name][$containsi]", searchParams.get("q")!);
    if (type === "compound") {
      if (searchParams.get("developer"))
        params.set(
          "filters[developer][name][$eq]",
          searchParams.get("developer")!
        );
      if (searchParams.get("area"))
        params.set("filters[area][name][$eq]", searchParams.get("area")!);
      if (searchParams.get("priceMin"))
        params.set("filters[startPrice][$gte]", searchParams.get("priceMin")!);
      if (searchParams.get("priceMax"))
        params.set("filters[startPrice][$lte]", searchParams.get("priceMax")!);
      if (searchParams.get("newLaunch") === "true")
        params.set("filters[isNewLaunch][$eq]", "true");
    }

    if (type === "property") {
      if (searchParams.get("developer"))
        params.set(
          "filters[compound][developer][name][$eq]",
          searchParams.get("developer")!
        );
      if (searchParams.get("area"))
        params.set(
          "filters[compound][area][name][$eq]",
          searchParams.get("area")!
        );
      if (searchParams.get("priceMin"))
        params.set("filters[startPrice][$gte]", searchParams.get("priceMin")!);
      if (searchParams.get("priceMax"))
        params.set("filters[startPrice][$lte]", searchParams.get("priceMax")!);
      if (searchParams.get("bedrooms"))
        params.set("filters[bedrooms][$eq]", searchParams.get("bedrooms")!);
      if (searchParams.get("bathrooms"))
        params.set("filters[bathrooms][$eq]", searchParams.get("bathrooms")!);
      if (searchParams.get("propertyType"))
        params.set(
          "filters[propertyType][$eq]",
          searchParams.get("propertyType")!
        );
      if (searchParams.get("finishing"))
        params.set("filters[finishing][$eq]", searchParams.get("finishing")!);
      if (searchParams.get("deliveryIn"))
        params.set("filters[deliveryIn][$eq]", searchParams.get("deliveryIn")!);
      if (searchParams.get("salesType")) {
        params.set(
          "filters[isResale][$eq]",
          searchParams.get("salesType") === "resale" ? "true" : "false"
        );
      }
    }

    params.set("pagination[page]", page);
    params.set("pagination[pageSize]", "12");
    params.set("populate", "*");

    const endpoint = type === "compound" ? "compounds" : "properties";
    const res = await fetch(
      `${API_BASE_URL}/${endpoint}?${params.toString()}`,
      {
        next: { revalidate: 3600, tags: ["search-results", type] },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    const response = NextResponse.json(data);
    // Cache search results at edge with stale-while-revalidate strategy
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );
    return response;
  } catch (error) {
    console.error("Search results API error:", error);
    return NextResponse.json(
      {
        data: [],
        meta: { pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 } },
      },
      { status: 500 }
    );
  }
}
