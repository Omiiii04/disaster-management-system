import { db } from '@/db';
import { alerts } from '@/db/schema';

async function main() {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
    const oneHourAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));
    const thirtyMinutesAgo = new Date(now.getTime() - (30 * 60 * 1000));
    const fifteenMinutesAgo = new Date(now.getTime() - (15 * 60 * 1000));

    const sampleAlerts = [
        {
            type: 'Hurricane Warning',
            location: 'Coastal Region A',
            severity: 'critical',
            description: 'Category 3 hurricane approaching coast. Evacuation orders in effect for zones 1-3.',
            timestamp: twoHoursAgo.toISOString(),
            isActive: true,
        },
        {
            type: 'Flood Advisory',
            location: 'River Valley B',
            severity: 'warning',
            description: 'Heavy rainfall causing river levels to rise. Monitor conditions and avoid low-lying areas.',
            timestamp: oneHourAgo.toISOString(),
            isActive: true,
        },
        {
            type: 'Wildfire Alert',
            location: 'Forest Area C',
            severity: 'critical',
            description: 'Fast-moving wildfire spreading east. Immediate evacuation required for Mountain Ridge communities.',
            timestamp: thirtyMinutesAgo.toISOString(),
            isActive: true,
        },
        {
            type: 'Earthquake Warning',
            location: 'Metropolitan Area',
            severity: 'advisory',
            description: 'Seismic activity detected. Be prepared for potential aftershocks in the next 24 hours.',
            timestamp: fifteenMinutesAgo.toISOString(),
            isActive: true,
        }
    ];

    await db.insert(alerts).values(sampleAlerts);
    
    console.log('✅ Alerts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});