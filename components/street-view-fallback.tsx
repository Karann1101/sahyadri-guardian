'use client';

import React from 'react';
import { AlertCircle, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StreetViewFallbackProps {
  latitude: number;
  longitude: number;
  locationName: string;
  className?: string;
}

const StreetViewFallback: React.FC<StreetViewFallbackProps> = ({
  latitude,
  longitude,
  locationName,
  className = ''
}) => {
  const googleMapsUrl = `https://www.google.com/maps/@${latitude},${longitude},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  return (
    <div className={`relative ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {locationName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Google Maps API key is not configured. Street View is not available.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Street View Preview</h3>
            <p className="text-gray-600 mb-4">
              Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
            <p className="text-sm text-gray-500">
              To enable Street View, please configure your Google Maps API key.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              asChild 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </a>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <a 
                href={streetViewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Open Street View
              </a>
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Setup Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file</li>
              <li>Add: <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key</code></li>
              <li>Get API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreetViewFallback; 