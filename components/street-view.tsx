'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { RotateCcw, Maximize2, X } from 'lucide-react';

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

const StreetView: React.FC<StreetViewProps> = ({
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

  useEffect(() => {
    const initStreetView = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.error('Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.');
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

        if (!mapRef.current) return;

        const pano = new google.maps.StreetViewPanorama(
          mapRef.current,
          {
            position: { lat: latitude, lng: longitude },
            pov: {
              heading: heading,
              pitch: pitch
            },
            zoom: zoom,
            addressControl: true,
            fullscreenControl: false, // Hide default fullscreen
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

        // Handle panorama load events
        google.maps.event.addListener(pano, 'status_changed', () => {
          const status = pano.getStatus();
          console.log('Street View status:', status);
          if (status === google.maps.StreetViewStatus.OK) {
            setIsLoading(false);
          } else if (status === google.maps.StreetViewStatus.ZERO_RESULTS) {
            setError('No Street View available at this location');
            setIsLoading(false);
          } else {
            setError(`Error loading Street View: ${status}`);
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('Error loading Street View:', err);
        setError('Failed to load Street View');
        setIsLoading(false);
      }
    };

    initStreetView();
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

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Street View...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-4">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default StreetView; 