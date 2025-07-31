'use client';

import React from "react";
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

// Prevent server-side rendering for map component
const DynamicMap = dynamic(() => Promise.resolve(GoogleMap), {
  ssr: false
});

// Fort polygons with precise coordinates
const FORT_POLYGONS = {
  "Torna Fort Trek": [
    { lat: 18.2795, lng: 73.6190 },
    { lat: 18.2800, lng: 73.6210 },
    { lat: 18.2798, lng: 73.6235 },
    { lat: 18.2790, lng: 73.6255 },
    { lat: 18.2775, lng: 73.6265 },
    { lat: 18.2755, lng: 73.6270 },
    { lat: 18.2735, lng: 73.6265 },
    { lat: 18.2720, lng: 73.6250 },
    { lat: 18.2715, lng: 73.6230 },
    { lat: 18.2718, lng: 73.6210 },
    { lat: 18.2725, lng: 73.6190 },
    { lat: 18.2740, lng: 73.6180 },
    { lat: 18.2760, lng: 73.6175 },
    { lat: 18.2780, lng: 73.6180 },
    { lat: 18.2795, lng: 73.6190 }
  ]
};

interface TerrainView3DProps {
  center: { lat: number; lng: number };
  zoom: number;
  name: string;
  onBack?: () => void;
}

function TerrainView3D({ center, zoom, name, onBack }: TerrainView3DProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['geometry']
  });

  // Prevent SSR issues
  if (typeof window === "undefined") {
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white hover:bg-gray-100"
          onClick={() => onBack?.()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to 2D View
        </Button>
      </div>
      <DynamicMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        options={{
          mapTypeId: "satellite",
          tilt: 45,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true
        }}
      >
        {name && FORT_POLYGONS[name as keyof typeof FORT_POLYGONS] && (
          <Polygon
            paths={FORT_POLYGONS[name as keyof typeof FORT_POLYGONS]}
            options={{
              fillColor: "#4a5568",
              fillOpacity: 0.1,
              strokeColor: "#000000",
              strokeOpacity: 1,
              strokeWeight: 3,
            }}
          />
        )}
      </DynamicMap>
    </div>
  );
}

// Prevent server-side rendering
export default dynamic(() => Promise.resolve(TerrainView3D), {
  ssr: false
});
