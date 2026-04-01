// API Route for Logout
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();

    // Call backend logout
    const token = cookieStore.get('access_token')?.value;
    if (token) {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        headers: {
          Cookie: `access_token=${token}`,
        },
      });
    }

    // Clear cookies
    cookieStore.delete('access_token');
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Get the origin from the request
  const origin = request.headers.get('origin') || 'http://localhost:3000';
  return NextResponse.redirect(origin);
}
