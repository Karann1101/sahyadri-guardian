'use client';

import React, { useState } from 'react';
import FortModel from './3d-fort-model';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Castle, 
  MapPin, 
  Mountain, 
  Ruler, 
  Users, 
  Shield, 
  Clock,
  Camera,
  Maximize2,
  Layers,
  BarChart3,
  BookOpen,
  Globe,
  Compass
} from 'lucide-react';

interface FortGalleryProps {
  className?: string;
}

// Fort data for the gallery
const FORTS_DATA = [
  {
    id: 'sinhagad',
    name: 'Sinhagad Fort',
    displayName: 'Sinhagad Fort',
    description: 'Historic hill fortress known for the legendary battle where Tanaji Malusare sacrificed his life',
    difficulty: 'Moderate',
    elevation: '1,312m',
    duration: '4-5 hours',
    bestTime: 'Monsoon & Winter',
    coordinates: { lat: 18.365664, lng: 73.755269 },
    dimensions: {
      length: 1200,
      width: 800,
      height: 45,
      wallThickness: 3,
    },
    features: {
      gates: 4,
      watchtowers: 12,
      waterCisterns: 8,
      temples: 3,
      residentialAreas: 6,
    },
    historicalInfo: {
      builtBy: 'Shivaji Maharaj',
      builtIn: '17th Century',
      significance: 'Site of the legendary battle where Tanaji Malusare sacrificed his life',
      materials: ['Basalt Stone', 'Lime Mortar', 'Iron Reinforcements'],
    },
    colors: {
      primary: '#8B4513',
      secondary: '#A0522D',
      accent: '#CD853F',
    },
    imageUrl: '/placeholder.jpg', // You can add actual fort images
  },
  {
    id: 'rajgad',
    name: 'Rajgad Fort',
    displayName: 'Rajgad Fort',
    description: 'The King of Forts, capital of Maratha Empire for 26 years',
    difficulty: 'Challenging',
    elevation: '1,376m',
    duration: '6-8 hours',
    bestTime: 'Post-monsoon',
    coordinates: { lat: 18.246111, lng: 73.682222 },
    dimensions: {
      length: 1500,
      width: 1000,
      height: 50,
      wallThickness: 4,
    },
    features: {
      gates: 6,
      watchtowers: 16,
      waterCisterns: 12,
      temples: 5,
      residentialAreas: 8,
    },
    historicalInfo: {
      builtBy: 'Shivaji Maharaj',
      builtIn: '17th Century',
      significance: 'Capital of Maratha Empire for 26 years, known as the King of Forts',
      materials: ['Granite Stone', 'Lime Mortar', 'Iron Gates'],
    },
    colors: {
      primary: '#696969',
      secondary: '#808080',
      accent: '#A9A9A9',
    },
    imageUrl: '/placeholder.jpg',
  },
  {
    id: 'torna',
    name: 'Torna Fort',
    displayName: 'Torna Fort',
    description: 'First fort captured by Shivaji Maharaj at age 16',
    difficulty: 'Easy',
    elevation: '1,403m',
    duration: '3-4 hours',
    bestTime: 'Monsoon & Winter',
    coordinates: { lat: 18.276072, lng: 73.622716 },
    dimensions: {
      length: 900,
      width: 600,
      height: 40,
      wallThickness: 2.5,
    },
    features: {
      gates: 3,
      watchtowers: 8,
      waterCisterns: 6,
      temples: 2,
      residentialAreas: 4,
    },
    historicalInfo: {
      builtBy: 'Shivaji Maharaj',
      builtIn: '17th Century',
      significance: 'First fort captured by Shivaji Maharaj at age 16',
      materials: ['Basalt Stone', 'Lime Mortar', 'Wooden Beams'],
    },
    colors: {
      primary: '#8B7355',
      secondary: '#B8860B',
      accent: '#DAA520',
    },
    imageUrl: '/placeholder.jpg',
  },
];

