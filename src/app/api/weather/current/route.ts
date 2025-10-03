import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { weatherData } from '@/db/schema';
import { eq, desc, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    let query = db.select().from(weatherData);

    if (location) {
      query = query.where(like(weatherData.location, `%${location}%`));
    }

    // Get the most recent weather data
    const results = await query
      .orderBy(desc(weatherData.timestamp))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json({ error: 'No weather data found' }, { status: 404 });
    }

    const currentWeather = results[0];

    return NextResponse.json({
      success: true,
      data: {
        location: currentWeather.location,
        timestamp: currentWeather.timestamp,
        current: {
          temperature: currentWeather.temperature,
          humidity: currentWeather.humidity,
          windSpeed: currentWeather.windSpeed,
          conditions: currentWeather.conditions,
        },
      },
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { temperature, windSpeed, humidity, conditions, location } = body;

    // Validate required fields
    if (temperature === undefined || windSpeed === undefined || 
        humidity === undefined || !conditions || !location) {
      return NextResponse.json({
        error: 'Temperature, windSpeed, humidity, conditions, and location are required',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Validate field ranges
    if (typeof temperature !== 'number' || temperature < -50 || temperature > 60) {
      return NextResponse.json({
        error: 'Temperature must be a number between -50 and 60 degrees Celsius',
        code: 'INVALID_TEMPERATURE'
      }, { status: 400 });
    }

    if (typeof windSpeed !== 'number' || windSpeed < 0) {
      return NextResponse.json({
        error: 'Wind speed must be a number >= 0',
        code: 'INVALID_WIND_SPEED'
      }, { status: 400 });
    }

    if (typeof humidity !== 'number' || humidity < 0 || humidity > 100) {
      return NextResponse.json({
        error: 'Humidity must be a number between 0 and 100',
        code: 'INVALID_HUMIDITY'
      }, { status: 400 });
    }

    const newWeatherData = await db.insert(weatherData).values({
      temperature,
      windSpeed,
      humidity,
      conditions: conditions.trim(),
      location: location.trim(),
      timestamp: new Date().toISOString(),
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Weather data created successfully',
      data: newWeatherData[0],
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}