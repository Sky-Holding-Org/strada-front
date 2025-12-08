"use client";

import { useState } from "react";
import { MapPin, LayoutGrid, X, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapTab } from "../shared/map-tab";
import { MasterPlanTab } from "../shared/master-plan-tab";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DetailsTabsProps {
  locationCoords: {
    lat: number;
    lng: number;
  };
  compoundName: string;
  masterPlanUrl?: string;
}

export function DetailsTabs({
  locationCoords,
  compoundName,
  masterPlanUrl,
}: DetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<"map" | "masterplan" | null>(null);

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
      </div>

      <Sheet open={activeTab !== null} onOpenChange={() => setActiveTab(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {activeTab === "map" ? "Location Map" : "Master Plan"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {activeTab === "map" && (
              <MapTab
                latitude={locationCoords.lat}
                longitude={locationCoords.lng}
                compoundName={compoundName}
              />
            )}
            {activeTab === "masterplan" && masterPlanUrl && (
              <MasterPlanTab planImageUrl={masterPlanUrl} />
            )}
            {!locationCoords && activeTab === "map" && (
              <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                <MapPin className="w-16 h-16 mb-4" />
                <p>Location not available</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
