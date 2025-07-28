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
          <MapContainer
            selectedTrail={selectedTrail}
            userLocation={location ?? null}
            onHazardReport={(loc) => {
              setHazardLocation(loc)
              setShowHazardModal(true)
            }}
          />

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
