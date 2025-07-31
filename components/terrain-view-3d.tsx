'use client';

import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic'

// Prevent server-side rendering for map component
const DynamicMap = dynamic(() => Promise.resolve(GoogleMap), {
  ssr: false
});

// Fort polygons with precise coordinates
const FORT_POLYGONS = {
  "Sinhagad Fort Trek": [
    { lat: 18.3672, lng: 73.7537 },
    { lat: 18.3667, lng: 73.7547 },
    { lat: 18.3662, lng: 73.7557 },
    { lat: 18.3660, lng: 73.7565 },
    { lat: 18.3655, lng: 73.7570 },
    { lat: 18.3647, lng: 73.7572 },
    { lat: 18.3640, lng: 73.7567 },
    { lat: 18.3635, lng: 73.7557 },
    { lat: 18.3632, lng: 73.7547 },
    { lat: 18.3637, lng: 73.7537 },
    { lat: 18.3645, lng: 73.7530 },
    { lat: 18.3655, lng: 73.7527 },
    { lat: 18.3665, lng: 73.7530 },
    { lat: 18.3672, lng: 73.7537 },
  ],
  "Rajgad Fort Trek": [
    { lat: 18.2476, lng: 73.6807 },
    { lat: 18.2478, lng: 73.6817 },
    { lat: 18.2477, lng: 73.6827 },
    { lat: 18.2472, lng: 73.6832 },
    { lat: 18.2465, lng: 73.6835 },
    { lat: 18.2457, lng: 73.6837 },
    { lat: 18.2450, lng: 73.6832 },
    { lat: 18.2445, lng: 73.6822 },
    { lat: 18.2447, lng: 73.6812 },
    { lat: 18.2452, lng: 73.6807 },
    { lat: 18.2460, lng: 73.6802 },
    { lat: 18.2470, lng: 73.6802 },
    { lat: 18.2476, lng: 73.6807 },
  ],
  "Torna Fort Trek": [
    { lat: 18.2771, lng: 73.6207 },
    { lat: 18.2775, lng: 73.6215 },
    { lat: 18.2777, lng: 73.6222 },
    { lat: 18.2775, lng: 73.6230 },
    { lat: 18.2772, lng: 73.6237 },
    { lat: 18.2765, lng: 73.6242 },
    { lat: 18.2757, lng: 73.6240 },
    { lat: 18.2747, lng: 73.6232 },
    { lat: 18.2746, lng: 73.6222 },
    { lat: 18.2750, lng: 73.6212 },
    { lat: 18.2755, lng: 73.6207 },
    { lat: 18.2763, lng: 73.6205 },
    { lat: 18.2771, lng: 73.6207 },
  ],
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

type Props = {
  center: { lat: number; lng: number };
  zoom?: number;
  name?: string;
};

export default function TerrainView3D({ center, zoom = 18.5, name }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [heading, setHeading] = useState(0);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
  });

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const map = mapRef.current;
      
      // Initialize 3D view
      map.setTilt(67.5);
      map.setHeading(45);

      // Rotate view slowly
      const interval = setInterval(() => {
        setHeading(prev => (prev + 5) % 360);
        map.setHeading(heading);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoaded, heading]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          mapTypeId: "satellite",
          tilt: 67.5,
          heading: heading,
          gestureHandling: "greedy",
          zoomControl: true,
          rotateControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: ["roadmap", "satellite", "terrain"],
          },
        }}
        onLoad={(map) => {
          mapRef.current = map;
          map.setTilt(67.5);
          map.setHeading(45);
        }}
      >
        {/* Highlight the fort area with polygon */}
        {name && FORT_POLYGONS[name as keyof typeof FORT_POLYGONS] && (
          <Polygon
            paths={FORT_POLYGONS[name as keyof typeof FORT_POLYGONS]}
            options={{
              fillColor: "transparent",
              strokeColor: "#ff00cc",
              strokeWeight: 8,
              strokeOpacity: 1,
              fillOpacity: 0,
              zIndex: 20,
            }}
          />
        )}
      </GoogleMap>
      
      <div className="absolute top-4 left-4">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => {
            const selectedTrail = JSON.parse(localStorage.getItem("selectedTrail") || "{}");
            delete selectedTrail.show3D;
            localStorage.setItem("selectedTrail", JSON.stringify(selectedTrail));
            window.location.reload();
          }}
          className="bg-white shadow-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Map
        </Button>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded shadow text-sm">
        Tip: Use two fingers or Ctrl + Mouse to adjust the 3D view
      </div>
    </div>
  );
}
