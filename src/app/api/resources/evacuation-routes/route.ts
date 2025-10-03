import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { evacuationRoutes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      const route = await db.select()
        .from(evacuationRoutes)
        .where(eq(evacuationRoutes.id, parseInt(id)))
        .limit(1);

      if (route.length === 0) {
        return NextResponse.json({ error: 'Evacuation route not found' }, { status: 404 });
      }
      return NextResponse.json(route[0]);
    }

    let query = db.select().from(evacuationRoutes);

    // Filter by status if provided
    if (status) {
      query = query.where(eq(evacuationRoutes.status, status));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json({
      success: true,
      data: {
        routes: results,
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
    const { name, routeFrom, routeTo, status, traffic, distance, description } = body;

    // Validate required fields
    if (!name || !routeFrom || !routeTo || !status || !traffic || !distance) {
      return NextResponse.json({
        error: 'Name, routeFrom, routeTo, status, traffic, and distance are required',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['open', 'congested', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        error: 'Status must be one of: open, congested, closed',
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    // Validate traffic
    const validTraffic = ['light', 'moderate', 'heavy'];
    if (!validTraffic.includes(traffic)) {
      return NextResponse.json({
        error: 'Traffic must be one of: light, moderate, heavy',
        code: 'INVALID_TRAFFIC'
      }, { status: 400 });
    }

    const newRoute = await db.insert(evacuationRoutes).values({
      name: name.trim(),
      routeFrom: routeFrom.trim(),
      routeTo: routeTo.trim(),
      status,
      traffic,
      distance: distance.trim(),
      description: description ? description.trim() : null,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Evacuation route created successfully',
      data: newRoute[0],
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
    const { name, routeFrom, routeTo, status, traffic, distance, description } = body;

    // Check if route exists
    const existingRoute = await db.select()
      .from(evacuationRoutes)
      .where(eq(evacuationRoutes.id, parseInt(id)))
      .limit(1);

    if (existingRoute.length === 0) {
      return NextResponse.json({ error: 'Evacuation route not found' }, { status: 404 });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['open', 'congested', 'closed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({
          error: 'Status must be one of: open, congested, closed',
          code: 'INVALID_STATUS'
        }, { status: 400 });
      }
    }

    // Validate traffic if provided
    if (traffic) {
      const validTraffic = ['light', 'moderate', 'heavy'];
      if (!validTraffic.includes(traffic)) {
        return NextResponse.json({
          error: 'Traffic must be one of: light, moderate, heavy',
          code: 'INVALID_TRAFFIC'
        }, { status: 400 });
      }
    }

    // Build update object
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (routeFrom !== undefined) updates.routeFrom = routeFrom.trim();
    if (routeTo !== undefined) updates.routeTo = routeTo.trim();
    if (status !== undefined) updates.status = status;
    if (traffic !== undefined) updates.traffic = traffic;
    if (distance !== undefined) updates.distance = distance.trim();
    if (description !== undefined) updates.description = description ? description.trim() : null;

    const updatedRoute = await db.update(evacuationRoutes)
      .set(updates)
      .where(eq(evacuationRoutes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedRoute[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}