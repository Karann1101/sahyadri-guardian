import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  // In a real app, you would call a weather API like OpenWeatherMap
  // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}`)

  // For demo purposes, return mock data
  const mockWeatherData = {
    temperature: 24 + Math.random() * 10,
    humidity: 60 + Math.random() * 30,
    windSpeed: 5 + Math.random() * 15,
    rainfall: Math.random() * 10,
    visibility: 5 + Math.random() * 10,
    condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
    pressure: 1010 + Math.random() * 20,
    uvIndex: Math.floor(Math.random() * 11),
  }

  return NextResponse.json(mockWeatherData)
}
