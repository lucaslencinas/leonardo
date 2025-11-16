import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateWinners } from '@/lib/winner-calculation';

/**
 * GET /api/admin/winners
 * Calculate and return the leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch actual results
    const actualResults = await prisma.actualResults.findFirst({
      orderBy: { enteredAt: 'desc' },
    });

    if (!actualResults) {
      return NextResponse.json(
        { error: 'Actual results not entered yet' },
        { status: 404 }
      );
    }

    // Fetch all predictions with user info
    const predictions = await prisma.prediction.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (predictions.length === 0) {
      return NextResponse.json({
        winners: [],
        actualResults,
      });
    }

    // Calculate winners
    const winners = calculateWinners(predictions, actualResults);

    return NextResponse.json({
      winners,
      actualResults,
      totalPredictions: predictions.length,
    });
  } catch (error) {
    console.error('Calculate winners error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate winners' },
      { status: 500 }
    );
  }
}
