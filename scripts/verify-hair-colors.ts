import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyHairColors() {
  console.log('Verifying hair color migration...\n');

  try {
    // Get all predictions with their current hair colors
    const predictions = await prisma.prediction.findMany({
      select: {
        id: true,
        hairColor: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Found ${predictions.length} predictions\n`);

    // Group by hair color
    const colorCounts: Record<string, number> = {};
    predictions.forEach((prediction) => {
      colorCounts[prediction.hairColor] = (colorCounts[prediction.hairColor] || 0) + 1;
    });

    console.log('Hair color distribution:');
    Object.entries(colorCounts).forEach(([color, count]) => {
      console.log(`  ${color}: ${count} prediction(s)`);
    });

    console.log('\nDetailed predictions:');
    predictions.forEach((prediction) => {
      console.log(`  - ${prediction.user.name || prediction.user.email}: ${prediction.hairColor}`);
    });

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyHairColors()
  .then(() => {
    console.log('\n✅ Verification completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
