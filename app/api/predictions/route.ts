import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { predictionSchema } from '@/lib/validations/prediction';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = predictionSchema.parse(body);

    // Check if user already submitted a prediction (by email)
    const existingPrediction = await prisma.prediction.findFirst({
      where: {
        user: {
          email: validatedData.userEmail,
        },
      },
    });

    if (existingPrediction) {
      return NextResponse.json(
        { error: 'You have already submitted a prediction. Only one prediction per person is allowed.' },
        { status: 400 }
      );
    }

    // Format birth time as "HH:MM"
    const birthTime = `${validatedData.birthTime.hours.toString().padStart(2, '0')}:${validatedData.birthTime.minutes.toString().padStart(2, '0')}`;

    // Create user and prediction in a transaction
    const prediction = await prisma.$transaction(async (tx) => {
      // First, check if user exists by email
      let user = await tx.user.findUnique({
        where: { email: validatedData.userEmail },
      });

      // If user doesn't exist, create them
      if (!user) {
        user = await tx.user.create({
          data: {
            email: validatedData.userEmail,
            name: validatedData.userName,
            role: 'USER',
          },
        });
      }

      // Create the prediction
      const newPrediction = await tx.prediction.create({
        data: {
          userId: user.id,
          birthDate: validatedData.birthDate,
          birthTime,
          weight: validatedData.weight,
          height: validatedData.height,
          eyeColor: validatedData.eyeColor,
          hairColor: validatedData.hairColor,
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

      return newPrediction;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Prediction submitted successfully!',
        prediction: {
          id: prediction.id,
          userName: prediction.user.name,
          submittedAt: prediction.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating prediction:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to submit prediction. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all predictions
export async function GET() {
  try {
    const predictions = await prisma.prediction.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      count: predictions.length,
      predictions: predictions.map((p) => ({
        id: p.id,
        userName: p.user.name,
        birthDate: p.birthDate,
        birthTime: p.birthTime,
        weight: p.weight,
        height: p.height,
        eyeColor: p.eyeColor,
        hairColor: p.hairColor,
        submittedAt: p.submittedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
