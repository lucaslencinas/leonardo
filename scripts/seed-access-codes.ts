import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding access codes...');

  const codes = [
    {
      code: 'FAMILY2025',
      description: 'Access code for family members',
      type: 'FAMILY',
      isActive: true,
      maxUses: null, // Unlimited
    },
    {
      code: 'FRIENDS2025',
      description: 'Access code for friends',
      type: 'FRIENDS',
      isActive: true,
      maxUses: null, // Unlimited
    },
    {
      code: 'VIP2025',
      description: 'Access code for VIP guests',
      type: 'VIP',
      isActive: true,
      maxUses: 50,
    },
  ];

  for (const codeData of codes) {
    const existing = await prisma.accessCode.findUnique({
      where: { code: codeData.code },
    });

    if (existing) {
      console.log(`⏭️  Code "${codeData.code}" already exists, skipping...`);
    } else {
      await prisma.accessCode.create({
        data: codeData,
      });
      console.log(`✅ Created access code: ${codeData.code} (${codeData.type})`);
    }
  }

  console.log('🎉 Seeding completed!');

  // Display all active codes
  const allCodes = await prisma.accessCode.findMany({
    where: { isActive: true },
    select: { code: true, type: true, description: true, maxUses: true, usedCount: true },
  });

  console.log('\n📋 Active Access Codes:');
  allCodes.forEach(code => {
    const usage = code.maxUses ? `${code.usedCount}/${code.maxUses}` : 'Unlimited';
    console.log(`   ${code.code} (${code.type}) - ${usage} uses`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding access codes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
