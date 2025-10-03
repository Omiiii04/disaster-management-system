import { db } from '@/db';
import { weatherData } from '@/db/schema';

async function main() {
    const sampleWeatherData = [
        {
            temperature: 22.2,
            windSpeed: 24.1,
            humidity: 65,
            conditions: 'Partly Cloudy',
            location: 'Metropolitan Area',
            timestamp: new Date().toISOString(),
        },
        {
            temperature: 18.5,
            windSpeed: 12.8,
            humidity: 72,
            conditions: 'Cloudy',
            location: 'Downtown District',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            temperature: 25.3,
            windSpeed: 8.2,
            humidity: 58,
            conditions: 'Sunny',
            location: 'Suburban Area',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
            temperature: 20.1,
            windSpeed: 32.4,
            humidity: 78,
            conditions: 'Light Rain',
            location: 'Coastal Region',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
        {
            temperature: 16.7,
            windSpeed: 45.6,
            humidity: 85,
            conditions: 'Thunderstorm',
            location: 'Industrial Zone',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
        {
            temperature: 28.9,
            windSpeed: 6.5,
            humidity: 42,
            conditions: 'Clear',
            location: 'Airport Area',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
        },
        {
            temperature: 14.2,
            windSpeed: 18.7,
            humidity: 91,
            conditions: 'Heavy Rain',
            location: 'Mountain Region',
            timestamp: new Date(Date.now() - 21600000).toISOString(),
        }
    ];

    await db.insert(weatherData).values(sampleWeatherData);
    
    console.log('✅ Weather data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});