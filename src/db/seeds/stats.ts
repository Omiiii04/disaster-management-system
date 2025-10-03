import { db } from '@/db';
import { stats } from '@/db/schema';

async function main() {
    const sampleStats = [
        {
            activeIncidents: 12,
            peopleAssisted: 1234,
            sheltersActive: 8,
            coverageAreas: 25,
            lastUpdated: new Date().toISOString(),
        }
    ];

    await db.insert(stats).values(sampleStats);
    
    console.log('✅ Stats seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});