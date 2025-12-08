"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { MapContainer } from "@/components/map/map-container";
import { MapDrawer } from "@/components/map/map-drawer";
import { Search, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "use-debounce";
import Image from "@/components/ui/NextImage";
import { formatPrice } from "@/app/api/text";
import { PageLoader } from "@/components/shared/loading/page-loader";

type DrawerView = "areas" | "compounds" | "details";

export default function EgyptMapPage() {
  const [mapData, setMapData] = useState<any>(null);
  const [drawerView, setDrawerView] = useState<DrawerView>("areas");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState<any>(null);
  const [viewportBounds, setViewportBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const [searchParams, setSearchParams] = useQueryStates({
    q: parseAsString.withDefault(""),
    area: parseAsString,
    developer: parseAsString,
    priceMin: parseAsInteger,
    priceMax: parseAsInteger,
    newLaunch: parseAsString,
  });

  const [debouncedQuery] = useDebounce(searchParams.q, 300);

  // Fetch map data
  useEffect(() => {
    fetch("/api/map-data")
      .then((res) => res.json())
      .then((data) => setMapData(data))
      .catch((err) => console.error("Failed to fetch map data:", err));
  }, []);

  // Fetch filters
  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => setFilters(data))
      .catch((err) => console.error("Failed to fetch filters:", err));
  }, []);

  // Search compounds
  useEffect(() => {
    if (
      !debouncedQuery &&
      !searchParams.area &&
      !searchParams.developer &&
      !searchParams.priceMin &&
      !searchParams.priceMax &&
      !searchParams.newLaunch
    ) {
      setSearchResults([]);
      return;
    }

    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (searchParams.area) params.set("area", searchParams.area);
    if (searchParams.developer) params.set("developer", searchParams.developer);
    if (searchParams.priceMin)
      params.set("priceMin", searchParams.priceMin.toString());
    if (searchParams.priceMax)
      params.set("priceMax", searchParams.priceMax.toString());
    if (searchParams.newLaunch) params.set("newLaunch", searchParams.newLaunch);
    params.set("type", "compound");

    fetch(`/api/search-results?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const results = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          startPrice: item.startPrice,
          imageUrl: item.imageGallery?.[0]?.url || null,
          area: item.area?.name || null,
          developer: item.developer?.name || null,
          isNewLaunch: item.isNewLaunch,
          isTrendingProject: item.isTrendingProject,
          propertyCount: item.properties?.length || 0,
        }));
        setSearchResults(results);
      })
      .catch((err) => console.error("Search failed:", err));
  }, [
    debouncedQuery,
    searchParams.area,
    searchParams.developer,
    searchParams.priceMin,
    searchParams.priceMax,
    searchParams.newLaunch,
  ]);

  // Navigation handlers
  const handleAreaClick = useCallback((area: any) => {
    setSelectedArea(area.slug);
    setSelectedCompound(null);
    setDrawerView("compounds");
    setIsDrawerOpen(true);
  }, []);

  const handleCompoundClick = useCallback((compound: any) => {
    setSelectedCompound(compound.slug);
    setDrawerView("details");
    setIsDrawerOpen(true);
  }, []);

  const handlePropertyClick = useCallback((property: any) => {
    // Navigate to property page or show property details
    console.log("Property clicked:", property);
    // Can add router.push(`/properties/${property.slug}`) here
  }, []);

  const handleBackNavigation = useCallback(() => {
    if (drawerView === "details") {
      setDrawerView("compounds");
      setSelectedCompound(null);
    } else if (drawerView === "compounds") {
      setDrawerView("areas");
      setSelectedArea(null);
    }
  }, [drawerView]);

  const handleSearchResultClick = useCallback(
    (slug: string) => {
      if (!mapData) return;

      const compound = mapData.compounds.features.find(
        (f: any) => f.properties.slug === slug
      );

      if (compound) {
        const props = compound.properties;
        handleAreaClick({ slug: props.areaSlug, name: props.area });
        setTimeout(() => {
          handleCompoundClick(props);
        }, 100);
        setIsSearchOpen(false);
      }
    },
    [mapData, handleAreaClick, handleCompoundClick]
  );

  // Auto-update drawer view based on zoom level
  useEffect(() => {
    if (!isDrawerOpen) return;

    // Don't override if user is viewing details
    if (drawerView === "details") return;

    // Final zoom level constants - must match map-container.tsx
    const AREA_MAX_ZOOM = 9.5;
    const COMPOUND_MAX_ZOOM = 13;

    if (currentZoom < AREA_MAX_ZOOM) {
      // Low zoom: show areas
      if (drawerView !== "areas") {
        setDrawerView("areas");
        setSelectedArea(null);
        setSelectedCompound(null);
      }
    } else if (
      currentZoom >= AREA_MAX_ZOOM &&
      currentZoom < COMPOUND_MAX_ZOOM
    ) {
      // Medium zoom: show compounds instantly
      if (drawerView !== "compounds") {
        setDrawerView("compounds");
        // Don't clear selectedArea - keep it if it exists
      }
    }
  }, [currentZoom, drawerView, isDrawerOpen]);

  // Zoom change handler
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);

  // Listen for drawer open event
  useEffect(() => {
    const handleOpenDrawer = () => setIsDrawerOpen(true);
    window.addEventListener("openDrawer", handleOpenDrawer);
    return () => window.removeEventListener("openDrawer", handleOpenDrawer);
  }, []);

  if (!mapData) {
    return <PageLoader />;
  }

  // Extract area data
  const areas = mapData.areas.features.map((f: any) => f.properties);

  // Extract and filter compounds based on viewport and selected area
  const allCompounds = mapData.compounds.features;
  const filteredCompounds = allCompounds.filter((feature: any) => {
    const compound = feature.properties;
    const coords = feature.geometry?.coordinates;

    // Must have coordinates
    if (!coords || coords.length < 2) return false;

    const [lng, lat] = coords;

    // If area is selected, show all compounds for that area
    if (selectedArea) {
      return compound.areaSlug === selectedArea;
    }

    // Otherwise, filter by viewport bounds
    if (!viewportBounds) return true; // Show all if no bounds yet

    return (
      lat >= viewportBounds.south &&
      lat <= viewportBounds.north &&
      lng >= viewportBounds.west &&
      lng <= viewportBounds.east
    );
  });
  const compounds = filteredCompounds.map((f: any) => f.properties);

  // Extract and filter properties based on viewport
  const allProperties = mapData.properties.features;
  const filteredProperties = allProperties.filter((feature: any) => {
    const coords = feature.geometry?.coordinates;

    // Must have coordinates
    if (!coords || coords.length < 2) return false;

    const [lng, lat] = coords;

    // Filter by viewport bounds
    if (!viewportBounds) return true; // Show all if no bounds yet

    return (
      lat >= viewportBounds.south &&
      lat <= viewportBounds.north &&
      lng >= viewportBounds.west &&
      lng <= viewportBounds.east
    );
  });
  const properties = filteredProperties.map((f: any) => f.properties);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-50">
      {/* Search Bar */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-3xl px-4 lg:px-6 pt-24">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100">
          <div className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search compounds, areas, developers..."
                  value={searchParams.q}
                  onChange={(e) => {
                    setSearchParams({ q: e.target.value });
                    setIsSearchOpen(e.target.value.length > 0);
                  }}
                  onFocus={() => searchParams.q && setIsSearchOpen(true)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D3748] focus:border-transparent text-base transition-all"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-5 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isFilterOpen
                    ? "bg-[#2D3748] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal size={20} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="p-2">
                  {searchResults.map((compound) => (
                    <button
                      key={compound.id}
                      onClick={() => handleSearchResultClick(compound.slug)}
                      className="w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-all flex gap-3 items-center"
                    >
                      {compound.imageUrl && (
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={compound.imageUrl}
                            alt={compound.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                          {compound.name}
                        </h4>
                        {compound.area && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            📍 {compound.area}
                          </p>
                        )}
                        <p className="text-sm font-bold text-[#2D3748] mt-1">
                          {formatPrice(compound.startPrice)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            {isFilterOpen && filters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <select
                  value={searchParams.area || ""}
                  onChange={(e) =>
                    setSearchParams({ area: e.target.value || null })
                  }
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3748] focus:border-transparent bg-white transition-all"
                >
                  <option value="">All Areas</option>
                  {filters.areas.map((area: string) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>

                <select
                  value={searchParams.developer || ""}
                  onChange={(e) =>
                    setSearchParams({ developer: e.target.value || null })
                  }
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3748] focus:border-transparent bg-white transition-all"
                >
                  <option value="">All Developers</option>
                  {filters.developers.map((dev: string) => (
                    <option key={dev} value={dev}>
                      {dev}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Min Price (EGP)"
                  value={searchParams.priceMin || ""}
                  onChange={(e) =>
                    setSearchParams({
                      priceMin: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3748] focus:border-transparent transition-all"
                />

                <input
                  type="number"
                  placeholder="Max Price (EGP)"
                  value={searchParams.priceMax || ""}
                  onChange={(e) =>
                    setSearchParams({
                      priceMax: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3748] focus:border-transparent transition-all"
                />

                <label className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm cursor-pointer hover:bg-gray-50 transition-all bg-white">
                  <input
                    type="checkbox"
                    checked={searchParams.newLaunch === "true"}
                    onChange={(e) =>
                      setSearchParams({
                        newLaunch: e.target.checked ? "true" : null,
                      })
                    }
                    className="w-5 h-5 rounded text-[#2D3748] focus:ring-2 focus:ring-[#2D3748]"
                  />
                  <span className="font-medium">New Launch Only</span>
                </label>

                <button
                  onClick={() =>
                    setSearchParams({
                      q: "",
                      area: null,
                      developer: null,
                      priceMin: null,
                      priceMax: null,
                      newLaunch: null,
                    })
                  }
                  className="px-4 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      <MapDrawer
        view={drawerView}
        areas={areas}
        compounds={compounds}
        properties={properties}
        selectedArea={selectedArea}
        selectedCompound={selectedCompound}
        onAreaClick={handleAreaClick}
        onCompoundClick={handleCompoundClick}
        onPropertyClick={handlePropertyClick}
        onBackClick={handleBackNavigation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Click outside to close search dropdown */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Map */}
      <div className="w-full h-full">
        <MapContainer
          areasGeoJSON={mapData.areas}
          compoundsGeoJSON={mapData.compounds}
          propertiesGeoJSON={mapData.properties}
          selectedArea={selectedArea}
          selectedCompound={selectedCompound}
          onAreaClick={handleAreaClick}
          onCompoundClick={handleCompoundClick}
          onPropertyClick={handlePropertyClick}
          onZoomChange={handleZoomChange}
          onViewportChange={setViewportBounds}
        />
      </div>
    </div>
  );
}
