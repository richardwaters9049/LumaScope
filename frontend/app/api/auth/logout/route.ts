import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a real app, you might want to invalidate the token on the server side
    // For now, we'll just return success and let the client handle token removal
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
