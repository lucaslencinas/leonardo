import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Admin email - should match your .env.local
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

function isAdmin(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const { adminEmail } = await request.json();

    // Verify admin access
    if (!isAdmin(adminEmail)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Delete all data in order (respecting foreign key constraints)
    await prisma.$transaction([
      // Delete all predictions first
      prisma.prediction.deleteMany({}),

      // Delete actual results
      prisma.actualResults.deleteMany({}),

      // Delete all users except admins
      prisma.user.deleteMany({
        where: {
          email: {
            not: ADMIN_EMAIL,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'All data cleared successfully',
    });
  } catch (error) {
    console.error('Clear all data error:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}
