"use client"

import { Mountain, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TrailSelectorProps {
  selectedTrail: any
  onTrailSelect: (trail: any) => void
}

export function TrailSelector({ selectedTrail, onTrailSelect }: TrailSelectorProps) {
  const trails = [
    {
      id: 1,
      name: "Sinhagad Fort Trek",
      riskLevel: "moderate",
      aiRiskScore: 6.2,
    },
    {
      id: 2,
      name: "Rajgad Fort Trek",
      riskLevel: "high",
      aiRiskScore: 8.1,
    },
    {
      id: 3,
      name: "Torna Fort Trek",
      riskLevel: "low",
      aiRiskScore: 3.4,
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
    <Card className="w-64 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Mountain className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Select Trail</span>
          </div>

          <Select
            value={selectedTrail?.id?.toString() || ""}
            onValueChange={(value) => {
              const trail = trails.find((t) => t.id.toString() === value)
              onTrailSelect(trail)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a trail" />
            </SelectTrigger>
            <SelectContent>
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
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">AI Risk Score</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-orange-500" />
                  <span className="text-sm font-medium">
                    {trails.find((t) => t.id === selectedTrail.id)?.aiRiskScore}/10
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500">Based on weather, terrain, and recent reports</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
