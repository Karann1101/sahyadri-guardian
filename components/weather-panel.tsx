"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function WeatherPanel() {
  const [weather, setWeather] = useState({
    temperature: 24,
    humidity: 78,
    windSpeed: 12,
    condition: "cloudy",
    rainfall: 2.5,
    visibility: 8,
  })

  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    setNow(new Date().toLocaleTimeString());
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-500" />
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />
    }
  }

  const getRainfallRisk = (rainfall: number) => {
    if (rainfall < 1) return { level: "Low", color: "bg-green-100 text-green-800" }
    if (rainfall < 5) return { level: "Moderate", color: "bg-yellow-100 text-yellow-800" }
    if (rainfall < 10) return { level: "High", color: "bg-orange-100 text-orange-800" }
    return { level: "Extreme", color: "bg-red-100 text-red-800" }
  }

  const rainfallRisk = getRainfallRisk(weather.rainfall)

  return (
    <Card className="w-64 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          {getWeatherIcon(weather.condition)}
          <span className="ml-2">Weather Conditions</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Thermometer className="h-3 w-3 mr-1 text-red-500" />
            {weather.temperature}°C
          </div>
          <div className="flex items-center">
            <Droplets className="h-3 w-3 mr-1 text-blue-500" />
            {weather.humidity}%
          </div>
          <div className="flex items-center">
            <Wind className="h-3 w-3 mr-1 text-gray-500" />
            {weather.windSpeed} km/h
          </div>
          <div className="flex items-center">
            <CloudRain className="h-3 w-3 mr-1 text-blue-600" />
            {weather.rainfall}mm
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Flash Flood Risk</span>
            <Badge className={rainfallRisk.color}>{rainfallRisk.level}</Badge>
          </div>
        </div>

        <div className="text-xs text-gray-500">Last updated: {now ? now : null}</div>
      </CardContent>
    </Card>
  )
}
