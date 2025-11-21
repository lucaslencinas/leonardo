import { NextResponse } from 'next/server';

export async function POST() {
  console.log('[API] /api/auth/logout called');

  // Logout is handled on the client side by clearing localStorage
  // This endpoint exists for consistency and potential future server-side session handling

  console.log('[API] Logout successful');
  return NextResponse.json(
    {
      success: true,
      message: 'Logged out successfully',
    },
    { status: 200 }
  );
}
