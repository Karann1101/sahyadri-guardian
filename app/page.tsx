"use client"

import { useState } from "react"
import { MapContainer } from "@/components/map-container"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { HazardReportModal } from "@/components/hazard-report-modal"
import { WeatherPanel } from "@/components/weather-panel"
import { TrailSelector } from "@/components/trail-selector"
import { useAuth } from "@/hooks/use-auth"
import { useGeolocation } from "@/hooks/use-geolocation"
import Signup from "@/components/signup"
import Advanced3DMap from "@/components/advanced-3d-map"

export default function HomePage() {
  const [selectedTrail, setSelectedTrail] = useState<string | null>(null)
  const [showHazardModal, setShowHazardModal] = useState(false)
  const [hazardLocation, setHazardLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const { location, error: locationError } = useGeolocation()

  // Show Signup if user not logged in
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Signup />
      </div>
    )
  }

  // Coordinates for each trek
  const TRAIL_COORDS: Record<string, { lat: number; lng: number }> = {
    "Sinhagad Fort Trek": { lat: 18.3656639, lng: 73.7552694 },
    "Rajgad Fort Trek": { lat: 18.2459862, lng: 73.6821929 },
    "Torna Fort Trek": { lat: 18.2760722, lng: 73.6227167 },
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedTrail={selectedTrail}
        onTrailSelect={setSelectedTrail}
      />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="flex-1 relative">
          {selectedTrail && Object.prototype.hasOwnProperty.call(TRAIL_COORDS, selectedTrail) ? (
            <Advanced3DMap center={TRAIL_COORDS[selectedTrail]} zoom={18} name={selectedTrail} />
          ) : (
            <MapContainer
              selectedTrail={selectedTrail}
              userLocation={location ?? null}
              onHazardReport={(loc) => {
                setHazardLocation(loc)
                setShowHazardModal(true)
              }}
            />
          )}

          <div className="absolute top-4 right-4 space-y-4">
            <WeatherPanel />
            <TrailSelector selectedTrail={selectedTrail} onTrailSelect={setSelectedTrail} />
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
          onSubmit={(report) => {
            console.log("Hazard report:", report)
            setShowHazardModal(false)
          }}
        />
      )}
    </div>
  )
}
