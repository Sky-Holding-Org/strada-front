import { NextResponse } from "next/server";
import { fetchAllAreas } from "@/app/api/fetchers";

export async function GET() {
  try {
    const areas = await fetchAllAreas();
    const formattedAreas = areas.map(area => ({
      id: area.id,
      name: area.name,
      slug: area.slug
    }));
    return NextResponse.json(formattedAreas);
  } catch (error) {
    console.error("Failed to fetch areas", error);
    return NextResponse.json([], { status: 500 });
  }
}
