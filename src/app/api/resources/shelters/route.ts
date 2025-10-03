import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { shelters } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      const shelter = await db.select()
        .from(shelters)
        .where(eq(shelters.id, parseInt(id)))
        .limit(1);

      if (shelter.length === 0) {
        return NextResponse.json({ error: 'Shelter not found' }, { status: 404 });
      }
      return NextResponse.json(shelter[0]);
    }

    let query = db.select().from(shelters);

    // Filter by location if provided
    if (location) {
      query = query.where(
        or(
          like(shelters.name, `%${location}%`),
          like(shelters.address, `%${location}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json({
      success: true,
      data: {
        shelters: results,
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
    const { name, address, latitude, longitude, capacity, available, amenities, contact, status, distance } = body;

    // Validate required fields
    if (!name || !address || latitude === undefined || longitude === undefined || 
        capacity === undefined || available === undefined || !amenities || !contact || !status) {
      return NextResponse.json({
        error: 'Name, address, latitude, longitude, capacity, available, amenities, contact, and status are required',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['open', 'limited', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        error: 'Status must be one of: open, limited, closed',
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    // Validate numeric fields
    if (typeof capacity !== 'number' || capacity < 0) {
      return NextResponse.json({
        error: 'Capacity must be a number >= 0',
        code: 'INVALID_CAPACITY'
      }, { status: 400 });
    }

    if (typeof available !== 'number' || available < 0) {
      return NextResponse.json({
        error: 'Available must be a number >= 0',
        code: 'INVALID_AVAILABLE'
      }, { status: 400 });
    }

    // Validate coordinates
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return NextResponse.json({
        error: 'Latitude must be a number between -90 and 90',
        code: 'INVALID_LATITUDE'
      }, { status: 400 });
    }

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return NextResponse.json({
        error: 'Longitude must be a number between -180 and 180',
        code: 'INVALID_LONGITUDE'
      }, { status: 400 });
    }

    const newShelter = await db.insert(shelters).values({
      name: name.trim(),
      address: address.trim(),
      latitude,
      longitude,
      capacity,
      available,
      amenities: Array.isArray(amenities) ? amenities : [amenities],
      contact: contact.trim(),
      status,
      distance: distance || null,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Shelter created successfully',
      data: newShelter[0],
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
    const { name, address, latitude, longitude, capacity, available, amenities, contact, status, distance } = body;

    // Check if shelter exists
    const existingShelter = await db.select()
      .from(shelters)
      .where(eq(shelters.id, parseInt(id)))
      .limit(1);

    if (existingShelter.length === 0) {
      return NextResponse.json({ error: 'Shelter not found' }, { status: 404 });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['open', 'limited', 'closed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({
          error: 'Status must be one of: open, limited, closed',
          code: 'INVALID_STATUS'
        }, { status: 400 });
      }
    }

    // Validate numeric fields if provided
    if (capacity !== undefined && (typeof capacity !== 'number' || capacity < 0)) {
      return NextResponse.json({
        error: 'Capacity must be a number >= 0',
        code: 'INVALID_CAPACITY'
      }, { status: 400 });
    }

    if (available !== undefined && (typeof available !== 'number' || available < 0)) {
      return NextResponse.json({
        error: 'Available must be a number >= 0',
        code: 'INVALID_AVAILABLE'
      }, { status: 400 });
    }

    // Validate coordinates if provided
    if (latitude !== undefined && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
      return NextResponse.json({
        error: 'Latitude must be a number between -90 and 90',
        code: 'INVALID_LATITUDE'
      }, { status: 400 });
    }

    if (longitude !== undefined && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
      return NextResponse.json({
        error: 'Longitude must be a number between -180 and 180',
        code: 'INVALID_LONGITUDE'
      }, { status: 400 });
    }

    // Build update object
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (address !== undefined) updates.address = address.trim();
    if (latitude !== undefined) updates.latitude = latitude;
    if (longitude !== undefined) updates.longitude = longitude;
    if (capacity !== undefined) updates.capacity = capacity;
    if (available !== undefined) updates.available = available;
    if (amenities !== undefined) updates.amenities = Array.isArray(amenities) ? amenities : [amenities];
    if (contact !== undefined) updates.contact = contact.trim();
    if (status !== undefined) updates.status = status;
    if (distance !== undefined) updates.distance = distance;

    const updatedShelter = await db.update(shelters)
      .set(updates)
      .where(eq(shelters.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedShelter[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}