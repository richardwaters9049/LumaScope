import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Forward the form data to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: username.toString(),
        password: password.toString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Login failed' },
        { status: response.status }
      );
    }

    // Return the tokens to the client
    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
