"use client"

import { useEffect, useState } from "react"
import MapContainer from "@/components/map-container.fixed"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { HazardReportModal } from "@/components/hazard-report-modal"
import { WeatherPanel } from "@/components/weather-panel"
import { TrailSelector } from "@/components/trail-selector"
import { useGeolocation } from "@/hooks/use-geolocation"
import Advanced3DMap from "@/components/advanced-3d-map"
import FortStreetViewModal from "@/components/fort-street-view-modal"
import TrekkingDirections from "@/components/trekking-directions"
import InteractiveFortTour from "@/components/interactive-fort-tour"

const TRAILS = [
  {
    id: 1,
    name: "Sinhagad Fort Trek",
    coords: { lat: 18.365664, lng: 73.755269 }, // previous center, but Wikipedia: 18°21′56.39″N 73°45′18.97″E = 18.365664, 73.755269
    riskLevel: "moderate",
    aiRiskScore: 6.2,
    // Wikipedia: 18°21′56.39″N 73°45′18.97″E => 18.365664, 73.755269
  },
  {
    id: 2,
    name: "Rajgad Fort Trek",
    coords: { lat: 18.246111, lng: 73.682222 }, // Wikipedia: 18°14′46″N 73°40′56″E = 18.246111, 73.682222
    riskLevel: "high",
    aiRiskScore: 8.1,
    // Wikipedia: 18°14′46″N 73°40′56″E => 18.246111, 73.682222
  },
  {
    id: 3,
    name: "Torna Fort Trek",
    coords: { lat: 18.276072, lng: 73.622716 }, // previous center, but Wikipedia: 18°16′33.86″N 73°37′21.78″E = 18.276072, 73.622716
    riskLevel: "low",
    aiRiskScore: 3.4,
    // Wikipedia: 18°16′33.86″N 73°37′21.78″E => 18.276072, 73.622716
  },
]

export default function HomePage() {
  const [selectedTrail, setSelectedTrail] = useState<any>(null)
  const [showHazardModal, setShowHazardModal] = useState(false)
  const [hazardLocation, setHazardLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showStreetViewModal, setShowStreetViewModal] = useState(false)
  const [selectedFortForStreetView, setSelectedFortForStreetView] = useState<any>(null)
  const [showDirectionsModal, setShowDirectionsModal] = useState(false)
  const [selectedFortForDirections, setSelectedFortForDirections] = useState<any>(null)
  const [showInteractiveTourModal, setShowInteractiveTourModal] = useState(false)
  const [selectedFortForTour, setSelectedFortForTour] = useState<any>(null)
  const { location, error: locationError } = useGeolocation()
  const [hazards, setHazards] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/hazards")
      .then((res) => res.json())
      .then((data) => setHazards(Array.isArray(data) ? data : []))
      .catch(() => setHazards([]))
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedTrail={selectedTrail}
        onTrailSelect={setSelectedTrail}
      />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} user={null} hazards={hazards} />

        <div className="flex-1 relative">
          {selectedTrail && selectedTrail.coords ? (
            <Advanced3DMap center={selectedTrail.coords} zoom={18} name={selectedTrail.name} />
          ) : (
            <MapContainer
              selectedTrail={selectedTrail}
              userLocation={location ?? null}
              onHazardReport={(loc) => {
                setHazardLocation(loc)
                setShowHazardModal(true)
              }}
              onDirectionsClick={(trail) => {
                setSelectedFortForDirections(trail)
                setShowDirectionsModal(true)
              }}
            />
          )}

          <div className="absolute top-4 right-4 space-y-4">
            <WeatherPanel />
            <TrailSelector 
              selectedTrail={selectedTrail} 
              onTrailSelect={setSelectedTrail}
              onStreetViewClick={(trail) => {
                setSelectedFortForStreetView(trail)
                setShowStreetViewModal(true)
              }}
              onDirectionsClick={(trail) => {
                setSelectedFortForDirections(trail)
                setShowDirectionsModal(true)
              }}
              onInteractiveTourClick={(trail) => {
                setSelectedFortForTour(trail)
                setShowInteractiveTourModal(true)
              }}
            />
          </div>

          {locationError && (
            <div className="absolute bottom-4 left-4 bg-red-100 text-red-600 px-3 py-2 rounded shadow">
              Could not access location: {locationError}
            </div>
          )}
        </div>
      </div>

      {showHazardModal && hazardLocation && (
        <HazardReportModal
          location={hazardLocation}
          onClose={() => setShowHazardModal(false)}
          onSubmit={async (report) => {
            try {
              const res = await fetch("/api/hazards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  lat: report.location.lat,
                  lng: report.location.lng,
                  type: report.type,
                  severity: report.severity,
                  description: report.description,
                }),
              })
              if (res.ok) {
                const newHazard = await res.json()
                setHazards((prev) => [newHazard, ...prev])
              }
            } catch (e) {
              // Optionally show error toast
            }
            setShowHazardModal(false)
          }}
        />
      )}

      {/* Street View Modal */}
      <FortStreetViewModal
        isOpen={showStreetViewModal}
        onClose={() => {
          setShowStreetViewModal(false)
          setSelectedFortForStreetView(null)
        }}
        selectedFort={selectedFortForStreetView}
      />

      {/* Interactive Tour Modal */}
      <InteractiveFortTour
        isOpen={showInteractiveTourModal}
        onClose={() => {
          setShowInteractiveTourModal(false)
          setSelectedFortForTour(null)
        }}
        selectedFort={selectedFortForTour ? {
          name: selectedFortForTour.name,
          coords: selectedFortForTour.coords,
          difficulty: selectedFortForTour.difficulty || "Moderate",
          elevation: selectedFortForTour.elevation || "1,312 meters",
          riskLevel: selectedFortForTour.riskLevel || "low"
        } : null}
      />

      {/* Trekking Directions Modal */}
      {showDirectionsModal && selectedFortForDirections && (
        <TrekkingDirections
          destination={{
            lat: selectedFortForDirections.coords.lat,
            lng: selectedFortForDirections.coords.lng,
            name: selectedFortForDirections.name
          }}
          userLocation={location}
          onClose={() => {
            setShowDirectionsModal(false)
            setSelectedFortForDirections(null)
          }}
        />
      )}
    </div>
  )
}
