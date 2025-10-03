import { db } from '@/db';
import { evacuationRoutes } from '@/db/schema';

async function main() {
    const sampleRoutes = [
        {
            name: 'Route A - Coastal Exit',
            routeFrom: 'Coastal Areas',
            routeTo: 'Highland Safety Zone',
            status: 'open',
            traffic: 'light',
            distance: '15 km',
            description: 'Primary coastal evacuation route via Highway 1'
        },
        {
            name: 'Route B - Highway 45',
            routeFrom: 'City Center',
            routeTo: 'Mountain Refuge',
            status: 'congested',
            traffic: 'heavy',
            distance: '22 km',
            description: 'Main highway route to mountain safe zone'
        },
        {
            name: 'Route C - Valley Road',
            routeFrom: 'Valley Region',
            routeTo: 'Northern Safe Zone',
            status: 'closed',
            traffic: 'blocked',
            distance: '18 km',
            description: 'CLOSED: Bridge damage from recent flooding'
        }
    ];

    await db.insert(evacuationRoutes).values(sampleRoutes);
    
    console.log('✅ Evacuation routes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});