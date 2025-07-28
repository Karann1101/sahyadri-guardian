import React, { useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Polygon, Marker } from "@react-google-maps/api";

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

const Advanced3DMap: React.FC<Props> = ({ center, zoom = 18, name }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["webgl"],
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    // @ts-ignore
    if (window.google && window.google.maps && window.google.maps.WebGLOverlayView) {
      mapRef.current.setOptions({
        tilt: 67.5,
        heading: 0,
        mapTypeId: "hybrid",
      });
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading 3D map...</div>;

  // Find the polygon for the selected fort (type-safe)
  const polygon = name && Object.prototype.hasOwnProperty.call(POLYGONS, name) ? POLYGONS[name as keyof typeof POLYGONS] : null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={map => (mapRef.current = map)}
      options={{
        tilt: 67.5,
        heading: 0,
        mapTypeId: "hybrid",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        gestureHandling: "greedy",
        tiltControl: true,
        rotateControl: true,
      }}
    >
      {polygon && (
        <>
          {/* Enhanced polygon with vibrant border and semi-transparent fill */}
          <Polygon
            path={polygon}
            options={{
              strokeColor: "#ff00cc",
              strokeOpacity: 0.95,
              strokeWeight: 6,
              fillColor: "#ff00cc",
              fillOpacity: 0.15, // subtle fill
              zIndex: 10,
              clickable: false,
            }}
          />
          {/* Glowing marker for the mentioned place */}
          <Marker
            position={center}
            label={
              name
                ? {
                    text: name.replace("Trek", "").trim(),
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }
                : undefined
            }
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE || 0,
              scale: 16,
              fillColor: "#ff00cc",
              fillOpacity: 1,
              strokeWeight: 6,
              strokeColor: "#fff",
            }}
          />
          {/* Add CSS for marker glow animation */}
          <style>{`
            .gm-style .gm-style-iw-c {
              filter: drop-shadow(0 0 12px #ff00cc) drop-shadow(0 0 24px #fff);
              animation: pulse-glow 1.5s infinite alternate;
            }
            @keyframes pulse-glow {
              0% { filter: drop-shadow(0 0 8px #ff00cc) drop-shadow(0 0 16px #fff); }
              100% { filter: drop-shadow(0 0 24px #ff00cc) drop-shadow(0 0 32px #fff); }
            }
          `}</style>
        </>
      )}
    </GoogleMap>
  );
};

export default Advanced3DMap;