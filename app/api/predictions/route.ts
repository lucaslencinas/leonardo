import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { predictionSchema } from '@/lib/validations/prediction';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if submissions are locked
    const settings = await prisma.settings.findFirst();
    if (settings?.submissionsLocked) {
      return NextResponse.json(
        { error: 'Submissions are currently closed. Please contact the administrator.' },
        { status: 403 }
      );
    }

    // Validate the request body
    const validatedData = predictionSchema.parse(body);

    // Normalize email to lowercase
    const normalizedEmail = validatedData.userEmail.toLowerCase().trim();

    // Check if user already submitted a prediction (by email)
    const existingPrediction = await prisma.prediction.findFirst({
      where: {
        user: {
          email: {
            equals: normalizedEmail,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: true,
      },
    });

    // Format birth time as "HH:MM"
    const birthTime = `${validatedData.birthTime.hours.toString().padStart(2, '0')}:${validatedData.birthTime.minutes.toString().padStart(2, '0')}`;

    // If prediction exists, UPDATE it instead of creating a new one
    if (existingPrediction) {
      const updatedPrediction = await prisma.$transaction(async (tx) => {
        // Update user name if it changed
        const user = await tx.user.update({
          where: { id: existingPrediction.userId },
          data: {
            name: validatedData.userName,
          },
        });

        // Update the prediction
        const updated = await tx.prediction.update({
          where: { id: existingPrediction.id },
          data: {
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
                emailVerified: true,
              },
            },
          },
        });

        return updated;
      });

      // If user's email is not verified, send verification email
      if (!updatedPrediction.user.emailVerified) {
        // Generate verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Delete any existing tokens for this email
        await prisma.verificationToken.deleteMany({
          where: { identifier: normalizedEmail },
        });

        // Create new verification token
        await prisma.verificationToken.create({
          data: {
            identifier: normalizedEmail,
            token,
            expires,
          },
        });

        // Get locale from request body
        const locale = body.locale || 'en';

        // Send verification email (don't await to avoid blocking the response)
        sendVerificationEmail(normalizedEmail, token, locale).catch(err =>
          console.error('Failed to send verification email:', err)
        );
      }

      return NextResponse.json(
        {
          success: true,
          updated: true,
          message: 'Prediction updated successfully!',
          emailVerified: !!updatedPrediction.user.emailVerified,
          verificationEmailSent: !updatedPrediction.user.emailVerified,
          prediction: {
            id: updatedPrediction.id,
            userName: updatedPrediction.user.name,
            submittedAt: updatedPrediction.submittedAt,
          },
        },
        { status: 200 }
      );
    }

    // Create user and prediction in a transaction
    const prediction = await prisma.$transaction(async (tx) => {
      // First, check if user exists by email
      let user = await tx.user.findUnique({
        where: { email: normalizedEmail },
      });

      // If user doesn't exist, create them
      if (!user) {
        user = await tx.user.create({
          data: {
            email: normalizedEmail,
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
              emailVerified: true,
            },
          },
        },
      });

      return newPrediction;
    });

    // If user's email is not verified, send verification email
    if (!prediction.user.emailVerified) {
      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Delete any existing tokens for this email
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      // Create new verification token
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });

      // Get locale from request body
      const locale = body.locale || 'en';

      // Send verification email (don't await to avoid blocking the response)
      sendVerificationEmail(normalizedEmail, token, locale).catch(err =>
        console.error('Failed to send verification email:', err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Prediction submitted successfully!',
        emailVerified: !!prediction.user.emailVerified,
        verificationEmailSent: !prediction.user.emailVerified,
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
        user: {
          name: p.user.name,
          email: p.user.email,
        },
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
