'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Car, 
  Bike,
  Route,
  X,
  RefreshCw
} from 'lucide-react';

interface DirectionsServiceProps {
  destination: { lat: number; lng: number; name: string };
  userLocation: { lat: number; lng: number } | null;
  onClose?: () => void;
}

interface RouteInfo {
  distance: string;
  duration: string;
  mode: string;
  steps: string[];
  polyline: google.maps.LatLng[];
}

export default function DirectionsService({ 
  destination, 
  userLocation, 
  onClose 
}: DirectionsServiceProps) {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const travelModes = [
    { mode: google.maps.TravelMode.DRIVING, icon: Car, label: 'Drive' },
    { mode: google.maps.TravelMode.WALKING, icon: Route, label: 'Walk' },
    { mode: google.maps.TravelMode.BICYCLING, icon: Bike, label: 'Bike' },
    { mode: google.maps.TravelMode.TRANSIT, icon: Route, label: 'Transit' }
  ];

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const renderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    renderer.setMap(new window.google.maps.Map(mapRef.current, {
      center: destination,
      zoom: 12,
      mapTypeId: window.google.maps.MapTypeId.TERRAIN
    }));

    setDirectionsRenderer(renderer);

    return () => {
      if (renderer) {
        renderer.setMap(null);
      }
    };
  }, [destination]);

  const getDirections = async (mode: google.maps.TravelMode) => {
    if (!userLocation || !directionsRenderer) return;

    setLoading(true);
    setError(null);

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const request = {
        origin: userLocation,
        destination: destination,
        travelMode: mode,
        provideRouteAlternatives: true,
        avoidHighways: mode === google.maps.TravelMode.WALKING || mode === google.maps.TravelMode.BICYCLING,
        avoidTolls: mode === google.maps.TravelMode.WALKING || mode === google.maps.TravelMode.BICYCLING
      };

      const result = await directionsService.route(request);
      
      if (result.routes && result.routes.length > 0) {
        const routeInfos: RouteInfo[] = result.routes.map((route, index) => {
          const leg = route.legs[0];
          const steps = leg.steps.map((step: any) => step.instructions);
          
          return {
            distance: leg.distance?.text || 'Unknown',
            duration: leg.duration?.text || 'Unknown',
            mode: mode,
            steps: steps,
            polyline: route.overview_path || []
          };
        });

        setRoutes(routeInfos);
        setSelectedRoute(routeInfos[0]);
        
        // Display the first route on the map
        directionsRenderer.setDirections(result);
      } else {
        setError('No routes found to this destination');
      }
    } catch (err) {
      console.error('Directions error:', err);
      setError('Failed to get directions. Please check your location and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (route: RouteInfo) => {
    setSelectedRoute(route);
    
    // Update the map with the selected route
    if (directionsRenderer && userLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route({
        origin: userLocation,
        destination: destination,
        travelMode: route.mode as google.maps.TravelMode
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
    }
  };

  const getModeIcon = (mode: string) => {
    const modeConfig = travelModes.find(m => m.mode === mode);
    return modeConfig?.icon || Route;
  };

  const getModeLabel = (mode: string) => {
    const modeConfig = travelModes.find(m => m.mode === mode);
    return modeConfig?.label || 'Route';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Map Section */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-[400px]" />
            
            {/* Map Controls */}
            <div className="absolute top-4 left-4 space-y-2">
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="bg-white shadow-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Destination Info */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
              <h3 className="font-semibold text-sm">{destination.name}</h3>
              <p className="text-xs text-gray-600">
                {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Directions Panel */}
          <div className="w-80 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Directions to {destination.name}</h2>
                <Button
                  onClick={() => setRoutes([])}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {!userLocation && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="text-center text-gray-600">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>Location access required for directions</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {userLocation && (
                <>
                  {/* Travel Mode Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {travelModes.map(({ mode, icon: Icon, label }) => (
                      <Button
                        key={mode}
                        onClick={() => getDirections(mode)}
                        disabled={loading}
                        variant="outline"
                        className="h-12"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {label}
                      </Button>
                    ))}
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Getting directions...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <Card className="mb-4 border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Routes List */}
                  {routes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-gray-700">Available Routes</h3>
                      {routes.map((route, index) => (
                        <Card
                          key={index}
                          className={`cursor-pointer transition-colors ${
                            selectedRoute === route ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => handleRouteSelect(route)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {React.createElement(getModeIcon(route.mode), {
                                  className: 'h-4 w-4 mr-2 text-blue-600'
                                })}
                                <span className="text-sm font-medium">
                                  {getModeLabel(route.mode)}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Route {index + 1}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <div className="flex items-center">
                                <Navigation className="h-3 w-3 mr-1" />
                                {route.distance}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {route.duration}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Selected Route Details */}
                  {selectedRoute && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-sm">Route Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedRoute.steps.map((step, index) => (
                            <div key={index} className="text-xs text-gray-700 p-2 bg-gray-100 rounded">
                              {step.replace(/<[^>]*>/g, '')} {/* Remove HTML tags */}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 