import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('[API] /api/auth/validate-code called');

  try {
    const { code } = await request.json();
    console.log('[API] Validating code:', code);

    if (!code || typeof code !== 'string') {
      console.log('[API] Invalid code format');
      return NextResponse.json(
        { valid: false, error: 'Valid code is required' },
        { status: 400 }
      );
    }

    // Normalize code to uppercase
    const normalizedCode = code.trim().toUpperCase();
    console.log('[API] Normalized code:', normalizedCode);

    // Find the access code in the database
    const accessCode = await prisma.accessCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!accessCode) {
      console.log('[API] Code not found in database');
      return NextResponse.json(
        { valid: false, error: 'Invalid access code' },
        { status: 404 }
      );
    }

    console.log('[API] Code found:', accessCode.code, 'Type:', accessCode.type);

    // Check if code is active
    if (!accessCode.isActive) {
      console.log('[API] Code is not active');
      return NextResponse.json(
        { valid: false, error: 'This access code is no longer active' },
        { status: 403 }
      );
    }

    // Check if code has expired
    if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
      console.log('[API] Code has expired');
      return NextResponse.json(
        { valid: false, error: 'This access code has expired' },
        { status: 403 }
      );
    }

    // Check if code has reached max uses
    if (accessCode.maxUses !== null && accessCode.usedCount >= accessCode.maxUses) {
      console.log('[API] Code has reached maximum uses');
      return NextResponse.json(
        { valid: false, error: 'This access code has reached its maximum uses' },
        { status: 403 }
      );
    }

    // Increment usage count
    console.log('[API] Incrementing usage count...');
    await prisma.accessCode.update({
      where: { id: accessCode.id },
      data: { usedCount: { increment: 1 } },
    });

    console.log('[API] Code validated successfully');
    return NextResponse.json(
      {
        valid: true,
        codeType: accessCode.type,
        message: 'Access granted',
        description: accessCode.description,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Exception in validate-code:', error);
    console.error('[API] Exception details:', error instanceof Error ? error.message : JSON.stringify(error));
    return NextResponse.json(
      { valid: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
