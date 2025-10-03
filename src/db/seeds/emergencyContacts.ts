import { db } from '@/db';
import { emergencyContacts } from '@/db/schema';

async function main() {
    const sampleEmergencyContacts = [
        {
            category: 'Emergency Services',
            name: '911 Emergency',
            number: '911',
            iconName: 'phone',
        },
        {
            category: 'Emergency Services',
            name: 'Fire Department',
            number: '(555) 123-4567',
            iconName: 'phone',
        },
        {
            category: 'Emergency Services',
            name: 'Police Department',
            number: '(555) 234-5678',
            iconName: 'shield',
        },
        {
            category: 'Emergency Services',
            name: 'Emergency Medical Services',
            number: '(555) 345-6789',
            iconName: 'medical',
        },
        {
            category: 'Disaster Response',
            name: 'FEMA Regional Office',
            number: '1-800-621-3362',
            iconName: 'building',
        },
        {
            category: 'Disaster Response',
            name: 'Red Cross Emergency',
            number: '1-800-733-2767',
            iconName: 'heart',
        },
        {
            category: 'Disaster Response',
            name: 'Emergency Management',
            number: '(555) 456-7890',
            iconName: 'alert-triangle',
        },
        {
            category: 'Disaster Response',
            name: 'National Weather Service',
            number: '(555) 567-8901',
            iconName: 'cloud',
        },
        {
            category: 'Support Services',
            name: 'Crisis Counseling',
            number: '1-800-985-5990',
            iconName: 'user-heart',
        },
        {
            category: 'Support Services',
            name: 'Disaster Relief Hotline',
            number: '1-800-453-7381',
            iconName: 'headphones',
        },
        {
            category: 'Support Services',
            name: 'Pet Rescue Services',
            number: '(555) 678-9012',
            iconName: 'pet',
        },
        {
            category: 'Support Services',
            name: 'Food & Water Distribution',
            number: '(555) 789-0123',
            iconName: 'truck',
        }
    ];

    await db.insert(emergencyContacts).values(sampleEmergencyContacts);
    
    console.log('✅ Emergency contacts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});