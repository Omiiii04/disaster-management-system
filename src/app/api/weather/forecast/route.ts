import { NextRequest, NextResponse } from 'next/server'

// Simulating Django/FastAPI weather forecast endpoint
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location') || 'Default Location'
    const days = parseInt(searchParams.get('days') || '5')

    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Windy', 'Partly Cloudy']
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    // Generate forecast data
    const forecast = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[date.getDay()],
        temperature: {
          min: Math.floor(Math.random() * 10) + 18,
          max: Math.floor(Math.random() * 10) + 28,
          avg: Math.floor(Math.random() * 10) + 23,
        },
        conditions: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 30) + 60,
        windSpeed: Math.floor(Math.random() * 40) + 10,
        precipitation: Math.floor(Math.random() * 80),
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        location: location,
        forecast: forecast,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    )
  }
}