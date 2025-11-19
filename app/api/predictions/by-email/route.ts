import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find prediction by user email
    const prediction = await prisma.prediction.findFirst({
      where: {
        user: {
          email: {
            equals: email,
            mode: 'insensitive', // Case-insensitive search
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!prediction) {
      return NextResponse.json(
        { prediction: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      prediction: {
        id: prediction.id,
        userName: prediction.user.name,
        userEmail: prediction.user.email,
        birthDate: prediction.birthDate,
        birthTime: prediction.birthTime,
        weight: prediction.weight,
        height: prediction.height,
        eyeColor: prediction.eyeColor,
        hairColor: prediction.hairColor,
        connectionTypes: prediction.connectionTypes,
      },
    });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prediction' },
      { status: 500 }
    );
  }
}
