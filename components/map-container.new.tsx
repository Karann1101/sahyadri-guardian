"use client"

import { useEffect, useRef, useState } from "react"

interface MapContainerProps {
  selectedTrail: any
  userLocation: { lat: number; lng: number } | null
  onHazardReport: (location: { lat: number; lng: number }) => void
}

export function MapContainer({ selectedTrail, userLocation, onHazardReport }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isReportMode, setIsReportMode] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Trail definitions
  const trails = [
    {
      id: 3,
      name: "Torna Fort Trek",
      riskLevel: "low",
      path: [
        // Larger encompassing polygon for the entire fort area
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
      ],
      features: [
        {
          name: "Main Fort Complex",
          color: "#81c784",
          path: [
            { lat: 18.2775, lng: 73.6220 },
            { lat: 18.2770, lng: 73.6230 },
            { lat: 18.2762, lng: 73.6235 },
            { lat: 18.2755, lng: 73.6230 },
            { lat: 18.2752, lng: 73.6220 },
            { lat: 18.2758, lng: 73.6212 },
            { lat: 18.2768, lng: 73.6215 }
          ]
        },
        {
          name: "Budhla Machi",
          color: "#64b5f6",
          path: [
            { lat: 18.2780, lng: 73.6225 },
            { lat: 18.2775, lng: 73.6235 },
            { lat: 18.2768, lng: 73.6240 },
            { lat: 18.2762, lng: 73.6235 },
            { lat: 18.2770, lng: 73.6225 }
          ]
        },
        {
          name: "Mangai Devi Temple Area",
          color: "#ffd54f",
          path: [
            { lat: 18.2760, lng: 73.6245 },
            { lat: 18.2752, lng: 73.6242 },
            { lat: 18.2745, lng: 73.6235 },
            { lat: 18.2750, lng: 73.6230 },
            { lat: 18.2758, lng: 73.6235 }
          ]
        }
      ]
    }
  ];

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      setIsGoogleLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 },
      zoom: 11,
      mapTypeId: window.google.maps.MapTypeId.TERRAIN,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(newMap);

    newMap.addListener("click", (event: any) => {
      if (isReportMode && event.latLng) {
        onHazardReport({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
        setIsReportMode(false);
      }
    });
  }, [isGoogleLoaded, onHazardReport, isReportMode]);

  // Handle trail selection and drawing
  useEffect(() => {
    if (!map || !isGoogleLoaded) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];

    if (selectedTrail) {
      const trail = trails.find(t => t.name === selectedTrail.name);
      if (trail) {
        // Draw main boundary first
        const mainBoundary = new window.google.maps.Polygon({
          paths: trail.path,
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 4,
          fillColor: "#4a5568",
          fillOpacity: 0.1,
          zIndex: 20,
        });
        mainBoundary.setMap(map);
        newMarkers.push(mainBoundary);

        // If it's Torna Fort, add subdivisions with reduced opacity
        if (trail.name === "Torna Fort Trek" && trail.features) {
          trail.features.forEach(feature => {
            const featurePolygon = new window.google.maps.Polygon({
              paths: feature.path,
              strokeColor: feature.color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: feature.color,
              fillOpacity: 0.2,
              zIndex: 21,
            });
            featurePolygon.setMap(map);
            newMarkers.push(featurePolygon);

            // Add feature label
            const center = feature.path.reduce(
              (acc, curr) => ({
                lat: acc.lat + curr.lat / feature.path.length,
                lng: acc.lng + curr.lng / feature.path.length,
              }),
              { lat: 0, lng: 0 }
            );

            const label = new window.google.maps.Marker({
              position: center,
              map: map,
              label: {
                text: feature.name,
                color: feature.color,
                fontSize: "12px",
                fontWeight: "bold",
              },
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 0,
              },
            });
            newMarkers.push(label);
          });
        }

        // Fit bounds to show the entire trail
        const bounds = new window.google.maps.LatLngBounds();
        trail.path.forEach(point => {
          bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
        });
        map.fitBounds(bounds, { padding: 50 });
      }
    }

    // Add user location marker if available
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
      });
      newMarkers.push(userMarker);
    }

    setMarkers(newMarkers);
  }, [map, selectedTrail, userLocation, isGoogleLoaded, markers]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      <button
        className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
        onClick={() => setIsReportMode(true)}
      >
        Report Hazard
      </button>
      {isReportMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow">
          Click on the map to mark hazard location
        </div>
      )}
    </div>
  );
}
