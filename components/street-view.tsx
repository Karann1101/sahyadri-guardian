'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreetViewProps {
  latitude: number;
  longitude: number;
  heading?: number;
  pitch?: number;
  zoom?: number;
  width?: string;
  height?: string;
  className?: string;
  onReset?: () => void;
  onFullscreen?: () => void;
  onClose?: () => void;
}

const StreetViewComponent: React.FC<StreetViewProps> = ({
  latitude,
  longitude,
  heading = 0,
  pitch = 0,
  zoom = 1,
  width = '100%',
  height = '400px',
  className = '',
  onReset,
  onFullscreen,
  onClose
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panorama, setPanorama] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initStreetView = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          setError('Google Maps API key is missing');
          setIsLoading(false);
          return;
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();

        if (!mapRef.current) {
          setError('Map container not found');
          setIsLoading(false);
          return;
        }

        // Try to find the nearest panorama within 100 meters
        const svService = new google.maps.StreetViewService();
        svService.getPanorama({
          location: { lat: latitude, lng: longitude },
          radius: 100
        }, (data: any, status: any) => {
          if (status === google.maps.StreetViewStatus.OK) {
            // Found a panorama nearby
            const pano = new google.maps.StreetViewPanorama(
              mapRef.current!,
              {
                pano: data.location.pano,
                position: data.location.latLng,
                pov: {
                  heading: heading,
                  pitch: pitch
                },
                zoom: zoom,
                addressControl: true,
                fullscreenControl: false,
                motionTracking: false,
                motionTrackingControl: false,
                showRoadLabels: true,
                visible: true,
                zoomControl: false,
                linksControl: false,
                panControl: false,
                enableCloseButton: false
              }
            );
            setPanorama(pano);
            setIsInitialized(true);
            setIsLoading(false);
            setError(null);
          } else {
            setError('No Street View available at this location or nearby.');
            setIsLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to load Street View');
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initStreetView();
    }, 100);

    return () => clearTimeout(timer);
  }, [latitude, longitude, heading, pitch, zoom]);

  // Custom handlers
  const handleReset = () => {
    if (panorama) {
      panorama.setPosition({ lat: latitude, lng: longitude });
      panorama.setPov({ heading, pitch });
      panorama.setZoom(zoom);
    }
    if (onReset) onReset();
  };

  const handleFullscreen = () => {
    if (mapRef.current) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      }
    }
    if (onFullscreen) onFullscreen();
  };

  // Fade-in effect for the map
  const mapFadeClass = isInitialized && !isLoading && !error
    ? 'opacity-100 transition-opacity duration-700'
    : 'opacity-0';

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height, minHeight: height, transition: 'min-height 0.3s' }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20 transition-opacity duration-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Street View...</p>
            <p className="text-xs text-gray-500 mt-2">Coordinates: {latitude}, {longitude}</p>
          </div>
        </div>
      )}
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20 transition-opacity duration-500">
          <div className="text-center p-4">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <p className="text-xs text-gray-500 mt-2">Coordinates: {latitude}, {longitude}</p>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/@${latitude},${longitude},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`, '_blank')}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Open in Google Maps
            </button>
          </div>
        </div>
      )}
      {/* Map Container (always present, fades in) */}
      <div
        ref={mapRef}
        className={`w-full h-full bg-[#f0f0f0] rounded-lg ${mapFadeClass}`}
        style={{ minHeight: height, transition: 'opacity 0.7s' }}
      />
      {/* Controls (only show when loaded and no error) */}
      {isInitialized && !isLoading && !error && (
        <div className="absolute top-2 right-2 flex gap-2 z-30">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="bg-white/80 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleFullscreen}
            className="bg-white/80 backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const StreetView = React.memo(StreetViewComponent);
export default StreetView;