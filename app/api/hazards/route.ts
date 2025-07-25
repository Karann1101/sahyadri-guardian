import { type NextRequest, NextResponse } from "next/server"

// In a real app, this would connect to your database
const hazardReports: any[] = [
  {
    id: 1,
    lat: 18.369,
    lng: 73.759,
    type: "landslide",
    severity: "high",
    description: "Recent landslide blocking trail",
    reportedAt: new Date(),
    status: "verified",
    reportedBy: "user123",
  },
  {
    id: 2,
    lat: 18.247,
    lng: 73.68,
    type: "slippery_rock",
    severity: "moderate",
    description: "Wet rocks after recent rainfall",
    reportedAt: new Date(),
    status: "verified",
    reportedBy: "user456",
  },
]

export async function GET() {
  return NextResponse.json(hazardReports)
}

export async function POST(request: NextRequest) {
  try {
    const newHazard = await request.json()

    const hazardReport = {
      id: Date.now(),
      ...newHazard,
      reportedAt: new Date(),
      status: "pending",
    }

    hazardReports.push(hazardReport)

    // In a real app, you would:
    // 1. Save to database
    // 2. Send real-time updates to connected clients
    // 3. Trigger notifications to nearby users
    // 4. Update AI risk models

    return NextResponse.json(hazardReport, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hazard report" }, { status: 500 })
  }
}
