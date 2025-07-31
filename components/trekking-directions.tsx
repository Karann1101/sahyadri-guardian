'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Mountain,
  Car,
  Train,
  Bus,
  Route,
  X,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';

interface TrekkingDirectionsProps {
  destination: { lat: number; lng: number; name: string };
  userLocation: { lat: number; lng: number } | null;
  onClose?: () => void;
}

interface TrekkingRoute {
  id: string;
  name: string;
  type: 'hiking' | 'driving' | 'biking' | 'transit';
  distance: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  elevation: string;
  description: string;
  waypoints: { lat: number; lng: number; name: string }[];
  warnings: string[];
  tips: string[];
}

export default function TrekkingDirections({ 
  destination, 
  userLocation, 
  onClose 
}: TrekkingDirectionsProps) {
  const [routes, setRoutes] = useState<TrekkingRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TrekkingRoute | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Note: Routes are now calculated dynamically using Google Maps Directions API

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const renderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
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

  const getTrekkingRoutes = async () => {
    if (!userLocation || !directionsRenderer) return;

    setLoading(true);
    setError(null);

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      // Get routes for different travel modes with distinct options
      const travelModes = [
        { mode: window.google.maps.TravelMode.WALKING, type: 'hiking', label: 'Hiking Trail' },
        { mode: window.google.maps.TravelMode.DRIVING, type: 'driving', label: 'Drive + Hike' },
        { mode: window.google.maps.TravelMode.BICYCLING, type: 'biking', label: 'Bike + Hike' }
      ];

      const allRoutes: TrekkingRoute[] = [];

      for (const travelMode of travelModes) {
        try {
          const request = {
            origin: userLocation,
            destination: destination,
            travelMode: travelMode.mode,
            provideRouteAlternatives: true
          };

          const result = await directionsService.route(request);
          
          if (result.routes && result.routes.length > 0) {
            result.routes.forEach((route, index) => {
              const leg = route.legs[0];
              if (leg) {
                const waypoints = leg.steps.map((step: any) => ({
                  lat: step.start_location.lat(),
                  lng: step.start_location.lng(),
                  name: step.instructions.replace(/<[^>]*>/g, '').substring(0, 30) + '...'
                }));

                // Add destination as final waypoint
                waypoints.push({
                  lat: leg.end_location.lat(),
                  lng: leg.end_location.lng(),
                  name: destination.name
                });

                const trekkingRoute: TrekkingRoute = {
                  id: `${travelMode.type}-${index}`,
                  name: `${travelMode.label} ${index + 1}`,
                  type: travelMode.type as any,
                  distance: leg.distance?.text || 'Unknown',
                  duration: leg.duration?.text || 'Unknown',
                  difficulty: getDifficultyFromDistance(leg.distance?.value || 0, travelMode.type),
                  elevation: getElevationFromDistance(leg.distance?.value || 0),
                  description: getRouteDescription(travelMode.type, leg.distance?.value || 0),
                  waypoints: waypoints,
                  warnings: getWarningsForRoute(travelMode.type, leg.distance?.value || 0),
                  tips: getTipsForRoute(travelMode.type, leg.distance?.value || 0)
                };

                allRoutes.push(trekkingRoute);
              }
            });
          }
        } catch (err) {
          console.warn(`Failed to get ${travelMode.label} route:`, err);
        }
      }

      setRoutes(allRoutes);
      if (allRoutes.length > 0) {
        setSelectedRoute(allRoutes[0]);
        
        // Display the first route (hiking) on the map by default
        const firstRoute = allRoutes.find(r => r.type === 'hiking') || allRoutes[0];
        if (firstRoute) {
          const travelMode = firstRoute.type === 'hiking' ? 
            window.google.maps.TravelMode.WALKING : 
            firstRoute.type === 'biking' ? 
              window.google.maps.TravelMode.BICYCLING : 
              window.google.maps.TravelMode.DRIVING;

          const firstResult = await directionsService.route({
            origin: userLocation,
            destination: destination,
            travelMode: travelMode,
            avoidHighways: travelMode === window.google.maps.TravelMode.WALKING || travelMode === window.google.maps.TravelMode.BICYCLING,
            avoidTolls: travelMode === window.google.maps.TravelMode.WALKING || travelMode === window.google.maps.TravelMode.BICYCLING
          });
          directionsRenderer.setDirections(firstResult);
        }
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

  const getDifficultyFromDistance = (distanceMeters: number, type: string): 'easy' | 'moderate' | 'challenging' => {
    if (type === 'driving') return 'easy';
    if (distanceMeters < 3000) return 'easy';
    if (distanceMeters < 8000) return 'moderate';
    return 'challenging';
  };

  const getElevationFromDistance = (distanceMeters: number): string => {
    // Rough estimation based on distance
    const elevationMeters = Math.round(distanceMeters * 0.1); // 10% elevation gain
    return `+${elevationMeters}m`;
  };

  const getRouteDescription = (type: string, distanceMeters: number): string => {
    const distanceKm = (distanceMeters / 1000).toFixed(1);
    switch (type) {
      case 'hiking':
        return `Direct hiking route covering ${distanceKm} km to the fort`;
      case 'driving':
        return `Drive to nearest point, then short hike to the fort`;
      case 'biking':
        return `Bike route covering ${distanceKm} km with hiking section`;
      default:
        return `Route to the fort covering ${distanceKm} km`;
    }
  };

  const getWarningsForRoute = (type: string, distanceMeters: number): string[] => {
    const warnings = [];
    
    if (type === 'hiking' && distanceMeters > 5000) {
      warnings.push('Long distance requires good fitness level');
      warnings.push('Carry sufficient water (3-4 liters)');
      warnings.push('Start early to avoid heat');
    }
    
    if (type === 'driving') {
      warnings.push('Check road conditions before travel');
      warnings.push('Limited parking at destination');
    }
    
    if (type === 'biking') {
      warnings.push('Mixed terrain - some sections may require walking');
      warnings.push('Check bike path conditions');
    }
    
    warnings.push('Carry essential supplies and first aid');
    warnings.push('Inform someone about your plans');
    
    return warnings;
  };

  const getTipsForRoute = (type: string, distanceMeters: number): string[] => {
    const tips = [];
    
    if (type === 'hiking') {
      tips.push('Wear proper hiking shoes');
      tips.push('Start early (5-6 AM)');
      tips.push('Take frequent breaks');
      if (distanceMeters > 5000) {
        tips.push('Consider hiring a local guide');
      }
    }
    
    if (type === 'driving') {
      tips.push('Check weather conditions');
      tips.push('Have backup transportation plan');
    }
    
    if (type === 'biking') {
      tips.push('Wear helmet and safety gear');
      tips.push('Check bike maintenance');
    }
    
    tips.push('Carry energy snacks and water');
    tips.push('Take photos but stay on marked trails');
    
    return tips;
  };

  const handleRouteSelect = (route: TrekkingRoute) => {
    setSelectedRoute(route);
    
    // Show route on map if user location is available
    if (directionsRenderer && userLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const travelMode = route.type === 'hiking' ? 
        window.google.maps.TravelMode.WALKING : 
        route.type === 'biking' ? 
          window.google.maps.TravelMode.BICYCLING : 
          window.google.maps.TravelMode.DRIVING;

      // Clear previous route
      directionsRenderer.setDirections({ routes: [] });

      // Request new route with specific options
      const request = {
        origin: userLocation,
        destination: destination,
        travelMode: travelMode,
        provideRouteAlternatives: true,
        avoidHighways: travelMode === window.google.maps.TravelMode.WALKING || travelMode === window.google.maps.TravelMode.BICYCLING,
        avoidTolls: travelMode === window.google.maps.TravelMode.WALKING || travelMode === window.google.maps.TravelMode.BICYCLING
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result && result.routes && result.routes.length > 0) {
          // Display the first route of the selected type
          const routeToShow = {
            routes: [result.routes[0]],
            request: result.request
          };
          directionsRenderer.setDirections(routeToShow);
        } else {
          console.error('Failed to display route:', status);
        }
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hiking': return Mountain;
      case 'driving': return Car;
      case 'transit': return Bus;
      default: return Route;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Map Section */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-[500px]" />
            
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
          <div className="w-96 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Trekking Routes to {destination.name}</h2>
                <Button
                  onClick={getTrekkingRoutes}
                  variant="outline"
                  size="sm"
                  disabled={loading}
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
                  {/* Loading State */}
                  {loading && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Finding trekking routes...</p>
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
                      {routes.map((route) => {
                        const TypeIcon = getTypeIcon(route.type);
                        return (
                                                     <Card
                             key={route.id}
                             className={`cursor-pointer transition-colors ${
                               selectedRoute?.id === route.id ? 'border-blue-500 bg-blue-50 shadow-lg' : 'hover:bg-gray-50'
                             }`}
                             onClick={() => handleRouteSelect(route)}
                           >
                            <CardContent className="p-3">
                                                             <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center">
                                   <TypeIcon className="h-4 w-4 mr-2 text-blue-600" />
                                   <span className="text-sm font-medium">{route.name}</span>
                                   {selectedRoute?.id === route.id && (
                                     <Badge className="ml-2 text-xs bg-green-100 text-green-800">
                                       Active
                                     </Badge>
                                   )}
                                 </div>
                                 <Badge className={`text-xs ${getDifficultyColor(route.difficulty)}`}>
                                   {route.difficulty}
                                 </Badge>
                               </div>
                              
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                  <span>Distance:</span>
                                  <span className="font-medium">{route.distance}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Duration:</span>
                                  <span className="font-medium">{route.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Elevation:</span>
                                  <span className="font-medium">{route.elevation}</span>
                                </div>
                              </div>

                              <p className="text-xs text-gray-700 mt-2">{route.description}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected Route Details */}
                  {selectedRoute && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Mountain className="h-4 w-4" />
                          Route Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Waypoints */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-2">Route Points</h4>
                          <div className="space-y-1">
                            {selectedRoute.waypoints.map((waypoint, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-600">
                                <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center mr-2">
                                  {index + 1}
                                </div>
                                <span>{waypoint.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Warnings */}
                        {selectedRoute.warnings.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              Warnings
                            </h4>
                            <div className="space-y-1">
                              {selectedRoute.warnings.map((warning, index) => (
                                <div key={index} className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                  • {warning}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {selectedRoute.tips.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <Info className="h-3 w-3 text-blue-500" />
                              Tips
                            </h4>
                            <div className="space-y-1">
                              {selectedRoute.tips.map((tip, index) => (
                                <div key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                  • {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                                     {/* Get Routes Button */}
                   {routes.length === 0 && !loading && (
                     <Button
                       onClick={getTrekkingRoutes}
                       className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                     >
                       <Mountain className="h-4 w-4 mr-2" />
                       Find Trekking Routes
                     </Button>
                   )}

                   {/* Route Statistics */}
                   {routes.length > 0 && (
                     <Card className="mt-4">
                       <CardHeader>
                         <CardTitle className="text-sm">Route Statistics</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="grid grid-cols-2 gap-4 text-xs">
                           <div className="text-center p-2 bg-blue-50 rounded">
                             <div className="font-semibold text-blue-700">Total Routes</div>
                             <div className="text-2xl font-bold text-blue-600">{routes.length}</div>
                           </div>
                           <div className="text-center p-2 bg-green-50 rounded">
                             <div className="font-semibold text-green-700">Available Modes</div>
                             <div className="text-2xl font-bold text-green-600">
                               {new Set(routes.map(r => r.type)).size}
                             </div>
                           </div>
                         </div>
                         <div className="mt-3 text-xs text-gray-600">
                           Routes calculated using Google Maps Directions API
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