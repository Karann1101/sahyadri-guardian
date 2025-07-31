"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from 'next/dynamic'
import { AlertTriangle, Navigation, Plus } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface Feature {
  name: string
  color: string
  path: Array<{ lat: number; lng: number }>
}

interface Trail {
  id: number
  name: string
  path: Array<{ lat: number; lng: number }>
  features?: Feature[]
  riskLevel: string
}

interface MapContainerProps {
  selectedTrail: Trail | null
  userLocation: { lat: number; lng: number } | null
  onHazardReport: (location: { lat: number; lng: number }) => void
}

const BaseMapContainer = ({ selectedTrail, userLocation, onHazardReport }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<(google.maps.Marker | google.maps.Polygon | google.maps.Polyline)[]>([])
  const [isReportMode, setIsReportMode] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  // Utility function to compute centroid
  const getCentroid = (points: Array<{ lat: number; lng: number }>): google.maps.LatLngLiteral => {
    const sumLat = points.reduce((sum, point) => sum + point.lat, 0)
    const sumLng = points.reduce((sum, point) => sum + point.lng, 0)
    return {
      lat: sumLat / points.length,
      lng: sumLng / points.length,
    }
  }

  // Check if Google Maps API is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      setIsGoogleLoaded(true)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current) return

    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 18.5204, lng: 73.8567 }, // Pune coordinates
      zoom: 11,
      mapTypeId: window.google.maps.MapTypeId.TERRAIN,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    setMap(googleMap)

    return () => {
      // Cleanup if needed
    }
  }, [isGoogleLoaded])

  // Handle map click for hazard reporting
  useEffect(() => {
    if (!map || !isReportMode) return

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return
      
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
      onHazardReport(location)
      setIsReportMode(false)
    }

    const listener = map.addListener("click", handleMapClick)

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [map, isReportMode, onHazardReport])

  // Update trail visualization
  useEffect(() => {
    if (!map || !isGoogleLoaded) {
      markers.forEach(marker => marker.setMap(null))
      setMarkers([])
      return
    }

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: (google.maps.Marker | google.maps.Polygon | google.maps.Polyline)[] = []

    if (selectedTrail) {
      // Draw main boundary
      const mainBoundary = new google.maps.Polygon({
        paths: selectedTrail.path,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 4,
        fillColor: "#4a5568",
        fillOpacity: 0.1,
        map,
        zIndex: 20,
      })
      newMarkers.push(mainBoundary)

      // Add subdivisions for Torna Fort
      if (selectedTrail.name === "Torna Fort Trek" && selectedTrail.features) {
        selectedTrail.features.forEach(feature => {
          const featurePolygon = new google.maps.Polygon({
            paths: feature.path,
            strokeColor: feature.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: feature.color,
            fillOpacity: 0.2,
            map,
            zIndex: 21,
          })
          newMarkers.push(featurePolygon)

          // Add label for each feature
          const centroid = getCentroid(feature.path)
          const label = new google.maps.Marker({
            position: centroid,
            map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
            },
            label: {
              text: feature.name,
              color: feature.color,
              fontWeight: "bold",
              fontSize: "12px",
            },
          })
          newMarkers.push(label)
        })
      }

      // Fit bounds to trail
      const bounds = new google.maps.LatLngBounds()
      selectedTrail.path.forEach(point => bounds.extend(point))
      map.fitBounds(bounds)
    }

    setMarkers(newMarkers)
  }, [map, selectedTrail, isGoogleLoaded])

  // Update user location marker
  useEffect(() => {
    if (!map || !isGoogleLoaded || !userLocation) return

    const userMarker = new google.maps.Marker({
      position: userLocation,
      map,
      title: "Your Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      },
    })

    return () => {
      userMarker.setMap(null)
    }
  }, [map, userLocation, isGoogleLoaded])

  if (!isGoogleLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">Loading map...</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
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

export default dynamic(() => Promise.resolve(BaseMapContainer), {
  ssr: false,
})
