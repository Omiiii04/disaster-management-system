import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emergencyContacts } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const contact = await db.select()
        .from(emergencyContacts)
        .where(eq(emergencyContacts.id, parseInt(id)))
        .limit(1);

      if (contact.length === 0) {
        return NextResponse.json({ error: 'Emergency contact not found' }, { status: 404 });
      }

      return NextResponse.json(contact[0]);
    }

    // Build query with filters
    let query = db.select().from(emergencyContacts);
    const conditions = [];

    // Category filter
    if (category) {
      conditions.push(eq(emergencyContacts.category, category));
    }

    // Search functionality
    if (search) {
      conditions.push(or(
        like(emergencyContacts.name, `%${search}%`),
        like(emergencyContacts.category, `%${search}%`),
        like(emergencyContacts.number, `%${search}%`)
      ));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderDirection = order === 'desc' ? desc : asc;
    if (sort === 'category') {
      query = query.orderBy(orderDirection(emergencyContacts.category));
    } else if (sort === 'number') {
      query = query.orderBy(orderDirection(emergencyContacts.number));
    } else {
      query = query.orderBy(orderDirection(emergencyContacts.name));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { category, name, number, iconName } = requestBody;

    // Validate required fields
    if (!category) {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!number) {
      return NextResponse.json({ 
        error: "Number is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!iconName) {
      return NextResponse.json({ 
        error: "Icon name is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,20}$/;
    if (!phoneRegex.test(number.trim())) {
      return NextResponse.json({ 
        error: "Invalid phone number format",
        code: "INVALID_PHONE_NUMBER" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      category: category.trim(),
      name: name.trim(),
      number: number.trim(),
      iconName: iconName.trim()
    };

    const newContact = await db.insert(emergencyContacts)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newContact[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
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
    const { category, name, number, iconName } = requestBody;

    // Check if record exists
    const existingContact = await db.select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.id, parseInt(id)))
      .limit(1);

    if (existingContact.length === 0) {
      return NextResponse.json({ error: 'Emergency contact not found' }, { status: 404 });
    }

    // Validate phone number format if provided
    if (number && number.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,20}$/;
      if (!phoneRegex.test(number.trim())) {
        return NextResponse.json({ 
          error: "Invalid phone number format",
          code: "INVALID_PHONE_NUMBER" 
        }, { status: 400 });
      }
    }

    // Build update object with only provided fields
    const updates: any = {};
    if (category !== undefined) updates.category = category.trim();
    if (name !== undefined) updates.name = name.trim();
    if (number !== undefined) updates.number = number.trim();
    if (iconName !== undefined) updates.iconName = iconName.trim();

    const updatedContact = await db.update(emergencyContacts)
      .set(updates)
      .where(eq(emergencyContacts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedContact[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingContact = await db.select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.id, parseInt(id)))
      .limit(1);

    if (existingContact.length === 0) {
      return NextResponse.json({ error: 'Emergency contact not found' }, { status: 404 });
    }

    const deleted = await db.delete(emergencyContacts)
      .where(eq(emergencyContacts.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Emergency contact deleted successfully',
      deleted: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}