const FortGallery: React.FC<FortGalleryProps> = ({ className = '' }) => {
  const [selectedFort, setSelectedFort] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'comparison'>('gallery');
  const [comparisonForts, setComparisonForts] = useState<string[]>([]);

  const handleFortSelect = (fortId: string) => {
    setSelectedFort(fortId);
  };

  const handleComparisonToggle = (fortId: string) => {
    setComparisonForts(prev => {
      if (prev.includes(fortId)) {
        return prev.filter(id => id !== fortId);
      } else if (prev.length < 3) {
        return [...prev, fortId];
      }
      return prev;
    });
  };

  const selectedFortData = FORTS_DATA.find(fort => fort.id === selectedFort);
  const comparisonFortsData = FORTS_DATA.filter(fort => comparisonForts.includes(fort.id));

  return (
    <div className={`container mx-auto p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">3D Fort Models Gallery</h1>
        <p className="text-gray-600">Explore to-scale 3D representations of historic forts in the Western Ghats</p>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Fort Gallery</TabsTrigger>
          <TabsTrigger value="comparison">Compare Forts</TabsTrigger>
          <TabsTrigger value="3d-view">3D View</TabsTrigger>
        </TabsList>

        {/* Fort Gallery Tab */}
        <TabsContent value="gallery" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FORTS_DATA.map((fort) => (
              <Card 
                key={fort.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedFort === fort.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleFortSelect(fort.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Castle className="h-5 w-5 text-orange-600" />
                      {fort.displayName}
                    </CardTitle>
                    <Badge 
                      variant={
                        fort.difficulty === 'Easy' ? 'default' :
                        fort.difficulty === 'Moderate' ? 'secondary' : 'destructive'
                      }
                    >
                      {fort.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{fort.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Mountain className="h-3 w-3" />
                      <span>{fort.elevation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{fort.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      <span>{fort.dimensions.length}m × {fort.dimensions.width}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>{fort.features.watchtowers} towers</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{fort.coordinates.lat.toFixed(4)}, {fort.coordinates.lng.toFixed(4)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFortSelect(fort.id);
                      setViewMode('3d-view');
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    View 3D Model
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Compare Forts (Select up to 3)</h3>
              <Badge variant="outline">{comparisonForts.length}/3 selected</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FORTS_DATA.map((fort) => (
                <Card 
                  key={fort.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    comparisonForts.includes(fort.id) ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => handleComparisonToggle(fort.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{fort.displayName}</h4>
                      <input 
                        type="checkbox" 
                        checked={comparisonForts.includes(fort.id)}
                        onChange={() => handleComparisonToggle(fort.id)}
                        className="h-4 w-4"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{fort.description}</p>
                    <div className="text-xs text-gray-500">
                      <div>Elevation: {fort.elevation}</div>
                      <div>Difficulty: {fort.difficulty}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {comparisonForts.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Fort Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Feature</th>
                          {comparisonFortsData.map(fort => (
                            <th key={fort.id} className="text-left p-2">{fort.displayName}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Elevation</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">{fort.elevation}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Difficulty</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">{fort.difficulty}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Duration</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">{fort.duration}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Dimensions</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">
                              {fort.dimensions.length}m × {fort.dimensions.width}m
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Watchtowers</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">{fort.features.watchtowers}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Gates</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">{fort.features.gates}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Water Cisterns</td>
                          {comparisonFortsData.map(fort => (
                            <td key={fort.id} className="p-2">{fort.features.waterCisterns}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 3D View Tab */}
        <TabsContent value="3d-view" className="mt-6">
          {selectedFortData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedFortData.displayName}</h3>
                  <p className="text-gray-600">{selectedFortData.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedFortData.difficulty}</Badge>
                  <Badge variant="outline">{selectedFortData.elevation}</Badge>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <FortModel
                  fortName={selectedFortData.name}
                  fortData={selectedFortData}
                  height="100%"
                  showControls={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Ruler className="h-4 w-4" />
                      Dimensions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-1">
                      <div>Length: {selectedFortData.dimensions.length}m</div>
                      <div>Width: {selectedFortData.dimensions.width}m</div>
                      <div>Height: {selectedFortData.dimensions.height}m</div>
                      <div>Wall Thickness: {selectedFortData.dimensions.wallThickness}m</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4" />
                      Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-1">
                      <div>Gates: {selectedFortData.features.gates}</div>
                      <div>Watchtowers: {selectedFortData.features.watchtowers}</div>
                      <div>Water Cisterns: {selectedFortData.features.waterCisterns}</div>
                      <div>Temples: {selectedFortData.features.temples}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4" />
                      History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-1">
                      <div><strong>Built by:</strong> {selectedFortData.historicalInfo.builtBy}</div>
                      <div><strong>Built in:</strong> {selectedFortData.historicalInfo.builtIn}</div>
                      <div><strong>Elevation:</strong> {selectedFortData.coordinates.elevation}m</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Castle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Fort</h3>
              <p className="text-gray-600">Choose a fort from the gallery to view its 3D model</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FortGallery; 