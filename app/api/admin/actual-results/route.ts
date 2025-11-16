import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

/**
 * GET /api/admin/actual-results
 * Fetch the actual birth results (if entered)
 */
export async function GET(request: NextRequest) {
  try {
    const results = await prisma.actualResults.findFirst({
      orderBy: { enteredAt: 'desc' },
    });

    if (!results) {
      return NextResponse.json({ results: null });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Fetch actual results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/actual-results
 * Save or update the actual birth results (admin only)
 * Body: { birthDate, birthTime, weight, height, eyeColor, hairColor, enteredBy }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, weight, height, eyeColor, hairColor, enteredBy } = body;

    // Validate admin access
    if (!enteredBy || !isAdmin(enteredBy)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!birthDate || !birthTime || !weight || !height || !eyeColor || !hairColor) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: enteredBy },
      select: { id: true },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Format birthTime
    const formattedBirthTime = `${String(birthTime.hours).padStart(2, '0')}:${String(birthTime.minutes).padStart(2, '0')}`;

    // Check if results already exist
    const existingResults = await prisma.actualResults.findFirst();

    let results;

    if (existingResults) {
      // Update existing results
      results = await prisma.actualResults.update({
        where: { id: existingResults.id },
        data: {
          birthDate: new Date(birthDate),
          birthTime: formattedBirthTime,
          weight,
          height,
          eyeColor,
          hairColor,
          enteredBy: adminUser.id,
        },
      });
    } else {
      // Create new results
      results = await prisma.actualResults.create({
        data: {
          birthDate: new Date(birthDate),
          birthTime: formattedBirthTime,
          weight,
          height,
          eyeColor,
          hairColor,
          enteredBy: adminUser.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: existingResults ? 'Results updated successfully' : 'Results saved successfully',
      results,
    });
  } catch (error) {
    console.error('Save actual results error:', error);
    return NextResponse.json(
      { error: 'Failed to save results' },
      { status: 500 }
    );
  }
}
