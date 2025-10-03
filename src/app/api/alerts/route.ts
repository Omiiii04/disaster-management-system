import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { alerts } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const location = searchParams.get('location');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      const alert = await db.select()
        .from(alerts)
        .where(eq(alerts.id, parseInt(id)))
        .limit(1);

      if (alert.length === 0) {
        return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
      }
      return NextResponse.json(alert[0]);
    }

    // Build query with filters
    let query = db.select().from(alerts).where(eq(alerts.isActive, true));
    const conditions = [eq(alerts.isActive, true)];

    if (severity) {
      conditions.push(eq(alerts.severity, severity));
    }

    if (location) {
      conditions.push(like(alerts.location, `%${location}%`));
    }

    if (conditions.length > 1) {
      query = db.select().from(alerts).where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(alerts.timestamp))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: {
        alerts: results,
        total: results.length,
        lastUpdated: new Date().toISOString(),
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
    const { type, location, severity, description } = body;

    // Validate required fields
    if (!type || !location || !severity || !description) {
      return NextResponse.json({
        error: 'Type, location, severity, and description are required',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Validate severity
    const validSeverities = ['critical', 'warning', 'advisory'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json({
        error: 'Severity must be one of: critical, warning, advisory',
        code: 'INVALID_SEVERITY'
      }, { status: 400 });
    }

    const newAlert = await db.insert(alerts).values({
      type: type.trim(),
      location: location.trim(),
      severity: severity,
      description: description.trim(),
      timestamp: new Date().toISOString(),
      isActive: true,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Alert created successfully',
      data: newAlert[0],
    }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const body = await request.json();
    const { type, location, severity, description, isActive } = body;

    // Validate severity if provided
    if (severity) {
      const validSeverities = ['critical', 'warning', 'advisory'];
      if (!validSeverities.includes(severity)) {
        return NextResponse.json({
          error: 'Severity must be one of: critical, warning, advisory',
          code: 'INVALID_SEVERITY'
        }, { status: 400 });
      }
    }

    // Check if alert exists
    const existingAlert = await db.select()
      .from(alerts)
      .where(eq(alerts.id, parseInt(id)))
      .limit(1);

    if (existingAlert.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Build update object
    const updates: any = {};
    if (type !== undefined) updates.type = type.trim();
    if (location !== undefined) updates.location = location.trim();
    if (severity !== undefined) updates.severity = severity;
    if (description !== undefined) updates.description = description.trim();
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedAlert = await db.update(alerts)
      .set(updates)
      .where(eq(alerts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedAlert[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    // Check if alert exists
    const existingAlert = await db.select()
      .from(alerts)
      .where(eq(alerts.id, parseInt(id)))
      .limit(1);

    if (existingAlert.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    const deactivatedAlert = await db.update(alerts)
      .set({ isActive: false })
      .where(eq(alerts.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Alert deactivated successfully',
      data: deactivatedAlert[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}