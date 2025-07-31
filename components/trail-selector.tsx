"use client"

import { Mountain, TrendingUp, Eye, BookOpen, Navigation, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TrailSelectorProps {
  selectedTrail: any
  onTrailSelect: (trail: any) => void
  onStreetViewClick?: (trail: any) => void
  onDirectionsClick?: (trail: any) => void
  onInteractiveTourClick?: (trail: any) => void
}

export function TrailSelector({ selectedTrail, onTrailSelect, onStreetViewClick, onDirectionsClick, onInteractiveTourClick }: TrailSelectorProps) {
  const trails = [
    {
      id: 1,
      name: "Sinhagad Fort Trek",
      riskLevel: "moderate",
      aiRiskScore: 6.2,
      elevation: "1312m",
      difficulty: "Moderate",
      coords: { lat: 18.365664, lng: 73.755269 },
    },
    {
      id: 2,
      name: "Rajgad Fort Trek",
      riskLevel: "high",
      aiRiskScore: 8.1,
      elevation: "1376m",
      difficulty: "Challenging",
      coords: { lat: 18.246111, lng: 73.682222 },
    },
    {
      id: 3,
      name: "Torna Fort Trek",
      riskLevel: "low",
      aiRiskScore: 3.4,
      elevation: "1403m",
      difficulty: "Easy",
      coords: { lat: 18.276072, lng: 73.622716 },
    },
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      case "extreme":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-64 shadow-xl bg-white border-0">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg text-white">
            <Mountain className="h-4 w-4" />
            <span className="text-sm font-semibold">Select Trail</span>
          </div>

          <Select
  value={selectedTrail?.id?.toString() || "none"}
  onValueChange={(value) => {
    if (value === "none") {
      onTrailSelect(null);
    } else {
      const trail = trails.find((t) => t.id.toString() === value);
      onTrailSelect(trail);
    }
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Choose a trail" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="none">None</SelectItem>
    {trails.map((trail) => (
      <SelectItem key={trail.id} value={trail.id.toString()}>
        <div className="flex items-center justify-between w-full">
          <span>{trail.name}</span>
          <Badge className={`ml-2 ${getRiskColor(trail.riskLevel)}`}>{trail.riskLevel}</Badge>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          {selectedTrail && (
            <div className="pt-2 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg text-white">
                <span className="text-xs font-semibold">AI Risk Score</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-sm font-bold">
                    {trails.find((t) => t.id === selectedTrail.id)?.aiRiskScore}/10
                  </span>
                </div>
              </div>

              <div className="space-y-2 bg-gradient-to-br from-emerald-50 to-green-100 p-3 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium">Elevation</span>
                  <span className="font-bold text-emerald-700">
                    {trails.find((t) => t.id === selectedTrail.id)?.elevation}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium">Difficulty</span>
                  <span className="font-bold text-emerald-700">
                    {trails.find((t) => t.id === selectedTrail.id)?.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium">Coordinates</span>
                  <span className="font-mono text-[10px] text-emerald-700">
                    {trails.find((t) => t.id === selectedTrail.id)?.coords.lat.toFixed(6)},
                    {trails.find((t) => t.id === selectedTrail.id)?.coords.lng.toFixed(6)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">Based on weather, terrain, and recent reports</div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedTrail && (onStreetViewClick || onDirectionsClick || onInteractiveTourClick) && (
            <div className="pt-3 border-t border-gray-200 space-y-2">
              {onDirectionsClick && (
                <Button
                  onClick={() => onDirectionsClick(selectedTrail)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              )}
              {onStreetViewClick && (
                <Button
                  onClick={() => onStreetViewClick(selectedTrail)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Street View
                </Button>
              )}
              {onInteractiveTourClick && (
                <Button
                  onClick={() => onInteractiveTourClick(selectedTrail)}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 text-white shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Interactive Tour
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
