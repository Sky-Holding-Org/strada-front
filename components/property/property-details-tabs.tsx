"use client";

import { useState } from "react";
import { MapPinned, LayoutGrid, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapTab } from "@/components/shared/map-tab";
import { MasterPlanTab } from "@/components/shared/master-plan-tab";
import { FloorPlanTab } from "./floor-plan-tab";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PropertyDetailsTabsProps {
  locationCoords: { lat: number; lng: number };
  propertyName: string;
  masterPlanUrl?: string;
  floorPlanImages: Array<{ url: string }>;
}

export function PropertyDetailsTabs({
  locationCoords,
  propertyName,
  masterPlanUrl,
  floorPlanImages,
}: PropertyDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "map" | "masterplan" | "floorplan" | null
  >(null);

  return (
    <>
      <div className="flex w-1/5 gap-4">
        <Button
          variant="ghost"
          size="default"
          onClick={() => setActiveTab("map")}
          className="flex-1 h-24 flex-col gap-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <MapPinned className="size-8" />
          <span className="xl font-bold">View on Map</span>
        </Button>
        {masterPlanUrl && (
          <Button
            variant="ghost"
            size="default"
            onClick={() => setActiveTab("masterplan")}
            className="flex-1 h-24 flex-col gap-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <LayoutGrid className="size-8" />
            <span className="xl font-bold">Master Plan</span>
          </Button>
        )}
        {floorPlanImages.length > 0 && (
          <Button
            variant="ghost"
            size="default"
            onClick={() => setActiveTab("floorplan")}
            className="flex-1 h-24 flex-col gap-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <ImageIcon className="size-8" />
            <span className="xl font-bold">Floor Plan</span>
          </Button>
        )}
      </div>

      <Sheet open={activeTab !== null} onOpenChange={() => setActiveTab(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {activeTab === "map" && "Location Map"}
              {activeTab === "masterplan" && "Master Plan"}
              {activeTab === "floorplan" && "Floor Plan"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {activeTab === "map" && (
              <MapTab
                latitude={locationCoords.lat}
                longitude={locationCoords.lng}
                compoundName={propertyName}
              />
            )}
            {activeTab === "masterplan" && masterPlanUrl && (
              <MasterPlanTab planImageUrl={masterPlanUrl} />
            )}
            {activeTab === "floorplan" && floorPlanImages.length > 0 && (
              <FloorPlanTab images={floorPlanImages} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
