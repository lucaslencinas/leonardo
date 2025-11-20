import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Migration mapping: old eye color values → new consolidated values
const EYE_COLOR_MIGRATION_MAP: Record<string, string> = {
  'black': 'dark-brown',           // Black → Dark Brown / Black
  'dark-brown': 'dark-brown',      // Dark Brown → Dark Brown / Black (no change)
  'brown': 'brown',                // Brown → Brown (no change)
  'light-brown': 'brown',          // Light Brown → Brown
  'hazel': 'hazel',                // Hazel → Hazel (no change)
  'amber': 'amber',                // Amber → Amber (no change)
  'green': 'green',                // Green → Green (no change)
  'blue-grey': 'blue',             // Blue-Grey → Blue
  'blue': 'blue',                  // Blue → Blue (no change)
  'light-blue': 'light-blue',      // Light Blue → Light Blue (no change)
};

async function migrateEyeColors() {
  console.log('Starting eye color migration...\n');

  try {
    // Get all predictions with their current eye colors
    const predictions = await prisma.prediction.findMany({
      select: {
        id: true,
        eyeColor: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Found ${predictions.length} predictions to check\n`);

    // Track statistics
    const stats = {
      total: predictions.length,
      needsUpdate: 0,
      alreadyCorrect: 0,
      unknownColor: 0,
      updates: {} as Record<string, number>,
    };

    // Find predictions that need updating
    const predictionsToUpdate = predictions.filter((prediction) => {
      const currentColor = prediction.eyeColor;
      const newColor = EYE_COLOR_MIGRATION_MAP[currentColor];

      if (!newColor) {
        console.log(`⚠️  Unknown eye color: "${currentColor}" for user ${prediction.user.name || prediction.user.email}`);
        stats.unknownColor++;
        return false;
      }

      if (currentColor !== newColor) {
        stats.needsUpdate++;
        stats.updates[`${currentColor} → ${newColor}`] = (stats.updates[`${currentColor} → ${newColor}`] || 0) + 1;
        return true;
      } else {
        stats.alreadyCorrect++;
        return false;
      }
    });

    // Show what will be updated
    if (predictionsToUpdate.length > 0) {
      console.log('Predictions that will be updated:');
      predictionsToUpdate.forEach((prediction) => {
        const oldColor = prediction.eyeColor;
        const newColor = EYE_COLOR_MIGRATION_MAP[oldColor];
        console.log(`  - ${prediction.user.name || prediction.user.email}: ${oldColor} → ${newColor}`);
      });
      console.log('');
    }

    // Show statistics
    console.log('Migration Statistics:');
    console.log(`  Total predictions: ${stats.total}`);
    console.log(`  Need updating: ${stats.needsUpdate}`);
    console.log(`  Already correct: ${stats.alreadyCorrect}`);
    console.log(`  Unknown colors: ${stats.unknownColor}`);
    console.log('');

    if (stats.needsUpdate > 0) {
      console.log('Update breakdown:');
      Object.entries(stats.updates).forEach(([mapping, count]) => {
        console.log(`  ${mapping}: ${count} prediction(s)`);
      });
      console.log('');
    }

    // Perform the updates
    if (predictionsToUpdate.length > 0) {
      console.log('Updating predictions...\n');

      for (const prediction of predictionsToUpdate) {
        const oldColor = prediction.eyeColor;
        const newColor = EYE_COLOR_MIGRATION_MAP[oldColor];

        await prisma.prediction.update({
          where: { id: prediction.id },
          data: { eyeColor: newColor },
        });

        console.log(`✓ Updated prediction ${prediction.id}: ${oldColor} → ${newColor}`);
      }

      console.log(`\n✅ Successfully updated ${predictionsToUpdate.length} prediction(s)!`);
    } else {
      console.log('✅ No predictions need updating. All eye colors are already using the new consolidated values.');
    }

    // Also migrate ActualResults if they exist
    const actualResults = await prisma.actualResults.findMany({
      select: {
        id: true,
        eyeColor: true,
      },
    });

    if (actualResults.length > 0) {
      console.log(`\nChecking ${actualResults.length} actual result(s)...`);

      for (const result of actualResults) {
        const currentColor = result.eyeColor;
        const newColor = EYE_COLOR_MIGRATION_MAP[currentColor];

        if (newColor && currentColor !== newColor) {
          await prisma.actualResults.update({
            where: { id: result.id },
            data: { eyeColor: newColor },
          });
          console.log(`✓ Updated actual result: ${currentColor} → ${newColor}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateEyeColors()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
