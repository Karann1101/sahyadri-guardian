'use client';

import React, { useState } from 'react';
import StreetView from './street-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react'; // Add this if you have lucide-react installed, otherwise use a text arrow

interface Location {
  name: string;
  latitude: number;
  longitude: number;
  heading: number;
  description: string;
}

const LOCATIONS: Location[] = [
  {
    name: "Taj Mahal, Agra",
    latitude: 27.1751,
    longitude: 78.0421,
    heading: 45,
    description: "Iconic white marble mausoleum"
  },
  {
    name: "Gateway of India, Mumbai",
    latitude: 18.9217,
    longitude: 72.8347,
    heading: 180,
    description: "Historic monument and popular tourist spot"
  },
  {
    name: "Marine Drive, Mumbai",
    latitude: 18.9431,
    longitude: 72.8235,
    heading: 90,
    description: "Famous curved boulevard along the coast"
  },
  {
    name: "Lalbagh Fort, Dhaka",
    latitude: 23.7161,
    longitude: 90.3889,
    heading: 0,
    description: "Historic Mughal fort complex"
  }
];

export default function StreetViewDemo() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(LOCATIONS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const locationInfoRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Google Street View Demo</h1>
        <p className="text-gray-600">Explore different locations with Google Street View</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Location Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {LOCATIONS.map((location) => (
                <Button
                  key={location.name}
                  variant={selectedLocation.name === location.name ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedLocation(location)}
                >
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500">{location.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Street View Display */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedLocation.name}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
              </div>
              <p className="text-sm text-gray-600">{selectedLocation.description}</p>
            </CardHeader>
            <CardContent>
              <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}>
                {isFullscreen && (
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFullscreen(false)}
                    >
                      Close
                    </Button>
                  </div>
                )}
                <StreetView
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                  heading={selectedLocation.heading}
                  height={isFullscreen ? '100vh' : '500px'}
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </CardContent>
          </Card>
          {/* Scroll Down Button */}
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              onClick={() => locationInfoRef.current?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Scroll down to location info"
            >
              {/* Use icon if available, otherwise fallback to text */}
              {typeof ChevronDown !== 'undefined' ? <ChevronDown className="w-6 h-6" /> : '↓'}
            </Button>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="mt-6" ref={locationInfoRef}>
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Latitude:</span> {selectedLocation.latitude}
              </div>
              <div>
                <span className="font-medium">Longitude:</span> {selectedLocation.longitude}
              </div>
              <div>
                <span className="font-medium">Heading:</span> {selectedLocation.heading}°
              </div>
              <div>
                <span className="font-medium">Coordinates:</span> {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 