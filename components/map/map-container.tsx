"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import { MapBadge } from "./map-badge";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const VECTOR_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || "mapbox://styles/mapbox/streets-v12";
const SATELLITE_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

// Final optimized zoom level constants
// Areas: visible from 6-9.5 (broad overview)
const AREA_MIN_ZOOM = 6;
const AREA_MAX_ZOOM = 9.5;
// Compounds: visible from 10-13 (intermediate level)
const COMPOUND_MIN_ZOOM = 10;
const COMPOUND_MAX_ZOOM = 13;
// Properties: visible from 13.5+ (detailed view)
const PROPERTY_MIN_ZOOM = 13.5;

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: any[];
}

interface MapContainerProps {
  areasGeoJSON: GeoJSONFeatureCollection;
  compoundsGeoJSON: GeoJSONFeatureCollection;
  propertiesGeoJSON: GeoJSONFeatureCollection;
  selectedArea?: string | null;
  selectedCompound?: string | null;
  onAreaClick: (area: any) => void;
  onCompoundClick: (compound: any) => void;
  onPropertyClick: (property: any) => void;
  onZoomChange?: (zoom: number) => void;
  onViewportChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
}

export function MapContainer({
  areasGeoJSON,
  compoundsGeoJSON,
  propertiesGeoJSON,
  selectedArea,
  selectedCompound,
  onAreaClick,
  onCompoundClick,
  onPropertyClick,
  onZoomChange,
  onViewportChange,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const areaBadges = useRef<mapboxgl.Marker[]>([]);
  const compoundBadges = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [basemapStyle, setBasemapStyle] = useState<"vector" | "satellite">("vector");
  const [isStyleLoading, setIsStyleLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: VECTOR_STYLE,
      center: [0, 20],
      zoom: 2,
      bearing: 0,
      pitch: 0,
      maxZoom: 14.8,
    });

    map.current.on("load", () => {
      // Fly to Cairo with animation
      map.current?.flyTo({
        center: [31.166212, 30.027782],
        zoom: 8.17,
        duration: 2500,
        essential: true,
        easing: (t) => t * (2 - t), // ease-out
      });
      setMapLoaded(true);
    });

    // Report zoom changes
    map.current.on("zoom", () => {
      if (!map.current) return;
      const zoom = map.current.getZoom();
      setCurrentZoom(zoom);
      onZoomChange?.(zoom);
    });

    //Report viewport changes (for filtering while panning)
    map.current.on("moveend", () => {
      if (!map.current || !onViewportChange) return;
      
      const bounds = map.current.getBounds();
      if (!bounds) return;
      
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    });

    // Global suppression of Mapbox AbortError warnings (development only)
    if (typeof window !== 'undefined') {
      const originalError = window.onerror;
      const originalUnhandled = window.onunhandledrejection;
      
      window.onerror = (message, source, lineno, colno, error) => {
        // Suppress Mapbox AbortError
        if (error?.name === 'AbortError' || 
            (typeof message === 'string' && (
              message.includes('signal is aborted') ||
              message.includes('AbortError')
            ))) {
          return true; // Prevent error from showing
        }
        // Call original handler for other errors
        if (originalError) {
          return originalError(message, source, lineno, colno, error);
        }
        return false;
      };

      // Also suppress unhandled promise rejections for AbortError
      window.onunhandledrejection = (event) => {
        if (event.reason?.name === 'AbortError' || 
            event.reason?.message?.includes('signal is aborted')) {
          event.preventDefault();
          return;
        }
        if (originalUnhandled) {
          originalUnhandled.call(window, event);
        }
      };
    }

    // Cleanup
    return () => {
      // Clean up markers first
      areaBadges.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Silently ignore - React StrictMode cleanup
        }
      });
      areaBadges.current = [];
      
      compoundBadges.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Silently ignore - React StrictMode cleanup
        }
      });
      compoundBadges.current = [];
      
      // Clean up map instance with error suppression
      try {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      } catch (e: any) {
        // Silently ignore AbortError during StrictMode cleanup
        if (e?.name !== 'AbortError' && !e?.message?.includes('signal is aborted')) {
          console.error('Map cleanup error:', e);
        }
      }
    };
  }, []);

  // Handle basemap switching based on zoom
  useEffect(() => {
    if (!map.current || !mapLoaded || isStyleLoading) return;

    const mapInstance = map.current;

    if (currentZoom >= COMPOUND_MIN_ZOOM && basemapStyle === "vector") {
      // Switch to satellite
      setIsStyleLoading(true);
      setBasemapStyle("satellite");
      
      // Clean up custom markers before style change
      areaBadges.current.forEach((marker) => marker.remove());
      areaBadges.current = [];
      compoundBadges.current.forEach((marker) => marker.remove());
      compoundBadges.current = [];
      
      mapInstance.setStyle(SATELLITE_STYLE);
      
      // Re-add layers after style loads
      mapInstance.once("style.load", () => {
        setIsStyleLoading(false);
        addAllLayers();
      });
    } else if (currentZoom < COMPOUND_MIN_ZOOM && basemapStyle === "satellite") {
      // Switch back to vector
      setIsStyleLoading(true);
      setBasemapStyle("vector");
      
      // Clean up custom markers before style change
      areaBadges.current.forEach((marker) => marker.remove());
      areaBadges.current = [];
      compoundBadges.current.forEach((marker) => marker.remove());
      compoundBadges.current = [];
      
      mapInstance.setStyle(VECTOR_STYLE);
      
      // Re-add layers after style loads
      mapInstance.once("style.load", () => {
        setIsStyleLoading(false);
        addAllLayers();
      });
    }
  }, [currentZoom, basemapStyle, mapLoaded, isStyleLoading]);

  // Function to add all layers (called after style changes)
  const addAllLayers = useCallback(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    // Remove existing layers first (must happen before removing sources)
    if (mapInstance.getLayer("area-fill")) mapInstance.removeLayer("area-fill");
    if (mapInstance.getLayer("property-markers")) mapInstance.removeLayer("property-markers");

    // Now remove sources (after layers are removed)
    if (mapInstance.getSource("areas")) mapInstance.removeSource("areas");
    if (mapInstance.getSource("compounds")) mapInstance.removeSource("compounds");
    if (mapInstance.getSource("properties")) mapInstance.removeSource("properties");

    // Add area source
    if (!mapInstance.getSource("areas")) {
      mapInstance.addSource("areas", {
        type: "geojson",
        data: areasGeoJSON,
      });
    }

    // Add compound source
    if (!mapInstance.getSource("compounds")) {
      mapInstance.addSource("compounds", {
        type: "geojson",
        data: compoundsGeoJSON,
      });
    }

    // Add property source
    if (!mapInstance.getSource("properties")) {
      mapInstance.addSource("properties", {
        type: "geojson",
        data: propertiesGeoJSON,
      });
    }

    // Add area fill layer (transparent, only for click interaction)
    if (!mapInstance.getLayer("area-fill")) {
      mapInstance.addLayer({
        id: "area-fill",
        type: "fill",
        source: "areas",
        paint: {
          "fill-color": "rgba(59, 130, 246, 0)",
          "fill-outline-color": "rgba(59, 130, 246, 0)",
        },
        minzoom: AREA_MIN_ZOOM,
        maxzoom: AREA_MAX_ZOOM,
      });
    }

    // Add property layer with pin icons
    // First, load a pin icon (we'll use a simple SVG-based marker)
    if (!mapInstance.hasImage('property-pin')) {
      const pinSvg = `
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="#10b981"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
        </svg>
      `;
      const img = new Image(32, 40);
      img.onload = () => mapInstance.addImage('property-pin', img);
      img.src = 'data:image/svg+xml;base64,' + btoa(pinSvg);
    }

    if (!mapInstance.getLayer("property-markers")) {
      mapInstance.addLayer({
        id: "property-markers",
        type: "symbol",
        source: "properties",
        minzoom: 13.5,
        maxzoom: 14.8,
        layout: {
          "icon-image": "property-pin",
          "icon-size": 0.8,
          "icon-anchor": "bottom",
          "icon-allow-overlap": true,
        },
      });
    }

    // Create badge markers for areas and compounds
    createBadgeMarkers();

    setupEventListeners();
  }, [areasGeoJSON, compoundsGeoJSON, propertiesGeoJSON]);

  // Function to create badge markers
  const createBadgeMarkers = useCallback(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    // Clean up existing area badges
    areaBadges.current.forEach((marker) => marker.remove());
    areaBadges.current = [];

    // Clean up existing compound badges
    compoundBadges.current.forEach((marker) => marker.remove());
    compoundBadges.current = [];

    // Create area badges
    areasGeoJSON.features.forEach((feature) => {
      const areaProps = { ...feature.properties };
      const { name, centerLng, centerLat } = areaProps;
      if (!centerLng || !centerLat) return;

      const badgeEl = document.createElement("div");
      badgeEl.style.cursor = "pointer";
      badgeEl.style.pointerEvents = "auto";
      const root = createRoot(badgeEl);
      root.render(<MapBadge name={name} type="area" />);

      badgeEl.addEventListener("click", (e) => {
        e.stopPropagation();
        onAreaClick(areaProps);
        mapInstance.flyTo({
          center: [centerLng, centerLat],
          zoom: 11.5,
          duration: 1200,
          essential: true,
          easing: (t) => t * (2 - t),
        });
      });

      const marker = new mapboxgl.Marker({
        element: badgeEl,
        anchor: "center",
        offset: [0, 0],
      })
        .setLngLat([centerLng, centerLat])
        .addTo(mapInstance);

      areaBadges.current.push(marker);

      const updateVisibility = () => {
        const zoom = mapInstance.getZoom();
        const shouldShow = zoom >= AREA_MIN_ZOOM && zoom < AREA_MAX_ZOOM;
        badgeEl.style.display = shouldShow ? "block" : "none";
      };

      updateVisibility();
      mapInstance.on("zoom", updateVisibility);
    });

    // Create compound pin markers
    compoundsGeoJSON.features.forEach((feature) => {
      const compoundProps = { ...feature.properties };
      const coords = feature.geometry.coordinates as [number, number];

      const pinEl = document.createElement("div");
      pinEl.innerHTML = `
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="#2D3748"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
        </svg>
      `;
      pinEl.style.cursor = "pointer";
      pinEl.style.pointerEvents = "auto";
      pinEl.style.width = "32px";
      pinEl.style.height = "40px";

      pinEl.addEventListener("click", (e) => {
        e.stopPropagation();
        onCompoundClick(compoundProps);
        map.current?.flyTo({
          center: coords,
          zoom: 14.5,
          duration: 1000,
          essential: true,
          easing: (t) => t * (2 - t),
        });
      });

      const marker = new mapboxgl.Marker({
        element: pinEl,
        anchor: "bottom",
        offset: [0, 0],
      })
        .setLngLat(coords)
        .addTo(mapInstance);

      compoundBadges.current.push(marker);

      const updateVisibility = () => {
        const zoom = mapInstance.getZoom();
        const shouldShow = zoom >= COMPOUND_MIN_ZOOM && zoom < COMPOUND_MAX_ZOOM;
        pinEl.style.display = shouldShow ? "block" : "none";
      };

      updateVisibility();
      mapInstance.on("zoom", updateVisibility);
    });
  }, [areasGeoJSON, compoundsGeoJSON, onCompoundClick, onAreaClick]);

  // Setup click and hover event listeners
  const setupEventListeners = useCallback(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    // Area click
    mapInstance.on("click", "area-fill", (e) => {
      if (!e.features?.[0] || !e.features[0].properties) return;
      const props = e.features[0].properties;
      if (!props.centerLng || !props.centerLat) return;
      
      onAreaClick(props);
      
      // Zoom to area
      mapInstance.flyTo({
        center: [props.centerLng, props.centerLat],
        zoom: 12,
        duration: 1500,
      });
    });

    // Property click
    mapInstance.on("click", "property-markers", (e) => {
      if (!e.features?.[0] || !e.features[0].properties) return;
      const props = e.features[0].properties;
      onPropertyClick(props);
    });

    // Cursor pointer on hover
    ["area-fill", "property-markers"].forEach((layer) => {
      mapInstance.on("mouseenter", layer, () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });
      mapInstance.on("mouseleave", layer, () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    });
  }, [onAreaClick, onPropertyClick]);

  // Add layers when map loads
  useEffect(() => {
    if (!mapLoaded) return;
    addAllLayers();
  }, [mapLoaded, addAllLayers]);

  // Update sources when data changes (but not during style loading)
  useEffect(() => {
    if (!map.current || !mapLoaded || isStyleLoading) return;
    
    const areaSource = map.current.getSource("areas") as mapboxgl.GeoJSONSource;
    if (areaSource) {
      areaSource.setData(areasGeoJSON);
    }
  }, [areasGeoJSON, mapLoaded, isStyleLoading]);

  useEffect(() => {
    if (!map.current || !mapLoaded || isStyleLoading) return;
    
    const compoundSource = map.current.getSource("compounds") as mapboxgl.GeoJSONSource;
    if (compoundSource) {
      compoundSource.setData(compoundsGeoJSON);
    }
  }, [compoundsGeoJSON, mapLoaded, isStyleLoading]);

  useEffect(() => {
    if (!map.current || !mapLoaded || isStyleLoading) return;
    
    const propertySource = map.current.getSource("properties") as mapboxgl.GeoJSONSource;
    if (propertySource) {
      propertySource.setData(propertiesGeoJSON);
    }
  }, [propertiesGeoJSON, mapLoaded, isStyleLoading]);

  // Fly to selected area
  useEffect(() => {
    if (!map.current || !selectedArea || !areasGeoJSON.features.length) return;
    
    const area = areasGeoJSON.features.find(
      (f) => f.properties.slug === selectedArea
    );
    
    if (area) {
      map.current.flyTo({
        center: [area.properties.centerLng, area.properties.centerLat],
        zoom: 12,
        duration: 1500,
      });
    }
  }, [selectedArea, areasGeoJSON]);

  // Fly to selected compound
  useEffect(() => {
    if (!map.current || !selectedCompound || !compoundsGeoJSON.features.length) return;
    
    const compound = compoundsGeoJSON.features.find(
      (f) => f.properties.slug === selectedCompound
    );
    
    if (compound) {
      const coords = compound.geometry.coordinates;
      map.current.flyTo({
        center: coords,
        zoom: 15,
        duration: 1500,
      });
    }
  }, [selectedCompound, compoundsGeoJSON]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
