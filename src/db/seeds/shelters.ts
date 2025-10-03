import { db } from '@/db';
import { shelters } from '@/db/schema';

async function main() {
    const sampleShelters = [
        {
            name: 'Central Community Shelter',
            address: '123 Main Street, Downtown',
            latitude: 40.7589,
            longitude: -73.9851,
            capacity: 500,
            available: 320,
            amenities: ['Food', 'Medical', 'WiFi', 'Security'],
            contact: '(555) 123-4567',
            status: 'open',
            distance: '0.8 miles'
        },
        {
            name: 'North District Emergency Center',
            address: '456 North Avenue, North Side',
            latitude: 40.7831,
            longitude: -73.9712,
            capacity: 350,
            available: 180,
            amenities: ['Food', 'Medical', 'Bedding', 'Showers'],
            contact: '(555) 234-5678',
            status: 'open',
            distance: '2.1 miles'
        },
        {
            name: 'Riverside Evacuation Hub',
            address: '789 River Road, Riverside',
            latitude: 40.7505,
            longitude: -74.0134,
            capacity: 600,
            available: 450,
            amenities: ['Food', 'Medical', 'WiFi', 'Showers', 'Pet Friendly'],
            contact: '(555) 345-6789',
            status: 'open',
            distance: '1.5 miles'
        },
        {
            name: 'West End Relief Station',
            address: '321 West Boulevard, West End',
            latitude: 40.7410,
            longitude: -74.0123,
            capacity: 400,
            available: 280,
            amenities: ['Food', 'Medical', 'Bedding', 'WiFi'],
            contact: '(555) 456-7890',
            status: 'open',
            distance: '3.2 miles'
        },
        {
            name: 'East Side Support Center',
            address: '987 East Street, East Side',
            latitude: 40.7614,
            longitude: -73.9776,
            capacity: 450,
            available: 120,
            amenities: ['Food', 'Medical', 'Security', 'Childcare'],
            contact: '(555) 567-8901',
            status: 'limited',
            distance: '1.8 miles'
        }
    ];

    await db.insert(shelters).values(sampleShelters);
    
    console.log('✅ Shelters seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});