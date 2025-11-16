import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

/**
 * Check if user has admin access
 * POST /api/admin/check
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if this email is the admin email
    if (!isAdmin(email)) {
      return NextResponse.json(
        { isAdmin: false, message: 'You do not have admin access.' },
        { status: 403 }
      );
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { isAdmin: false, message: 'User not found. Please make a prediction first.' },
        { status: 404 }
      );
    }

    // Update user role to ADMIN if not already
    if (user.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
