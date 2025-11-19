import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single prediction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prediction = await prisma.prediction.findUnique({
      where: { id },
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
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      prediction: {
        id: prediction.id,
        birthDate: prediction.birthDate,
        birthTime: prediction.birthTime,
        weight: prediction.weight,
        height: prediction.height,
        eyeColor: prediction.eyeColor,
        hairColor: prediction.hairColor,
        connectionTypes: prediction.connectionTypes,
        submittedAt: prediction.submittedAt,
        user: prediction.user,
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

// PATCH to update prediction fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { adminEmail, updates } = body;

    // Verify admin access
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Build update data object with only provided fields
    const updateData: any = {};

    if (updates.birthDate !== undefined) {
      updateData.birthDate = new Date(updates.birthDate);
    }
    if (updates.birthTime !== undefined) {
      updateData.birthTime = updates.birthTime;
    }
    if (updates.weight !== undefined) {
      updateData.weight = parseFloat(updates.weight);
    }
    if (updates.height !== undefined) {
      updateData.height = parseFloat(updates.height);
    }
    if (updates.eyeColor !== undefined) {
      updateData.eyeColor = updates.eyeColor;
    }
    if (updates.hairColor !== undefined) {
      updateData.hairColor = updates.hairColor;
    }
    if (updates.connectionTypes !== undefined) {
      updateData.connectionTypes = updates.connectionTypes;
    }

    // Update the prediction
    const updatedPrediction = await prisma.prediction.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Prediction updated successfully',
      prediction: updatedPrediction,
    });
  } catch (error) {
    console.error('Error updating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to update prediction' },
      { status: 500 }
    );
  }
}

// DELETE a prediction and all related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { adminEmail } = body;

    // Verify admin access
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get the prediction to check if it exists
    const prediction = await prisma.prediction.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // Delete prediction in a transaction
    // The user will be preserved but the prediction will be deleted
    // If you want to delete the user as well, you can add that logic here
    await prisma.$transaction(async (tx) => {
      // Delete the prediction (cascade will handle related data)
      await tx.prediction.delete({
        where: { id },
      });

      // Optionally delete verification tokens for this user
      await tx.verificationToken.deleteMany({
        where: { identifier: prediction.user.email },
      });

      // Optionally delete sessions for this user
      await tx.session.deleteMany({
        where: { userId: prediction.user.id },
      });

      // Optionally delete accounts for this user
      await tx.account.deleteMany({
        where: { userId: prediction.user.id },
      });

      // Delete the user if they have no other data
      // (since prediction is one-to-one, deleting prediction means user has no data)
      await tx.user.delete({
        where: { id: prediction.user.id },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Prediction and all related user data deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting prediction:', error);
    return NextResponse.json(
      { error: 'Failed to delete prediction' },
      { status: 500 }
    );
  }
}
