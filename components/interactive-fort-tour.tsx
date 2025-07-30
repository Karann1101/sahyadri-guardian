'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Map, 
  Clock, 
  BookOpen, 
  Lightbulb,
  History,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import StreetView from './street-view';
import { FORT_TOURS, type FortTour, type TourStep } from './fort-tour-data';

interface InteractiveFortTourProps {
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

export default function InteractiveFortTour({ 
  isOpen, 
  onClose, 
  selectedFort 
}: InteractiveFortTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showFacts, setShowFacts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const tourData = selectedFort ? FORT_TOURS[selectedFort.name] : null;
  const currentStep = tourData?.steps[currentStepIndex];

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('InteractiveFortTour Debug:', {
      selectedFort,
      fortName: selectedFort?.name,
      tourData: !!tourData,
      currentStepIndex,
      currentStep: !!currentStep,
      totalSteps: tourData?.steps.length,
      currentStepCoords: currentStep?.position
    });
  }

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || !currentStep) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-advance to next step
          if (currentStepIndex < (tourData?.steps.length || 0) - 1) {
            setCurrentStepIndex(prev => prev + 1);
            return currentStep.duration;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep, currentStepIndex, tourData]);

  // Initialize timer when step changes
  useEffect(() => {
    if (currentStep) {
      setTimeRemaining(currentStep.duration);
    }
  }, [currentStep]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (tourData && currentStepIndex < tourData.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = tourData ? ((currentStepIndex + 1) / tourData.steps.length) * 100 : 0;

  if (!selectedFort || !tourData) {
    console.error('Tour data not found for fort:', selectedFort?.name);
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tour Not Available</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Interactive tour is not available for {selectedFort?.name || 'this location'}.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col md:flex-row">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Map className="h-6 w-6 text-yellow-300" />
                {tourData.fortName} - Interactive Tour
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                  {tourData.difficulty}
                </Badge>
                <Badge className="bg-emerald-400 text-emerald-900 hover:bg-emerald-500">
                  {tourData.totalDuration} min tour
                </Badge>
                <Badge className="bg-blue-400 text-blue-900 hover:bg-blue-500">
                  {tourData.bestTime}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className="border-white/20 text-white hover:bg-white/10 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
                aria-label="Reload Tour"
                title="Reload Tour"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
                aria-label="Close Tour"
                title="Close Tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-full">
          {/* Left Panel - Tour Controls and Info */}
          <div className="w-full md:w-1/3 border-r border-gray-200 p-6 space-y-6 bg-white/80 backdrop-blur-sm overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Progress */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold">Tour Progress</span>
                <span className="text-sm opacity-90">
                  {currentStepIndex + 1} / {tourData.steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-white/20" />
              <div className="mt-2 text-xs opacity-80">
                {Math.round(progress)}% Complete
              </div>
            </div>

            {/* Current Step Info */}
            {currentStep && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg">{currentStep.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{currentStep.description}</p>
                  
                  {/* Timer and Controls */}
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                          disabled={currentStepIndex === 0}
                          className="border-white/30 text-white hover:bg-white/20 disabled:opacity-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePlayPause}
                          className="border-white/30 text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={currentStepIndex === tourData.steps.length - 1}
                          className="border-white/30 text-white hover:bg-white/20 disabled:opacity-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFacts(!showFacts)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Quick Facts
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                    >
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Button>
                  </div>

                  {/* Facts Panel */}
                  {showFacts && (
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-300" />
                          Quick Facts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-sm">
                          {currentStep.facts.map((fact, index) => (
                            <li key={index} className="flex items-start gap-3 p-2 bg-white/60 rounded-lg">
                              <span className="text-blue-600 mt-1 text-lg">•</span>
                              <span className="text-gray-800">{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* History Panel */}
                  {showHistory && (
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-md">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="h-4 w-4 text-yellow-300" />
                          Historical Background
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-800 leading-relaxed bg-white/60 p-3 rounded-lg">
                          {currentStep.historicalInfo}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tour Overview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-yellow-300" />
                  Tour Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed bg-white/60 p-3 rounded-lg">
                  {tourData.overview}
                </p>
                
                {/* Step Navigation */}
                <div className="space-y-2">
                  {tourData.steps.map((step, index) => (
                    <Button
                      key={step.id}
                      variant={currentStepIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStepClick(index)}
                      className={`w-full justify-start text-left h-auto p-3 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                        currentStepIndex === index 
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg" 
                          : "bg-white/80 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border-purple-200"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-xs">{step.title}</div>
                        <div className="text-xs opacity-70">
                          {Math.floor(step.duration / 60)} min
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Street View */}
          <div className="flex-1 relative w-full">
            {currentStep ? (
              <StreetView
                latitude={currentStep.position.lat}
                longitude={currentStep.position.lng}
                heading={currentStep.pov.heading}
                pitch={currentStep.pov.pitch}
                height="100%"
                className="rounded-none"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                  <div className="text-gray-500 mb-2">📍</div>
                  <p className="text-gray-600">Loading tour location...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 