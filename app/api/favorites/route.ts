import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ compounds: [], properties: [] });
    }

    const promises = ids.map(async (id: string) => {
      try {
        const compoundRes = await fetch(
          `${API_BASE_URL}/compounds/${id}?populate=*`
        );
        if (compoundRes.ok) {
          const data = await compoundRes.json();
          return { type: "compound", data: data.data };
        }
      } catch {}

      try {
        const propertyRes = await fetch(
          `${API_BASE_URL}/properties/${id}?populate=*`
        );
        if (propertyRes.ok) {
          const data = await propertyRes.json();
          return { type: "property", data: data.data };
        }
      } catch {}

      return null;
    });

    const results = await Promise.all(promises);
    const validResults = results.filter(Boolean);

    const compounds = validResults
      .filter((r) => r?.type === "compound")
      .map((r) => r!.data);
    const properties = validResults
      .filter((r) => r?.type === "property")
      .map((r) => r!.data);

    return NextResponse.json({ compounds, properties });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}
