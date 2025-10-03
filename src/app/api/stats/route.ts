import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { stats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const statsRecord = await db.select()
      .from(stats)
      .limit(1);

    if (statsRecord.length === 0) {
      return NextResponse.json({ error: 'Stats record not found' }, { status: 404 });
    }

    return NextResponse.json(statsRecord[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { activeIncidents, peopleAssisted, sheltersActive, coverageAreas } = requestBody;

    // Validate that at least one field is provided for update
    if (activeIncidents === undefined && peopleAssisted === undefined && 
        sheltersActive === undefined && coverageAreas === undefined) {
      return NextResponse.json({ 
        error: "At least one field must be provided for update",
        code: "NO_UPDATE_FIELDS" 
      }, { status: 400 });
    }

    // Validate numeric fields are >= 0
    const fieldsToValidate = [
      { field: activeIncidents, name: 'activeIncidents' },
      { field: peopleAssisted, name: 'peopleAssisted' },
      { field: sheltersActive, name: 'sheltersActive' },
      { field: coverageAreas, name: 'coverageAreas' }
    ];

    for (const { field, name } of fieldsToValidate) {
      if (field !== undefined && (typeof field !== 'number' || field < 0)) {
        return NextResponse.json({ 
          error: `${name} must be a number >= 0`,
          code: "INVALID_FIELD_VALUE" 
        }, { status: 400 });
      }
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(stats)
      .where(eq(stats.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Stats record not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      lastUpdated: new Date().toISOString()
    };

    if (activeIncidents !== undefined) updateData.activeIncidents = activeIncidents;
    if (peopleAssisted !== undefined) updateData.peopleAssisted = peopleAssisted;
    if (sheltersActive !== undefined) updateData.sheltersActive = sheltersActive;
    if (coverageAreas !== undefined) updateData.coverageAreas = coverageAreas;

    const updated = await db.update(stats)
      .set(updateData)
      .where(eq(stats.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Failed to update stats record' }, { status: 500 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}