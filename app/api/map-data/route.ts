import { NextResponse } from "next/server";
import { fetchAreas, fetchCompounds, fetchProperties } from "@/app/api/fetchers";

export async function GET() {
  try {
    // Use existing working fetchers
    const [areas, compounds, properties] = await Promise.all([
      fetchAreas(),
      fetchCompounds(),
      fetchProperties(),
    ]);

    // Process areas with geo location
    const areasWithGeo = areas.filter(
      (area) => area.locationOnMap?.lat && area.locationOnMap?.lng
    );

    // Process compounds with geo location
    const compoundsWithGeo = compounds.filter(
      (c) => c.locationOnMap?.lat && c.locationOnMap?.lng
    );

    // Process properties - use their own location or fallback to compound location
    const propertiesWithGeo = properties
      .map((p) => {
        // If property has its own location, use it
        if (p.locationOnMap?.lat && p.locationOnMap?.lng) {
          return p;
        }
        // Fallback: use compound location if available
        if (p.compound?.documentId) {
          const compound = compoundsWithGeo.find((c) => c.documentId === p.compound?.documentId);
          if (compound?.locationOnMap) {
            return {
              ...p,
              locationOnMap: compound.locationOnMap,
            };
          }
        }
        return null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    // Generate Areas GeoJSON
    const areasGeoJSON = {
      type: "FeatureCollection",
      features: areasWithGeo.map((area) => {
        // Count ALL compounds from the populated area.compounds field
        // This gives us the accurate count from backend
        const allAreaCompounds = area.compounds || [];
        const compoundCount = allAreaCompounds.length;
        
        // Get compounds WITH coordinates for bounding box (from our filtered list)
        const areaCompoundsWithGeo = compoundsWithGeo.filter(
          (c) => c.area?.documentId === area.documentId
        );

        // If area has compounds with coordinates, create bounding box polygon
        if (areaCompoundsWithGeo.length > 0) {
          const lngs = areaCompoundsWithGeo.map((c) => c.locationOnMap!.lng);
          const lats = areaCompoundsWithGeo.map((c) => c.locationOnMap!.lat);
          
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          // Add 5% padding
          const lngPadding = (maxLng - minLng) * 0.05;
          const latPadding = (maxLat - minLat) * 0.05;

          return {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[
                [minLng - lngPadding, minLat - latPadding],
                [maxLng + lngPadding, minLat - latPadding],
                [maxLng + lngPadding, maxLat + latPadding],
                [minLng - lngPadding, maxLat + latPadding],
                [minLng - lngPadding, minLat - latPadding],
              ]],
            },
            properties: {
              id: area.id,
              documentId: area.documentId,
              name: area.name,
              slug: area.slug,
              compoundCount: compoundCount, // Count from populated compounds
              // Use imageGallery first, fallback to banner
              imageUrl: area.imageGallery?.[0]?.url || area.banner?.url || null,
              centerLng: area.locationOnMap!.lng,
              centerLat: area.locationOnMap!.lat,
            },
          };
        }
        
        // Fallback: use area's own location as a point if no compounds
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [area.locationOnMap!.lng, area.locationOnMap!.lat],
          },
          properties: {
            id: area.id,
            documentId: area.documentId,
            name: area.name,
            slug: area.slug,
            compoundCount: 0,
            imageUrl: area.imageGallery?.[0]?.url || area.banner?.url || null,
            centerLng: area.locationOnMap!.lng,
            centerLat: area.locationOnMap!.lat,
          },
        };
      }),
    };

    // Generate Compounds GeoJSON
    const compoundsGeoJSON = {
      type: "FeatureCollection",
      features: compoundsWithGeo.map((c) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [c.locationOnMap!.lng, c.locationOnMap!.lat],
        },
        properties: {
          id: c.id,
          documentId: c.documentId,
          name: c.name,
          slug: c.slug,
          startPrice: c.startPrice,
          imageUrl: c.imageGallery?.[0]?.url || null,
          area: c.area?.name || null,
          areaSlug: c.area?.slug || null,
          areaDocumentId: c.area?.documentId || null,
          developer: c.developer?.name || null,
          developerLogo: c.developer?.logo?.url || null,
          isNewLaunch: c.isNewLaunch || false,
          isTrendingProject: c.isTrendingProject || false,
          isRecommended: c.isRecommended || false,
          propertyCount: c.properties?.length || 0,
        },
      })),
    };

    // Generate Properties GeoJSON
    const propertiesGeoJSON = {
      type: "FeatureCollection",
      features: propertiesWithGeo.map((p) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [p.locationOnMap!.lng, p.locationOnMap!.lat],
        },
        properties: {
          id: p.id,
          documentId: p.documentId,
          name: p.name || "Property",
          slug: p.slug,
          startPrice: p.startPrice, // Changed from price to startPrice
          propertyType: p.propertyType,
          imageUrl: p.imageGallery?.[0]?.url || null,
          compoundSlug: p.compound?.slug || null,
          compoundName: p.compound?.name || null,
          compoundDocumentId: p.compound?.documentId || null,
          developer: p.developer?.name || null, // Added developer name
          developerSlug: p.developer?.slug || null, // Added developer slug
          area: p.area?.name || null,
          areaSlug: p.area?.slug || null,
          bedrooms: p.beds, // Map to schema field name
          bathrooms: p.baths, // Map to schema field name
          squareMeters: p.size, // Map to schema field name
          deliveryIn: p.deliveryDate ? new Date(p.deliveryDate).getFullYear() : null, // Map to schema field name
          isResale: p.isResale || false,
        },
      })),
    };

    return NextResponse.json({
      areas: areasGeoJSON,
      compounds: compoundsGeoJSON,
      properties: propertiesGeoJSON,
    });
  } catch (error) {
    console.error("Map data API error:", error);
    return NextResponse.json(
      {
        areas: { type: "FeatureCollection", features: [] },
        compounds: { type: "FeatureCollection", features: [] },
        properties: { type: "FeatureCollection", features: [] },
      },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;
