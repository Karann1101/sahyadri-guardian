'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Map, X, Navigation, RotateCcw } from 'lucide-react';
import StreetView from './street-view';
import { STREET_VIEW_POSITIONS, type StreetViewPosition } from './street-view-positions';

interface FortStreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFort: {
    name: string;
    coords: { lat: number; lng: number };
    difficulty: string;
    elevation: string;
    riskLevel: string;
  } | null;
}

export default function FortStreetViewModal({ 
  isOpen, 
  onClose, 
  selectedFort 
}: FortStreetViewModalProps) {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalReady, setIsModalReady] = useState(false);

  // Ensure modal is fully rendered before showing Street View
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        setIsModalReady(true);
        console.log('Modal is ready for Street View');
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsModalReady(false);
    }
  }, [isOpen]);

  if (!selectedFort) return null;

  // Get street view positions for the selected fort
  const streetViewPositions = STREET_VIEW_POSITIONS[selectedFort.name] || [];
  const currentPosition = streetViewPositions[currentViewIndex] || {
    position: selectedFort.coords,
    pov: { heading: 0, pitch: 0 },
    title: "Main View"
  };

  const handleNextView = () => {
    if (streetViewPositions.length > 0) {
      setCurrentViewIndex((prev) => 
        prev === streetViewPositions.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevView = () => {
    if (streetViewPositions.length > 0) {
      setCurrentViewIndex((prev) => 
        prev === 0 ? streetViewPositions.length - 1 : prev - 1
      );
    }
  };

  const resetView = () => {
    setCurrentViewIndex(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-none w-screen h-screen' : 'max-w-6xl'} p-0 bg-gradient-to-br from-slate-50 to-blue-50`}>
        <DialogHeader className="p-6 pb-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Map className="h-6 w-6 text-yellow-300" />
                {selectedFort.name} - Street View
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${
                  selectedFort.riskLevel === 'high' 
                    ? 'bg-red-400 text-red-900 hover:bg-red-500' 
                    : selectedFort.riskLevel === 'moderate' 
                    ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                    : 'bg-green-400 text-green-900 hover:bg-green-500'
                }`}>
                  {selectedFort.riskLevel} risk
                </Badge>
                <Badge className="bg-emerald-400 text-emerald-900 hover:bg-emerald-500">
                  {selectedFort.difficulty}
                </Badge>
                <Badge className="bg-blue-400 text-blue-900 hover:bg-blue-500">
                  {selectedFort.elevation}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="relative">
          {/* Street View Component */}
          <div className={isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[500px]'}>
            {isModalReady ? (
              <StreetView
                latitude={currentPosition.position.lat}
                longitude={currentPosition.position.lng}
                heading={currentPosition.pov.heading}
                pitch={currentPosition.pov.pitch}
                height="100%"
                className="rounded-b-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Preparing Street View...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Control Buttons Row */}
          <div className="flex justify-end gap-3 px-6 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              title="Reset to first view"
              className="flex items-center gap-2 border-gray-300 bg-white hover:bg-blue-100 text-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <RotateCcw className="h-4 w-4" stroke="#1f2937" />
              <span>Reset to view first</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="flex items-center gap-2 border-gray-300 bg-white hover:bg-green-100 text-green-700 shadow focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <Eye className="h-4 w-4" stroke="#1f2937" />
              <span>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              title="Close"
              className="flex items-center gap-2 border-gray-300 bg-white hover:bg-red-100 text-red-700 shadow focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <X className="h-4 w-4" stroke="#1f2937" />
              <span>Close</span>
            </Button>
          </div>

          {/* Navigation Controls */}
          {streetViewPositions.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevView}
                className="rounded-full w-8 h-8 p-0"
              >
                ←
              </Button>
              <span className="text-white text-sm px-2">
                {currentViewIndex + 1} / {streetViewPositions.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNextView}
                className="rounded-full w-8 h-8 p-0"
              >
                →
              </Button>
            </div>
          )}

          {/* View Information */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
            <h3 className="font-semibold text-sm">{currentPosition.title}</h3>
            <p className="text-xs opacity-80">
              {currentPosition.position.lat.toFixed(6)}, {currentPosition.position.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {/* View Points List */}
        {streetViewPositions.length > 1 && (
          <div className="p-6 pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              View Points ({streetViewPositions.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {streetViewPositions.map((position, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    index === currentViewIndex 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentViewIndex(index)}
                >
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">{position.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {position.position.lat.toFixed(4)}, {position.position.lng.toFixed(4)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 