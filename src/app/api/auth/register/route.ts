import { NextRequest, NextResponse } from 'next/server'

// Simulating Django/FastAPI registration endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Simulate user registration
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000),
          name: name,
          email: email,
          role: 'user',
          createdAt: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}