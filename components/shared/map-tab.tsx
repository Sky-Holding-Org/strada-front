"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapTabProps {
  latitude: number;
  longitude: number;
  compoundName: string;
}

export function MapTab({ latitude, longitude, compoundName }: MapTabProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/omarkhaled-177/cmhugrppq002m01sa2nkqhszv",
      center: [longitude, latitude],
      zoom: 15,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });

    map.current.on("load", () => {
      map.current?.easeTo({ pitch: 45, duration: 1500 });
    });

    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div style="
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #E3A325 0%, #d39822 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 8px 16px rgba(227, 163, 37, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        animation: bounce 2s infinite;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `;
    el.style.cursor = "pointer";

    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0) rotate(-45deg); }
        50% { transform: translateY(-10px) rotate(-45deg); }
      }
    `;
    document.head.appendChild(style);

    marker.current = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({
          offset: 35,
          className: "custom-popup",
          closeButton: false,
          maxWidth: "300px",
        }).setHTML(`
          <div style="
            padding: 16px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ">
            <h3 style="
              font-weight: 700;
              font-size: 18px;
              margin-bottom: 8px;
              color: #003344;
              line-height: 1.3;
            ">${compoundName}</h3>
            <p style="
              font-size: 14px;
              color: #666;
              margin: 0;
              display: flex;
              align-items: center;
              gap: 6px;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E3A325">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              View Location
            </p>
          </div>
        `)
      )
      .addTo(map.current);

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    return () => {
      marker.current?.remove();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, compoundName]);

  return (
    <>
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
        }
        .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
      <div
        ref={mapContainer}
        className="w-full h-[500px] rounded-xl shadow-lg border border-gray-200"
      />
    </>
  );
}
