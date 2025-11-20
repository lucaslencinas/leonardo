import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  console.log('[API] /api/auth/send-verification called');

  try {
    const { email, locale = 'en' } = await request.json();
    console.log('[API] Request payload - email:', email, 'locale:', locale);

    if (!email || typeof email !== 'string') {
      console.log('[API] Invalid email provided');
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    console.log('[API] Normalized email:', normalizedEmail);

    // Check if user exists
    console.log('[API] Checking if user exists in database...');
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    console.log('[API] User found:', !!user, 'User ID:', user?.id);

    // If user doesn't exist yet, create them
    if (!user) {
      console.log('[API] Creating new user...');
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          role: 'USER',
        },
      });
      console.log('[API] New user created with ID:', user.id);
    }

    // Check if user is already verified
    if (user.emailVerified) {
      console.log('[API] User is already verified');
      return NextResponse.json(
        {
          success: true,
          alreadyVerified: true,
          message: 'Email is already verified'
        },
        { status: 200 }
      );
    }

    // Generate a unique verification token
    console.log('[API] Generating verification token...');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    console.log('[API] Token generated, expires:', expires.toISOString());

    // Store the verification token in the database
    // First, delete any existing tokens for this email
    console.log('[API] Deleting old verification tokens...');
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    // Create new verification token
    console.log('[API] Creating new verification token...');
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    });
    console.log('[API] Verification token stored in database');

    // Send verification email
    console.log('[API] Calling sendVerificationEmail...');
    const result = await sendVerificationEmail(normalizedEmail, token, locale);
    console.log('[API] sendVerificationEmail result:', JSON.stringify(result));

    if (!result.success) {
      console.error('[API] Failed to send verification email');
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('[API] Verification email sent successfully');
    return NextResponse.json(
      {
        success: true,
        message: 'Verification email sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Exception in send-verification:', error);
    console.error('[API] Exception details:', error instanceof Error ? error.message : JSON.stringify(error));
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
