'use client';

import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon, Marker, StreetViewPanorama } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Eye, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { STREET_VIEW_POSITIONS, type StreetViewPosition } from "./street-view-positions";

/**
 * Advanced3DMap component
 * Usage:
 * <Advanced3DMap center={{ lat: ... }} zoom={18} name="Torna Fort Trek" />
 * - Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
 * - Renders a 3D map with terrain and buildings using WebGL Overlay View
 */

const containerStyle = {
  width: "100%",
  height: "100%",
};

type Props = {
  center: { lat: number; lng: number };
  zoom?: number;
  name?: string;
};

// More detailed polygons for each fort (approximate, based on satellite and trekker maps)
const POLYGONS = {
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
};

// Utility to compute the centroid of a polygon
function getPolygonCentroid(points: { lat: number; lng: number }[]): { lat: number; lng: number } {
  let lat = 0, lng = 0;
  for (const p of points) {
    lat += p.lat;
    lng += p.lng;
  }
  return { lat: lat / points.length, lng: lng / points.length };
}

export default function Advanced3DMap({ center, zoom = 18.5, name }: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"map" | "street">("map");
  const [isLoading, setIsLoading] = useState(false);
  const [panorama, setPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  // Get street view positions for current fort
  const streetViewPositions = name ? STREET_VIEW_POSITIONS[name as keyof typeof STREET_VIEW_POSITIONS] : null;
  const currentPosition = streetViewPositions?.[currentViewIndex];
  
  // Log for debugging
  useEffect(() => {
    if (viewMode === "street" && currentPosition) {
      console.log("Current position:", currentPosition);
      console.log("Panorama ID:", currentPosition.panoramaId);
    }
  }, [viewMode, currentPosition]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // Find the polygon for the selected fort (type-safe)
  const polygon = name && Object.prototype.hasOwnProperty.call(POLYGONS, name) ? POLYGONS[name as keyof typeof POLYGONS] : null;

  // If name is provided and polygon exists, use its centroid as the map center
  const mapCenter = polygon ? getPolygonCentroid(polygon) : center;

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    if (viewMode === "street" && currentPosition && panoramaRef.current) {
      setIsLoading(true);
      // Use the panorama ID directly if available (most reliable method)
      if (currentPosition.panoramaId) {
        console.log('Using panorama ID directly:', currentPosition.panoramaId);
        try {
          if (!panoramaRef.current) {
            console.error('Panorama ref is null');
            setIsLoading(false);
            return;
          }
          const pano = new window.google.maps.StreetViewPanorama(
            panoramaRef.current,
            {
              pano: currentPosition.panoramaId, // Use the actual panorama ID from the position
              pov: currentPosition.pov,
              zoom: 1,
              panControl: true,
              zoomControl: true,
              addressControl: false,
              linksControl: true,
              fullscreenControl: true,
              motionTracking: false,
              motionTrackingControl: false,
              visible: true,
              enableCloseButton: true
            }
          );
          setPanorama(pano);
          
          // Add event listeners for panorama status and position changes
          pano.addListener('status_changed', () => {
            if (pano.getStatus() !== google.maps.StreetViewStatus.OK) {
              console.error('Street View data not found for this location');
              setViewMode('map'); // Fall back to map view
            }
            setIsLoading(false);
          });

          pano.addListener('position_changed', () => {
            const position = pano.getPosition();
            if (position) {
              const newLatLng = {
                lat: position.lat(),
                lng: position.lng()
              };
              mapRef.current?.panTo(newLatLng);
            }
          });
        } catch (error) {
          console.error('Error creating panorama:', error);
          setViewMode('map'); // Fall back to map view
          setIsLoading(false);
          // Clean up any existing panorama
          if (panorama) {
            window.google.maps.event.clearInstanceListeners(panorama);
            panorama.setVisible(false);
            if (panoramaRef.current) {
              panoramaRef.current.innerHTML = '';
            }
            setPanorama(null);
          }
        }
      } else {
        // Create a Street View service to check if the panorama exists at the location
        const streetViewService = new window.google.maps.StreetViewService();
        
        // Check if Street View is available at the specified location
        // Use a larger radius to find nearby panoramas if the exact location doesn't have Street View data
        streetViewService.getPanorama({
          location: currentPosition.position,
          radius: 500 // Search within 500 meters to find nearby panoramas
        }, (data, status) => {
          if (status === window.google.maps.StreetViewStatus.OK && data && data.location) {
            // Street View is available, create the panorama
            if (!panoramaRef.current) {
              console.error('Panorama ref is null');
              setIsLoading(false);
              return;
            }
            const pano = new window.google.maps.StreetViewPanorama(
              panoramaRef.current,
              {
                position: data.location.latLng, // Use the exact panorama location
                pov: currentPosition.pov,
                zoom: 1,
                addressControl: false,
                linksControl: true,
                panControl: true,
                showRoadLabels: false,
                zoomControl: true,
                fullscreenControl: true,
                motionTracking: false,
                motionTrackingControl: false,
                visible: true
              }
            );
            setPanorama(pano);
            setIsLoading(false);
          } else {
            console.error('Street View data not found for this location:', status);
            // Fall back to a known working panorama ID from Pune, Maharashtra
            try {
              if (!panoramaRef.current) {
                console.error('Panorama ref is null');
                setIsLoading(false);
                return;
              }
              const fallbackPano = new window.google.maps.StreetViewPanorama(
                panoramaRef.current,
                {
                  pano: "CAoSLEFGMVFpcE1aNHRXTGFwZnVZTXdnWXRfWnVLRXVJRGRXZXJNNXRMRnRYVGhj", // Known working panorama ID
                  pov: currentPosition.pov,
                  zoom: 1,
                  addressControl: false,
                  linksControl: true,
                  panControl: true,
                  showRoadLabels: false,
                  zoomControl: true,
                  fullscreenControl: true,
                  motionTracking: false,
                  motionTrackingControl: false,
                  visible: true
                }
              );
              setPanorama(fallbackPano);
              setIsLoading(false);
            } catch (error) {
              console.error('Error creating fallback panorama:', error);
              setViewMode('map');
              setIsLoading(false);
            }
          }
        });
      }
    } else if (mapRef.current && viewMode === "map" && polygon) {
      const map = mapRef.current;
      map.panTo(mapCenter);
      map.setOptions({
        tilt: 67.5,
        heading: 45,
        mapTypeId: "hybrid",
        mapTypeControl: true,
        streetViewControl: false
      });
    }

    return () => {
      setIsLoading(false);
      if (panorama) {
        // Remove all event listeners
        window.google.maps.event.clearInstanceListeners(panorama);
        // Hide the panorama
        panorama.setVisible(false);
        // Remove the panorama from the DOM
        if (panoramaRef.current) {
          panoramaRef.current.innerHTML = '';
        }
        setPanorama(null);
      }
    };
  }, [isLoaded, viewMode, currentPosition, polygon, mapCenter, panorama]);

  if (!isLoaded) {
    return <div>Loading 3D map...</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="mr-2"
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
          <Button
            variant={viewMode === "street" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("street")}
            disabled={!streetViewPositions}
          >
            <Eye className="h-4 w-4 mr-2" />
            Street View
          </Button>
        </div>

        {viewMode === "street" && streetViewPositions && (
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
            <div className="text-sm font-medium text-center text-gray-700">
              {currentPosition?.title}
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentViewIndex((prev) => 
                  prev > 0 ? prev - 1 : streetViewPositions.length - 1
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {currentViewIndex + 1} / {streetViewPositions.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentViewIndex((prev) => 
                  prev < streetViewPositions.length - 1 ? prev + 1 : 0
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {viewMode === "street" && currentPosition ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div ref={panoramaRef} style={containerStyle} />
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                zIndex: 1000,
              }}
            >
              Loading Street View...
            </div>
          )}
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={zoom}
          onLoad={map => {
            mapRef.current = map;
          }}
          options={{
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["roadmap", "terrain", "hybrid", "satellite"],
            },
            zoomControl: true,
            maxZoom: 20,
            minZoom: 10,
            tilt: 67.5,
            heading: 45,
            streetViewControl: false
          }}
        >
          {polygon && (
            <>
              <Polygon
                paths={polygon}
                options={{
                  fillColor: "#4CAF50",
                  fillOpacity: 0.2,
                  strokeColor: "#4CAF50",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                }}
              />
              <Marker
                position={mapCenter}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4CAF50",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                }}
              />
            </>
          )}
        </GoogleMap>
      )}
    </div>
  );
}