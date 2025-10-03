import { NextRequest, NextResponse } from 'next/server'

// Simulating Django/FastAPI login endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate authentication logic
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock user validation
    if (email === 'admin@dms.gov' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: email,
            name: 'Admin User',
            role: 'admin',
          },
        },
      })
    }

    // Simulate successful login for any other credentials (demo purposes)
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000),
          email: email,
          name: email.split('@')[0],
          role: 'user',
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