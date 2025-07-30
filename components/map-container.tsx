"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Navigation, Plus, Route } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MapContainerProps {
  selectedTrail: any
  userLocation: { lat: number; lng: number } | null
  onHazardReport: (location: { lat: number; lng: number }) => void
  onDirectionsClick?: (trail: any) => void
}

export function MapContainer({ selectedTrail, userLocation, onHazardReport, onDirectionsClick }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // Use 'any' to avoid TypeScript errors when google.maps types are not available
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isReportMode, setIsReportMode] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [selectedTrailInfo, setSelectedTrailInfo] = useState<any>(null)
  const [selectedTrailCentroid, setSelectedTrailCentroid] = useState<{ lat: number; lng: number } | null>(null)

  // More precise polygons for each fort (from satellite/trekker maps)
  const trails = [
    {
      id: 1,
      name: "Sinhagad Fort Trek",
      riskLevel: "moderate",
      path: [
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
        { lat: 18.3675, lng: 73.7545 },
        { lat: 18.3670, lng: 73.7555 },
        { lat: 18.3665, lng: 73.7562 },
        { lat: 18.3658, lng: 73.7568 },
        { lat: 18.3648, lng: 73.7570 },
        { lat: 18.3642, lng: 73.7562 },
        { lat: 18.3638, lng: 73.7550 },
        { lat: 18.3640, lng: 73.7540 },
        { lat: 18.3648, lng: 73.7532 },
        { lat: 18.3658, lng: 73.7530 },
        { lat: 18.3668, lng: 73.7532 },
        { lat: 18.3672, lng: 73.7537 },
      ],
    },
    {
      id: 2,
      name: "Rajgad Fort Trek",
      riskLevel: "high",
      path: [
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
        { lat: 18.2479, lng: 73.6812 },
        { lat: 18.2475, lng: 73.6820 },
        { lat: 18.2468, lng: 73.6828 },
        { lat: 18.2458, lng: 73.6830 },
        { lat: 18.2452, lng: 73.6822 },
        { lat: 18.2455, lng: 73.6812 },
        { lat: 18.2462, lng: 73.6808 },
        { lat: 18.2470, lng: 73.6809 },
        { lat: 18.2476, lng: 73.6807 },
      ],
    },
    {
      id: 3,
      name: "Torna Fort Trek",
      riskLevel: "low",
      path: [
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
        { lat: 18.2778, lng: 73.6212 },
        { lat: 18.2776, lng: 73.6220 },
        { lat: 18.2770, lng: 73.6230 },
        { lat: 18.2762, lng: 73.6235 },
        { lat: 18.2755, lng: 73.6232 },
        { lat: 18.2750, lng: 73.6222 },
        { lat: 18.2752, lng: 73.6212 },
        { lat: 18.2760, lng: 73.6208 },
        { lat: 18.2771, lng: 73.6207 }
      ],
      features: [
        {
          name: "Entrance",
          color: "#e57373",
          path: [
            { lat: 18.2771, lng: 73.6207 },
            { lat: 18.2778, lng: 73.6212 },
            { lat: 18.2776, lng: 73.6220 },
            { lat: 18.2770, lng: 73.6230 }
          ]
        },
        {
          name: "Main Fort",
          color: "#81c784",
          path: [
            { lat: 18.2762, lng: 73.6235 },
            { lat: 18.2755, lng: 73.6232 },
            { lat: 18.2750, lng: 73.6222 },
            { lat: 18.2752, lng: 73.6212 },
            { lat: 18.2760, lng: 73.6208 }
          ]
        },
        {
          name: "East Bastion",
          color: "#64b5f6",
          path: [
            { lat: 18.2775, lng: 73.6215 },
            { lat: 18.2777, lng: 73.6222 },
            { lat: 18.2775, lng: 73.6230 }
          ]
        },
        {
          name: "West Residential Area",
          color: "#ffd54f",
          path: [
            { lat: 18.2765, lng: 73.6242 },
            { lat: 18.2757, lng: 73.6240 },
            { lat: 18.2747, lng: 73.6232 }
          ]
        },
        {
          name: "Southern Entry",
          color: "#ba68c8",
          path: [
            { lat: 18.2746, lng: 73.6222 },
            { lat: 18.2750, lng: 73.6212 }
          ]
        },
        {
          name: "Fort wall",
          color: "#4dd0e1",
          path: [
            { lat: 18.2763, lng: 73.6205 },
            { lat: 18.2771, lng: 73.6207 },
            { lat: 18.2778, lng: 73.6212 }
          ]
        }
      ]
    },
  ];

  // Sample hazard data
  const hazards = [
    {
      id: 1,
      lat: 18.369,
      lng: 73.759,
      type: "landslide",
      severity: "high",
      description: "Recent landslide blocking trail",
      reportedAt: new Date(),
    },
    {
      id: 2,
      lat: 18.247,
      lng: 73.68,
      type: "slippery_rock",
      severity: "moderate",
      description: "Wet rocks after recent rainfall",
      reportedAt: new Date(),
    },
  ]

  // Check if Google Maps API is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      setIsGoogleLoaded(true);
    } else {
      setIsGoogleLoaded(false);
    }
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current) return;

    // Initialize Google Map
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 }, // Pune coordinates
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

    setMap(googleMap);

    // Add click listener for hazard reporting
    googleMap.addListener("click", (event: any) => {
      if (isReportMode && event.latLng) {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        onHazardReport(location);
        setIsReportMode(false);
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, [isReportMode, onHazardReport, isGoogleLoaded]);

  // Utility to compute centroid of a polygon
  function getCentroid(points: { lat: number; lng: number }[]): { lat: number; lng: number } {
    let lat = 0, lng = 0;
    for (const p of points) {
      lat += p.lat;
      lng += p.lng;
    }
    return { lat: lat / points.length, lng: lng / points.length };
  }

  // Watch for selectedTrail changes and update map/centroid
  useEffect(() => {
    if (!map || !isGoogleLoaded) return;

    // Find the selected trail info
    const trail = selectedTrail
      ? trails.find((t) => t.name === selectedTrail.name || t.id === selectedTrail.id)
      : null;
    setSelectedTrailInfo(trail || null);
    setSelectedTrailCentroid(trail ? getCentroid(trail.path) : null);

    // Clear existing markers and overlays
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers: any[] = [];

    // Only draw and highlight the selected trail
    if (trail) {
      // If Torna Fort and features exist, draw each feature polygon
      if (trail.name === "Torna Fort Trek" && Array.isArray(trail.features)) {
        let featureBounds = new window.google.maps.LatLngBounds();
        trail.features.forEach((feature, idx) => {
          if (feature.path.length >= 3) {
            // Draw as polygon
            const featurePolygon = new window.google.maps.Polygon({
              paths: feature.path,
              strokeColor: feature.color,
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: feature.color,
              fillOpacity: 0.45,
              zIndex: 21,
            });
            featurePolygon.setMap(map);
            newMarkers.push(featurePolygon);
            feature.path.forEach((pt) => featureBounds.extend(new window.google.maps.LatLng(pt.lat, pt.lng)));
            // Optionally, add a label at the centroid of each feature
            const centroid = getCentroid(feature.path);
            const labelMarker = new window.google.maps.Marker({
              position: centroid,
              map: map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 0.1, // invisible, just for label
                fillOpacity: 0,
                strokeWeight: 0,
              },
              label: {
                text: feature.name,
                color: feature.color,
                fontWeight: 'bold',
                fontSize: '12px',
              },
            });
            newMarkers.push(labelMarker);
            // DEBUG: Add a visible marker at centroid
            const debugMarker = new window.google.maps.Marker({
              position: centroid,
              map: map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: feature.color,
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#000',
              },
              title: `DEBUG: ${feature.name}`,
            });
            newMarkers.push(debugMarker);
            // DEBUG: Log feature
            console.log('Drawing feature polygon:', feature.name, feature.path);
          } else if (feature.path.length === 2) {
            // Draw as polyline for 2-point features
            const featureLine = new window.google.maps.Polyline({
              path: feature.path,
              strokeColor: feature.color,
              strokeOpacity: 1,
              strokeWeight: 4,
              zIndex: 22,
            });
            featureLine.setMap(map);
            newMarkers.push(featureLine);
            feature.path.forEach((pt) => featureBounds.extend(new window.google.maps.LatLng(pt.lat, pt.lng)));
            // Optionally, add a label at the midpoint
            const midLat = (feature.path[0].lat + feature.path[1].lat) / 2;
            const midLng = (feature.path[0].lng + feature.path[1].lng) / 2;
            const labelMarker = new window.google.maps.Marker({
              position: { lat: midLat, lng: midLng },
              map: map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 0.1,
                fillOpacity: 0,
                strokeWeight: 0,
              },
              label: {
                text: feature.name,
                color: feature.color,
                fontWeight: 'bold',
                fontSize: '12px',
              },
            });
            newMarkers.push(labelMarker);
            // DEBUG: Add a visible marker at midpoint
            const debugMarker = new window.google.maps.Marker({
              position: { lat: midLat, lng: midLng },
              map: map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: feature.color,
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#000',
              },
              title: `DEBUG: ${feature.name}`,
            });
            newMarkers.push(debugMarker);
            // DEBUG: Log feature
            console.log('Drawing feature polyline:', feature.name, feature.path);
          }
        });
        // Fit map to all feature overlays
        if (!featureBounds.isEmpty()) {
          map.fitBounds(featureBounds, { padding: 100 });
        }
        // Do NOT add centroid marker or pan/zoom for Torna Fort
      } else {
        // Draw polygon with bold border and subtle fill (default for other forts)
        const polygon = new window.google.maps.Polygon({
          paths: trail.path,
          strokeColor: '#ff00cc',
          strokeOpacity: 1,
          strokeWeight: 4,
          fillColor: '#ff00cc',
          fillOpacity: 0.2,
          zIndex: 20,
        });
        polygon.setMap(map);
        newMarkers.push(polygon);

        // Add outer glow effect
        const outerGlow = new window.google.maps.Polygon({
          paths: trail.path,
          strokeColor: '#ffffff',
          strokeOpacity: 0.8,
          strokeWeight: 8,
          fillOpacity: 0,
          zIndex: 19,
        });
        outerGlow.setMap(map);
        newMarkers.push(outerGlow);

        // Marker at centroid
        const centroid = getCentroid(trail.path);
        const marker = new window.google.maps.Marker({
          position: centroid,
          map: map,
          title: `${trail.name} (Centroid)` + `\nLat: ${centroid.lat.toFixed(6)}, Lng: ${centroid.lng.toFixed(6)}`,
          label: {
            text: `${centroid.lat.toFixed(5)}, ${centroid.lng.toFixed(5)}`,
            color: '#ff00cc',
            fontWeight: 'bold',
            fontSize: '14px',
          },
          icon: {
            path: "M2,22 L2,12 L6,12 L6,8 L10,8 L10,12 L14,12 L14,8 L18,8 L18,12 L22,12 L22,22 L16,22 L16,16 L8,16 L8,22 Z M8,22 L8,18 L16,18 L16,22 Z", // Simple fort/castle SVG path
            scale: 1.5,
            fillColor: '#8B5C2A', // Fort brown
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#3E2723', // Darker outline
          },
        });
        newMarkers.push(marker);

        // Zoom and center to centroid with smooth animation
        map.panTo(centroid);
        map.setZoom(17);
        // Add bounds padding for better view
        const bounds = new window.google.maps.LatLngBounds();
        trail.path.forEach((point: { lat: number; lng: number }) => {
          bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
        });
        map.fitBounds(bounds, { padding: 100 });
      }

      // Add hazard markers with pulsing effect
      hazards.forEach((hazard) => {
        const hazardMarker = new window.google.maps.Marker({
          position: { lat: hazard.lat, lng: hazard.lng },
          map: map,
          title: hazard.description,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 10,
            fillColor: getSeverityColor(hazard.severity),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#fff',
          },
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${hazard.type.replace('_', ' ')}</h3>
              <p class="text-sm text-gray-600">${hazard.description}</p>
              <p class="text-xs text-gray-500 mt-1">
                Reported: ${hazard.reportedAt.toLocaleDateString()}
              </p>
            </div>
          `,
        });
        hazardMarker.addListener('click', () => {
          infoWindow.open(map, hazardMarker);
        });
        newMarkers.push(hazardMarker);
      });

      // Add user location marker
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: '#ffffff',
          },
        });
        newMarkers.push(userMarker);
      }

      setMarkers(newMarkers);
    }
  }, [map, userLocation, isGoogleLoaded, selectedTrail]);

  useEffect(() => {
    if (!map || !userLocation) return;

    const marker = new window.google.maps.Marker({
      position: userLocation,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#fff",
      },
      title: "Your Location",
      zIndex: 9999,
    });

    return () => {
      marker.setMap(null);
    };
  }, [userLocation, map]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "#22c55e"
      case "moderate":
        return "#f59e0b"
      case "high":
        return "#ef4444"
      case "extreme":
        return "#7c2d12"
      default:
        return "#6b7280"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "#fbbf24"
      case "moderate":
        return "#f97316"
      case "high":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  if (!isGoogleLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {/* Add CSS for marker pulse and glow */}
      <style>{`
        .gm-style .gm-style-mtc img[src*="circle"],
        .gm-style img[src*="circle"],
        .gm-style img[src*="backward_closed_arrow"] {
          filter: drop-shadow(0 0 8px #ff00cc) drop-shadow(0 0 16px #fff);
          animation: pulse-glow 1.5s infinite alternate;
        }
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 8px #ff00cc) drop-shadow(0 0 16px #fff); }
          100% { filter: drop-shadow(0 0 24px #ff00cc) drop-shadow(0 0 32px #fff); }
        }
      `}</style>

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <Button
          onClick={() => setIsReportMode(!isReportMode)}
          variant={isReportMode ? "destructive" : "default"}
          size="sm"
          className="shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isReportMode ? "Cancel Report" : "Report Hazard"}
        </Button>

        {userLocation && (
          <Button
            onClick={() => {
              if (map && userLocation) {
                map.setCenter(userLocation)
                map.setZoom(15)
              }
            }}
            variant="outline"
            size="sm"
            className="shadow-lg bg-white"
          >
            <Navigation className="h-4 w-4 mr-2" />
            My Location
          </Button>
        )}

        {selectedTrail && onDirectionsClick && (
          <Button
            onClick={() => onDirectionsClick(selectedTrail)}
            variant="outline"
            size="sm"
            className="shadow-lg bg-white"
          >
            <Route className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        )}
      </div>

      {/* Show selected trail info and coordinates */}
      {selectedTrailInfo && selectedTrailCentroid && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-fuchsia-400 z-30">
          <h3 className="text-sm font-semibold mb-2 text-fuchsia-700">{selectedTrailInfo.name}</h3>
          <div className="text-xs text-gray-700">Centroid:</div>
          <div className="font-mono text-xs text-fuchsia-700">
            Lat: {selectedTrailCentroid.lat.toFixed(6)}<br />
            Lng: {selectedTrailCentroid.lng.toFixed(6)}
          </div>
          <div className="mt-2 text-xs text-gray-500">Area highlighted on map</div>
        </div>
      )}

      {/* Risk Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h3 className="text-sm font-semibold mb-2">Risk Levels</h3>
        <div className="space-y-1">
          {[
            { level: "Low", color: "#22c55e" },
            { level: "Moderate", color: "#f59e0b" },
            { level: "High", color: "#ef4444" },
            { level: "Extreme", color: "#7c2d12" },
          ].map(({ level, color }) => (
            <div key={level} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {isReportMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="destructive" className="animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Click on map to report hazard
          </Badge>
        </div>
      )}
    </div>
  );
}
