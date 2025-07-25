"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Navigation, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
// Remove this line. The 'google' object is available globally after loading the Google Maps JS API in your HTML.

interface MapContainerProps {
  selectedTrail: any
  userLocation: { lat: number; lng: number } | null
  onHazardReport: (location: { lat: number; lng: number }) => void
}

export function MapContainer({ selectedTrail, userLocation, onHazardReport }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isReportMode, setIsReportMode] = useState(false)

  // Sample trail data for Western Ghats around Pune
  const trails = [
    {
      id: 1,
      name: "Sinhagad Fort Trek",
      riskLevel: "moderate",
      path: [
        { lat: 18.3664, lng: 73.7556 },
        { lat: 18.368, lng: 73.758 },
        { lat: 18.37, lng: 73.76 },
        { lat: 18.372, lng: 73.762 },
      ],
    },
    {
      id: 2,
      name: "Rajgad Fort Trek",
      riskLevel: "high",
      path: [
        { lat: 18.2456, lng: 73.6789 },
        { lat: 18.248, lng: 73.682 },
        { lat: 18.25, lng: 73.685 },
        { lat: 18.252, lng: 73.688 },
      ],
    },
  ]

  // Sample hazard data
  const hazards = [
    {
      id: 1,
      lat: 18.369,
      lng: 73.759,
      type: "landslide",
      severity: "high",
      description: "Recent landslide blocking trail",
      reportedAt: new Date(),
    },
    {
      id: 2,
      lat: 18.247,
      lng: 73.68,
      type: "slippery_rock",
      severity: "moderate",
      description: "Wet rocks after recent rainfall",
      reportedAt: new Date(),
    },
  ]

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize Google Map
    const googleMap = new google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 }, // Pune coordinates
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    setMap(googleMap)

    // Add click listener for hazard reporting
    googleMap.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (isReportMode && event.latLng) {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
        onHazardReport(location)
        setIsReportMode(false)
      }
    })

    return () => {
      // Cleanup
    }
  }, [isReportMode, onHazardReport])

  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    const newMarkers: google.maps.Marker[] = []

    // Add trail polylines
    trails.forEach((trail) => {
      const polyline = new google.maps.Polyline({
        path: trail.path,
        geodesic: true,
        strokeColor: getRiskColor(trail.riskLevel),
        strokeOpacity: 1.0,
        strokeWeight: 4,
      })

      polyline.setMap(map)

      // Add risk level markers at trail start
      const riskMarker = new google.maps.Marker({
        position: trail.path[0],
        map: map,
        title: `${trail.name} - Risk: ${trail.riskLevel}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getRiskColor(trail.riskLevel),
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
      })

      newMarkers.push(riskMarker)
    })

    // Add hazard markers
    hazards.forEach((hazard) => {
      const hazardMarker = new google.maps.Marker({
        position: { lat: hazard.lat, lng: hazard.lng },
        map: map,
        title: hazard.description,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: getSeverityColor(hazard.severity),
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#000000",
        },
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${hazard.type.replace("_", " ")}</h3>
            <p class="text-sm text-gray-600">${hazard.description}</p>
            <p class="text-xs text-gray-500 mt-1">
              Reported: ${hazard.reportedAt.toLocaleDateString()}
            </p>
          </div>
        `,
      })

      hazardMarker.addListener("click", () => {
        infoWindow.open(map, hazardMarker)
      })

      newMarkers.push(hazardMarker)
    })

    // Add user location marker
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        },
      })

      newMarkers.push(userMarker)
    }

    setMarkers(newMarkers)
  }, [map, userLocation])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "#22c55e"
      case "moderate":
        return "#f59e0b"
      case "high":
        return "#ef4444"
      case "extreme":
        return "#7c2d12"
      default:
        return "#6b7280"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "#fbbf24"
      case "moderate":
        return "#f97316"
      case "high":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <Button
          onClick={() => setIsReportMode(!isReportMode)}
          variant={isReportMode ? "destructive" : "default"}
          size="sm"
          className="shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isReportMode ? "Cancel Report" : "Report Hazard"}
        </Button>

        {userLocation && (
          <Button
            onClick={() => {
              if (map) {
                map.setCenter(userLocation)
                map.setZoom(15)
              }
            }}
            variant="outline"
            size="sm"
            className="shadow-lg bg-white"
          >
            <Navigation className="h-4 w-4 mr-2" />
            My Location
          </Button>
        )}
      </div>

      {/* Risk Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h3 className="text-sm font-semibold mb-2">Risk Levels</h3>
        <div className="space-y-1">
          {[
            { level: "Low", color: "#22c55e" },
            { level: "Moderate", color: "#f59e0b" },
            { level: "High", color: "#ef4444" },
            { level: "Extreme", color: "#7c2d12" },
          ].map(({ level, color }) => (
            <div key={level} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {isReportMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="destructive" className="animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Click on map to report hazard
          </Badge>
        </div>
      )}
    </div>
  )
}
