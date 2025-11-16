import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

/**
 * GET /api/admin/settings
 * Fetch app settings
 */
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          submissionsLocked: false,
          winnerModeActive: false,
          lockDate: new Date('2026-01-05T00:00:00Z'),
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Update app settings (admin only)
 * Body: { submissionsLocked?: boolean, winnerModeActive?: boolean, adminEmail: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionsLocked, winnerModeActive, adminEmail } = body;

    // Verify admin access
    if (!adminEmail || !isAdmin(adminEmail)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get or create settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          submissionsLocked: submissionsLocked ?? false,
          winnerModeActive: winnerModeActive ?? false,
          lockDate: new Date('2026-01-05T00:00:00Z'),
        },
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...(submissionsLocked !== undefined && { submissionsLocked }),
          ...(winnerModeActive !== undefined && { winnerModeActive }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
