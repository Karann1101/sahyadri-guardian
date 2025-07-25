import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { trailData, weatherData, hazardReports } = await request.json()

    const prompt = `
    You are an AI safety expert for trekking trails in the Western Ghats. 
    Analyze the following data and provide a risk assessment:

    Trail Information:
    - Name: ${trailData.name}
    - Elevation: ${trailData.elevation}m
    - Distance: ${trailData.distance}km
    - Terrain Type: ${trailData.terrain}

    Current Weather:
    - Temperature: ${weatherData.temperature}°C
    - Humidity: ${weatherData.humidity}%
    - Rainfall (last 24h): ${weatherData.rainfall}mm
    - Wind Speed: ${weatherData.windSpeed}km/h
    - Visibility: ${weatherData.visibility}km

    Recent Hazard Reports:
    ${hazardReports
      .map((hazard: any) => `- ${hazard.type}: ${hazard.description} (Severity: ${hazard.severity})`)
      .join("\n")}

    Please provide:
    1. Overall Risk Score (0-10)
    2. Landslide Risk Level (Low/Moderate/High/Extreme)
    3. Flash Flood Risk Level (Low/Moderate/High/Extreme)
    4. Specific recommendations for trekkers
    5. Weather-related warnings

    Format your response as JSON with the following structure:
    {
      "overallRiskScore": number,
      "landslideRisk": "Low" | "Moderate" | "High" | "Extreme",
      "flashFloodRisk": "Low" | "Moderate" | "High" | "Extreme",
      "recommendations": string[],
      "weatherWarnings": string[],
      "summary": string
    }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are a professional trail safety AI assistant with expertise in Western Ghats geography, weather patterns, and trekking hazards. Always prioritize safety and provide actionable advice.",
    })

    // Parse the AI response
    let riskAssessment
    try {
      riskAssessment = JSON.parse(text)
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      riskAssessment = {
        overallRiskScore: 5,
        landslideRisk: "Moderate",
        flashFloodRisk: "Moderate",
        recommendations: ["Check weather conditions before starting", "Carry emergency supplies"],
        weatherWarnings: ["Monitor rainfall levels"],
        summary: "Moderate risk conditions detected. Exercise caution.",
      }
    }

    return NextResponse.json(riskAssessment)
  } catch (error) {
    console.error("Risk assessment error:", error)
    return NextResponse.json({ error: "Failed to generate risk assessment" }, { status: 500 })
  }
}
