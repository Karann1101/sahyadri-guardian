"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  MapPin, 
  Mountain, 
  AlertTriangle,
  Clock,
  Users,
  Camera,
  Castle
} from "lucide-react"
import StreetView from "./street-view"

interface FortData {
  name: string
  coords: { lat: number; lng: number }
  difficulty: string
  elevation: string
  riskLevel: string
}

interface InteractiveFortTourProps {
  isOpen: boolean
  onClose: () => void
  selectedFort: FortData | null
}

interface TourStep {
  id: number
  title: string
  description: string
  duration: number
  image?: string
  tips: string[]
  coordinates?: { lat: number; lng: number }
}

export default function InteractiveFortTour({ isOpen, onClose, selectedFort }: InteractiveFortTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(true)

  // Sample tour steps for forts
  const tourSteps: TourStep[] = [
    {
      id: 1,
      title: "Welcome to the Fort",
      description: "You're about to embark on an exciting journey through this historic fort. This interactive tour will guide you through the key points of interest, safety considerations, and fascinating historical facts.",
      duration: 30,
      tips: ["Wear comfortable hiking shoes", "Bring plenty of water", "Check weather conditions"]
    },
    {
      id: 2,
      title: "Starting Point & Trailhead",
      description: "This is where your adventure begins. The trailhead is well-marked and provides the first glimpse of the challenging terrain ahead. Take a moment to adjust your gear and review the safety guidelines.",
      duration: 45,
      tips: ["Use the restroom facilities", "Double-check your equipment", "Take a group photo"]
    },
    {
      id: 3,
      title: "First Ascent - Rocky Terrain",
      description: "The initial climb involves navigating through rocky terrain. This section requires careful footing and moderate physical exertion. The path is clearly marked with red and white paint.",
      duration: 60,
      tips: ["Take your time on steep sections", "Use handholds when available", "Stay hydrated"]
    },
    {
      id: 4,
      title: "Midway Point - Rest Area",
      description: "A perfect spot to catch your breath and enjoy the panoramic views. This rest area offers shade and seating. It's also a great place to assess your group's energy levels.",
      duration: 30,
      tips: ["Rest for 5-10 minutes", "Reapply sunscreen", "Check your water supply"]
    },
    {
      id: 5,
      title: "Final Ascent - Summit Approach",
      description: "The most challenging section of the trek. The path becomes steeper and more exposed. This is where your preparation and fitness level will be tested.",
      duration: 90,
      tips: ["Take frequent breaks", "Stay on the marked path", "Help fellow trekkers"]
    },
    {
      id: 6,
      title: "Fort Entrance & Historical Overview",
      description: "Congratulations! You've reached the fort entrance. This historic structure has witnessed centuries of history. Take time to appreciate the architectural marvel and learn about its significance.",
      duration: 60,
      tips: ["Respect the historical site", "Take photos responsibly", "Learn about the fort's history"]
    },
    {
      id: 7,
      title: "Safety Considerations & Emergency",
      description: "Important safety information for your trek. Know the emergency procedures, weather considerations, and what to do in case of an emergency situation.",
      duration: 45,
      tips: ["Carry a first aid kit", "Know emergency numbers", "Stay with your group"]
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setProgress(0)
      setIsPlaying(false)
    }
  }, [isOpen])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && autoAdvance) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentStep < tourSteps.length - 1) {
              setCurrentStep(prev => prev + 1)
              return 0
            } else {
              setIsPlaying(false)
              return 100
            }
          }
          return prev + (100 / (tourSteps[currentStep].duration * 10))
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, autoAdvance, tourSteps])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setProgress(0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setProgress(0)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Stepper for navigation
  const Stepper = () => (
    <div className="flex items-center justify-center gap-2 my-4">
      {tourSteps.map((step, idx) => (
        <button
          key={step.id}
          onClick={() => setCurrentStep(idx)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200
            ${idx === currentStep ? 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 text-white border-fuchsia-700 scale-110 shadow-lg' : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-fuchsia-100 hover:text-fuchsia-700'}`}
          aria-label={`Go to step ${idx + 1}`}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  )

  if (!selectedFort) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-br from-fuchsia-50 to-white rounded-2xl shadow-2xl border-0">
        <DialogHeader className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 rounded-t-2xl p-6">
          <DialogTitle className="flex items-center justify-between text-white text-2xl font-bold">
            <div className="flex items-center space-x-3">
              <Camera className="h-7 w-7 text-white/80" />
              <span>Interactive Tour: {selectedFort.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-fuchsia-700/30">
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* 3D Street View Section */}
        <div className="w-full flex justify-center items-center bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 py-4 border-b border-fuchsia-100">
          <div className="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
            <StreetView latitude={selectedFort.coords.lat} longitude={selectedFort.coords.lng} height="350px" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Fort Overview Card */}
          <Card className="bg-gradient-to-br from-fuchsia-100 to-white border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-fuchsia-700">
                <MapPin className="h-5 w-5 text-fuchsia-500" />
                <span>Fort Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Mountain className="h-4 w-4 text-fuchsia-400" />
                  <div>
                    <p className="text-sm text-gray-500">Elevation</p>
                    <p className="font-semibold text-fuchsia-700">{selectedFort.elevation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-fuchsia-400" />
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <Badge className={getDifficultyColor(selectedFort.difficulty) + " border-0 shadow"}>
                      {selectedFort.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-fuchsia-400" />
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <Badge className={getRiskColor(selectedFort.riskLevel) + " border-0 shadow"}>
                      {selectedFort.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stepper */}
          <Stepper />

          {/* Tour Progress */}
          <Card className="bg-gradient-to-br from-fuchsia-50 to-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-fuchsia-700 font-semibold">Tour Progress</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Step {currentStep + 1} of {tourSteps.length}
                  </span>
                  <Clock className="h-4 w-4 text-fuchsia-400" />
                  <span className="text-sm text-gray-500">
                    {tourSteps[currentStep].duration}s
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4 bg-fuchsia-100" />
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="transition-all duration-200 hover:bg-fuchsia-100"
                >
                  <SkipBack className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="transition-all duration-200 hover:bg-fuchsia-100"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === tourSteps.length - 1}
                  className="transition-all duration-200 hover:bg-fuchsia-100"
                >
                  Next
                  <SkipForward className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Step Content */}
          <Card className={`border-0 shadow-lg transition-all duration-300 ${currentStep % 2 === 0 ? 'bg-gradient-to-br from-fuchsia-100 to-white' : 'bg-gradient-to-br from-white to-fuchsia-50'}`}>
            <CardHeader>
              <CardTitle className="text-lg text-fuchsia-700 flex items-center gap-2">
                <Castle className="h-5 w-5 text-fuchsia-400" />
                {tourSteps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-base">
                {tourSteps[currentStep].description}
              </p>
              {/* Safety Tips */}
              <div className="bg-gradient-to-r from-blue-100 to-fuchsia-100 border border-blue-200 rounded-lg p-4 animate-fade-in">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                  Safety Tips
                </h4>
                <ul className="space-y-1">
                  {tourSteps[currentStep].tips.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tour Controls */}
          <div className="flex justify-between items-center mt-2">
            <Button
              variant="outline"
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`transition-all duration-200 ${autoAdvance ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-gray-100 text-gray-500'}`}
            >
              Auto-advance: {autoAdvance ? 'On' : 'Off'}
            </Button>
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
