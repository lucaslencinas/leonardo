# Leonardo - Baby Prediction Game

A fun, interactive web application where family and friends can predict details about Baby Leo's arrival!

**Due Date:** February 5, 2026 at 12:00 PM

## Overview

Leonardo is a multi-language baby prediction game built with modern web technologies. Users submit predictions about the baby's birth date, time, weight, height, eye color, and hair color. When the baby arrives, the admin enters the actual results and the app calculates winners based on accuracy.

## Features

### For Users
- **Multi-step prediction form** with 8 intuitive steps
- **One prediction per email** with ability to edit before deadline
- **View all predictions** from family and friends
- **Multi-language support** (English, Spanish-AR, Swedish)
- **Mobile-responsive** design with baby-themed aesthetics
- **Live countdown** to the due date

### For Admin
- **Admin dashboard** for managing the game
- **Enter actual birth results** when baby arrives
- **Winner calculation** with automatic scoring algorithm
- **Lock submissions** at a specific deadline
- **View leaderboard** with medals and rankings
- **Clear data** functionality for testing

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Prisma + PostgreSQL (Vercel Postgres in production)
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics & Speed Insights

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Vercel Postgres)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd leonardo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and other settings

# Push database schema
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://..."

# Admin
ADMIN_EMAIL="your-admin-email@example.com"

# Production only
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-generated-secret"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

## Project Structure

```
leonardo/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── (app)/          # Main app pages
│   │   │   ├── predict/    # Prediction form
│   │   │   ├── predictions/# View all predictions
│   │   │   └── admin/      # Admin panel
│   └── api/                # API routes
├── components/              # React components
│   ├── forms/              # Form inputs
│   ├── results/            # Results visualization
│   └── ...
├── lib/                    # Utilities and helpers
│   ├── prisma.ts          # Database client
│   ├── colors.ts          # Color definitions
│   ├── admin.ts           # Admin utilities
│   └── winner-calculation.ts  # Scoring algorithm
├── messages/               # i18n translations
│   ├── en.json
│   ├── es-AR.json
│   └── sv.json
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Key Pages

- `/` - Homepage with countdown timer
- `/[locale]/predict` - Multi-step prediction form
- `/[locale]/predictions` - Gallery of all predictions
- `/[locale]/admin` - Admin dashboard (requires admin email)
- `/[locale]/admin/results` - Enter actual birth results
- `/[locale]/admin/winners` - View leaderboard

## Scoring Algorithm

Winners are determined by the lowest score (closest predictions):

- **Date:** 1 point per day difference
- **Time:** 1 point per 60 minutes difference
- **Weight:** 1 point per 100g difference
- **Height:** 1 point per cm difference
- **Eye Color:** 10 points if wrong, 0 if correct
- **Hair Color:** 10 points if wrong, 0 if correct

Lower score = better prediction!

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy

1. Push code to GitHub
2. Import project in Vercel
3. Add Postgres database in Vercel Storage
4. Set environment variables
5. Push Prisma schema: `npx prisma db push`
6. Deploy!

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npx prisma studio       # Open Prisma Studio
npx prisma db push      # Push schema changes
npx prisma generate     # Generate Prisma Client
```

## Features to Come

See [.claude/FEATURE_PROPOSALS.md](.claude/FEATURE_PROPOSALS.md) for planned features:

- Email verification for cross-device access
- Enhanced edit functionality
- Complete translation coverage
- Photo sharing integration
- Email notifications

## Admin Access

Only the email specified in `ADMIN_EMAIL` environment variable can access the admin panel. No password required - authentication is email-based.

## Contributing

This is a personal family project, but feel free to fork and adapt for your own baby prediction games!

## License

Private project for personal use.

## Credits

Built with love for Baby Leo by Lucas Encinas.
