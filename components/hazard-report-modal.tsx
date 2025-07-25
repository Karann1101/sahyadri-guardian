"use client"

import type React from "react"

import { useState } from "react"
import { X, Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HazardReportModalProps {
  location: { lat: number; lng: number }
  onClose: () => void
  onSubmit: (report: any) => void
}

export function HazardReportModal({ location, onClose, onSubmit }: HazardReportModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    description: "",
    photo: null as File | null,
  })

  const hazardTypes = [
    { value: "landslide", label: "Landslide" },
    { value: "fallen_tree", label: "Fallen Tree" },
    { value: "slippery_rock", label: "Slippery Rock" },
    { value: "flash_flood", label: "Flash Flood" },
    { value: "trail_damage", label: "Trail Damage" },
    { value: "wildlife", label: "Wildlife Encounter" },
    { value: "other", label: "Other" },
  ]

  const severityLevels = [
    { value: "low", label: "Low - Minor inconvenience" },
    { value: "moderate", label: "Moderate - Requires caution" },
    { value: "high", label: "High - Dangerous, avoid area" },
    { value: "extreme", label: "Extreme - Trail impassable" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const report = {
      ...formData,
      location,
      timestamp: new Date(),
      id: Date.now(), // Simple ID generation
    }

    onSubmit(report)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Report Hazard</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Hazard Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hazard type" />
                </SelectTrigger>
                <SelectContent>
                  {hazardTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the hazard in detail..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("photo")?.click()}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {formData.photo ? formData.photo.name : "Add Photo"}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!formData.type || !formData.severity || !formData.description}
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
