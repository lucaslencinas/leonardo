const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG favicon with high contrast "L" letter
const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#B8E0F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B8F6E0;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="90" fill="url(#grad)"/>

  <!-- White circle background for the letter -->
  <circle cx="256" cy="256" r="200" fill="white"/>

  <!-- Dark "L" letter for Leo with high contrast -->
  <text x="256" y="380" font-size="360" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif" fill="#2D3748">L</text>
</svg>
`;

const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../app');

// Ensure directories exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateFavicons() {
  console.log('🎨 Generating favicons...');

  const buffer = Buffer.from(svg);

  try {
    // Generate favicon.ico (32x32)
    await sharp(buffer)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✅ Generated favicon.ico (32x32)');

    // Generate icon.png for Next.js (512x512)
    await sharp(buffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(appDir, 'icon.png'));
    console.log('✅ Generated app/icon.png (512x512)');

    // Generate apple-icon.png (180x180)
    await sharp(buffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(appDir, 'apple-icon.png'));
    console.log('✅ Generated app/apple-icon.png (180x180)');

    // Generate additional sizes for public folder
    const sizes = [16, 32, 192, 512];
    for (const size of sizes) {
      await sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
      console.log(`✅ Generated public/favicon-${size}x${size}.png`);
    }

    console.log('\n🎉 All favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
