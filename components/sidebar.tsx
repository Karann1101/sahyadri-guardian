"use client"

import { X, Mountain, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  open: boolean
  onClose: () => void
  selectedTrail: any
  onTrailSelect: (trail: any) => void
}

export function Sidebar({ open, onClose, selectedTrail, onTrailSelect }: SidebarProps) {
  const trails = [
    {
      id: 1,
      name: "Sinhagad Fort Trek",
      distance: "3.2 km",
      elevation: "1,312 m",
      difficulty: "Moderate",
      riskLevel: "moderate",
      activeHazards: 2,
    },
    {
      id: 2,
      name: "Rajgad Fort Trek",
      distance: "5.8 km",
      elevation: "1,376 m",
      difficulty: "Hard",
      riskLevel: "high",
      activeHazards: 4,
    },
    {
      id: 3,
      name: "Torna Fort Trek",
      distance: "4.1 km",
      elevation: "1,403 m",
      difficulty: "Moderate",
      riskLevel: "low",
      activeHazards: 1,
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:relative md:inset-auto">
      <div className="absolute inset-0 bg-black/50 md:hidden" onClick={onClose} />

      <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl md:relative md:shadow-none">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Trail Explorer</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Today's Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Trekkers</span>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  127
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Hazards</span>
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />7
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weather Risk</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Moderate
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Trail List */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Popular Trails</h3>
            <div className="space-y-3">
              {trails.map((trail) => (
                <Card
                  key={trail.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedTrail?.id === trail.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => onTrailSelect(trail)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Mountain className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium">{trail.name}</h4>
                      </div>
                      <Badge className={getRiskColor(trail.riskLevel)}>{trail.riskLevel}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                      <div>Distance: {trail.distance}</div>
                      <div>Elevation: {trail.elevation}</div>
                      <div>Difficulty: {trail.difficulty}</div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
                        {trail.activeHazards} hazards
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              <div className="text-xs p-2 bg-red-50 rounded">
                <span className="font-medium">Landslide reported</span> on Sinhagad trail
                <div className="text-gray-500">2 hours ago</div>
              </div>
              <div className="text-xs p-2 bg-yellow-50 rounded">
                <span className="font-medium">Weather alert</span> for Rajgad area
                <div className="text-gray-500">4 hours ago</div>
              </div>
              <div className="text-xs p-2 bg-green-50 rounded">
                <span className="font-medium">Trail cleared</span> on Torna fort
                <div className="text-gray-500">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
