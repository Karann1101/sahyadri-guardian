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

export default function HomePage() {
  const [selectedTrail, setSelectedTrail] = useState(null)
  const [showHazardModal, setShowHazardModal] = useState(false)
  const [hazardLocation, setHazardLocation] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const { location, error: locationError } = useGeolocation()

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
            userLocation={location}
            onHazardReport={(location) => {
              setHazardLocation(location)
              setShowHazardModal(true)
            }}
          />

          <div className="absolute top-4 right-4 space-y-4">
            <WeatherPanel />
            <TrailSelector selectedTrail={selectedTrail} onTrailSelect={setSelectedTrail} />
          </div>
        </div>
      </div>

      {showHazardModal && (
        <HazardReportModal
          location={hazardLocation}
          onClose={() => setShowHazardModal(false)}
          onSubmit={(report) => {
            // Handle hazard report submission
            console.log("Hazard report:", report)
            setShowHazardModal(false)
          }}
        />
      )}
    </div>
  )
}
