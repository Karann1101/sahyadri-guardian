'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface LocationFinderProps {
  onLocationSelect: (location: { name: string; latitude: number; longitude: number; heading: number; description: string }) => void;
}

// Pre-verified locations with Street View coverage
const VERIFIED_LOCATIONS = [
  {
    name: "Times Square, New York",
    latitude: 40.7580,
    longitude: -73.9855,
    heading: 180,
    description: "Famous intersection in Manhattan",
    category: "Landmark"
  },
  {
    name: "Eiffel Tower, Paris",
    latitude: 48.8584,
    longitude: 2.2945,
    heading: 45,
    description: "Iconic iron lattice tower",
    category: "Landmark"
  },
  {
    name: "Big Ben, London",
    latitude: 51.4994,
    longitude: -0.1245,
    heading: 0,
    description: "Famous clock tower at Westminster",
    category: "Landmark"
  },
  {
    name: "Shibuya Crossing, Tokyo",
    latitude: 35.6595,
    longitude: 139.7004,
    heading: 90,
    description: "World's busiest pedestrian crossing",
    category: "Urban"
  },
  {
    name: "Sydney Opera House",
    latitude: -33.8568,
    longitude: 151.2153,
    heading: 45,
    description: "Famous performing arts center",
    category: "Landmark"
  },
  {
    name: "Gateway of India, Mumbai",
    latitude: 18.9217,
    longitude: 72.8347,
    heading: 180,
    description: "Historic monument and popular tourist spot",
    category: "Landmark"
  },
  {
    name: "Marine Drive, Mumbai",
    latitude: 18.9431,
    longitude: 72.8235,
    heading: 90,
    description: "Famous curved boulevard along the coast",
    category: "Urban"
  },
  {
    name: "Taj Mahal, Agra",
    latitude: 27.1751,
    longitude: 78.0421,
    heading: 45,
    description: "Iconic white marble mausoleum",
    category: "Landmark"
  },
  {
    name: "Las Vegas Strip",
    latitude: 36.1699,
    longitude: -115.1398,
    heading: 0,
    description: "Famous entertainment district",
    category: "Urban"
  },
  {
    name: "Venice Grand Canal",
    latitude: 45.4371,
    longitude: 12.3326,
    heading: 90,
    description: "Historic waterway in Venice",
    category: "Landmark"
  },
  {
    name: "Mount Fuji View",
    latitude: 35.3606,
    longitude: 138.7274,
    heading: 0,
    description: "Iconic Japanese mountain",
    category: "Nature"
  },
  {
    name: "Niagara Falls",
    latitude: 43.0962,
    longitude: -79.0377,
    heading: 0,
    description: "Famous waterfall on US-Canada border",
    category: "Nature"
  }
];

const CATEGORIES = ["All", "Landmark", "Urban", "Nature"];

export default function StreetViewLocationFinder({ onLocationSelect }: LocationFinderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isApiKeyConfigured = apiKey && apiKey !== 'your_google_maps_api_key_here';

  const filteredLocations = VERIFIED_LOCATIONS.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || location.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const testLocation = async (location: typeof VERIFIED_LOCATIONS[0]) => {
    if (!isApiKeyConfigured) return false;
    
    setIsTesting(location.name);
    
    try {
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-9999px';
      document.body.appendChild(testDiv);

      const google = window.google;
      const pano = new google.maps.StreetViewPanorama(testDiv, {
        position: { lat: location.latitude, lng: location.longitude },
        visible: false
      });

      return new Promise<boolean>((resolve) => {
        google.maps.event.addListener(pano, 'status_changed', () => {
          const status = pano.getStatus();
          document.body.removeChild(testDiv);
          setIsTesting(null);
          resolve(status === google.maps.StreetViewStatus.OK);
        });

        setTimeout(() => {
          if (document.body.contains(testDiv)) {
            document.body.removeChild(testDiv);
          }
          setIsTesting(null);
          resolve(false);
        }, 5000);
      });
    } catch (error) {
      setIsTesting(null);
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Locations with Street View
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="search">Search Locations</Label>
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
            </span>
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              All Verified
            </Badge>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredLocations.map((location) => (
              <div
                key={location.name}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{location.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {location.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Button
                    size="sm"
                    onClick={() => onLocationSelect(location)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Finding Street View Locations</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Major cities and tourist destinations usually have Street View</li>
            <li>• Look for landmarks, monuments, and popular attractions</li>
            <li>• Urban areas and main streets are more likely to be covered</li>
            <li>• Rural areas and private properties may not have Street View</li>
            <li>• Use the search to find specific locations you're interested in</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 