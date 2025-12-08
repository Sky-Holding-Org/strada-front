"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { AreaCard } from "./area-card";
import { CompoundCard } from "./compound-card";
import { CompoundDetails } from "./compound-details";

type DrawerView = "areas" | "compounds" | "details";

interface AreaFeature {
  documentId: string;
  name: string;
  slug: string;
  compoundCount: number;
  imageUrl: string | null;
}

interface CompoundFeature {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  startPrice: string;
  imageUrl: string | null;
  area: string | null;
  areaSlug: string | null;
  areaDocumentId: string | null;
  developer: string | null;
  developerLogo: string | null;
  isNewLaunch: boolean;
  isTrendingProject: boolean;
  propertyCount: number;
}

interface PropertyFeature {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  startPrice: string; // Changed from price to startPrice
  propertyType: string;
  imageUrl: string | null;
  compoundSlug: string | null;
  compoundName: string | null;
  compoundDocumentId: string | null;
  developer?: string | null; // Added developer name
  developerSlug?: string | null; // Added developer slug
  bedrooms: number | null; // Schema uses bedrooms
  bathrooms: number | null; // Schema uses bathrooms
  squareMeters: number | null; // Schema uses squareMeters
  deliveryIn: number | null; // Schema uses deliveryIn
  isResale: boolean;
}

interface MapDrawerProps {
  view: DrawerView;
  areas: AreaFeature[];
  compounds: CompoundFeature[];
  properties: PropertyFeature[];
  selectedArea: string | null;
  selectedCompound: string | null;
  onAreaClick: (area: AreaFeature) => void;
  onCompoundClick: (compound: CompoundFeature) => void;
  onPropertyClick: (property: PropertyFeature) => void;
  onBackClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MapDrawer({
  view,
  areas,
  compounds,
  properties,
  selectedArea,
  selectedCompound,
  onAreaClick,
  onCompoundClick,
  onPropertyClick,
  onBackClick,
  isOpen,
  onClose,
}: MapDrawerProps) {
  // Filter compounds by selected area
  const filteredCompounds = useMemo(() => {
    if (!selectedArea) return compounds;
    return compounds.filter((c) => c.areaSlug === selectedArea);
  }, [compounds, selectedArea]);

  // Filter properties by selected compound
  const filteredProperties = useMemo(() => {
    if (!selectedCompound) return properties;
    return properties.filter((p) => p.compoundSlug === selectedCompound);
  }, [properties, selectedCompound]);

  // Get selected compound details
  const selectedCompoundData = useMemo(() => {
    if (!selectedCompound) return null;
    return compounds.find((c) => c.slug === selectedCompound);
  }, [compounds, selectedCompound]);

  // Render content based on view
  const renderContent = () => {
    if (view === "areas") {
      return (
        <>
          <div className="bg-linear-to-r from-[#2D3748] to-[#4A5568] p-5 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl text-white">Areas</h2>
              <p className="text-xs text-gray-300 mt-1">
                Select an area to view compounds
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Total Areas
              </span>
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                {areas.length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            {areas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">📍</span>
                </div>
                <p className="text-gray-500 font-medium">No areas available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {areas.map((area) => (
                  <AreaCard
                    key={area.documentId}
                    name={area.name}
                    slug={area.slug}
                    imageUrl={area.imageUrl}
                    compoundCount={area.compoundCount}
                    onClick={() => onAreaClick(area)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      );
    }

    if (view === "compounds") {
      const areaName = selectedArea
        ? areas.find((a) => a.slug === selectedArea)?.name || "Area"
        : "All Compounds";

      return (
        <>
          <div className="bg-linear-to-r from-[#2D3748] to-[#4A5568] p-5 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl text-white">{areaName}</h2>
              <p className="text-xs text-gray-300 mt-1">
                {filteredCompounds.length} compounds available
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <X size={22} />
            </button>
          </div>

          {selectedArea && (
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
              <button
                onClick={onBackClick}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                ← Back to Areas
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-5 py-3">
            {filteredCompounds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🏢</span>
                </div>
                <p className="text-gray-500 font-medium">
                  No compounds in this area
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCompounds
                  .sort((a, b) => {
                    // Sort by area name first, then by compound name
                    const areaCompare = (a.area || "").localeCompare(
                      b.area || ""
                    );
                    if (areaCompare !== 0) return areaCompare;
                    return (a.name || "").localeCompare(b.name || "");
                  })
                  .map((compound) => (
                    <CompoundCard
                      key={compound.documentId}
                      name={compound.name}
                      slug={compound.slug}
                      imageUrl={compound.imageUrl}
                      price={compound.startPrice}
                      developer={compound.developer}
                      location={compound.area}
                      isNew={compound.isNewLaunch}
                      isTrending={compound.isTrendingProject}
                      onClick={() => onCompoundClick(compound)}
                    />
                  ))}
              </div>
            )}
          </div>
        </>
      );
    }

    if (view === "details" && selectedCompoundData) {
      return (
        <div className="flex flex-col h-full">
          <div className="bg-linear-to-r from-[#2D3748] to-[#4A5568] px-5 py-3 flex justify-between items-center">
            <h2 className="font-bold text-base text-white">Compound Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <CompoundDetails
              compound={{
                name: selectedCompoundData.name,
                slug: selectedCompoundData.slug,
                imageUrl: selectedCompoundData.imageUrl,
                developer: selectedCompoundData.developer
                  ? {
                      name: selectedCompoundData.developer,
                      logo: selectedCompoundData.developerLogo,
                    }
                  : null,
                developerPrice: selectedCompoundData.startPrice,
                resalePrice: null, // Can be calculated from properties if needed
              }}
              properties={filteredProperties}
              onBackClick={onBackClick}
              onPropertyClick={onPropertyClick}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Side Toggle Tab - Always visible */}
        <button
          onClick={() => {
            if (isOpen) {
              onClose();
            } else {
              const event = new CustomEvent("openDrawer");
              window.dispatchEvent(event);
            }
          }}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-linear-to-r from-[#2D3748] to-[#4A5568] text-white px-3 py-6 rounded-r-xl shadow-lg hover:shadow-xl transition-all group cursor-pointer"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-sm font-semibold tracking-wider group-hover:scale-110 transition-transform inline-block">
            {view === "areas" && "AREAS"}
            {view === "compounds" && "COMPOUNDS"}
            {view === "details" && "DETAILS"}
          </span>
        </button>

        <div className="flex flex-col h-full">{renderContent()}</div>
      </div>
    </>
  );
}
