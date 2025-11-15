# Deployment Guide - Baby Leo Prediction App

This guide will walk you through deploying the Baby Leo prediction webapp to Vercel with Postgres database.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- This repository pushed to GitHub

---

## Step 1: Push Code to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit: Baby Leo prediction app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended for first time)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New..."** → **"Project"**
3. **Import your GitHub repository**:
   - Select your GitHub account
   - Find `leonardo` repository
   - Click **"Import"**

4. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. Click **"Deploy"** (without adding environment variables yet)
   - First deployment will succeed but app won't work without database

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? leonardo (or your preferred name)
# - In which directory is your code located? ./
# - Want to override the settings? N

# Deploy to production
vercel --prod
```

---

## Step 3: Set Up Vercel Postgres Database

1. **Go to your project dashboard** on Vercel
2. Click on the **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"** (powered by Neon)
5. Choose a region close to your users (e.g., US East if most users are in Americas)
6. Click **"Create"**

Vercel will automatically:
- Create the Postgres database
- Add environment variables to your project:
  - `POSTGRES_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_USER`
  - `POSTGRES_HOST`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DATABASE`

---

## Step 4: Add Additional Environment Variables

You need to add environment variables for NextAuth.js:

1. **Go to Project Settings** → **Environment Variables**

2. **Add these variables**:

   **NEXTAUTH_SECRET** (required for production)
   ```bash
   # Generate a secret key:
   openssl rand -base64 32

   # Or use this command:
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   - Copy the output and add as `NEXTAUTH_SECRET`

   **NEXTAUTH_URL** (your production URL)
   ```
   https://your-app-name.vercel.app
   ```
   (Replace with your actual Vercel URL after first deployment)

   **ADMIN_EMAIL** (for admin access)
   ```
   lllencinas@gmail.com
   ```

3. **For Google OAuth** (optional, add later if needed):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

   Get these from [Google Cloud Console](https://console.cloud.google.com/)

---

## Step 5: Push Database Schema

After environment variables are set:

### Option A: Using Vercel CLI

```bash
# Pull environment variables locally
vercel env pull .env.local

# Push Prisma schema to database
npx prisma db push

# Optional: Open Prisma Studio to verify
npx prisma studio
```

### Option B: Using Vercel Project Settings

1. Go to **Project Settings** → **Environment Variables**
2. Copy the `POSTGRES_PRISMA_URL` value
3. Add to your local `.env.local` file:
   ```
   DATABASE_URL="your-postgres-prisma-url"
   ```
4. Run locally:
   ```bash
   npx prisma db push
   ```

---

## Step 6: Redeploy

After setting up environment variables and database:

### Using Vercel Dashboard:
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment
- Check **"Use existing Build Cache"** (optional)
- Click **"Redeploy"**

### Using Vercel CLI:
```bash
vercel --prod
```

---

## Step 7: Verify Deployment

1. **Visit your production URL**: `https://your-app-name.vercel.app`
2. **Test the pages**:
   - Homepage with countdown: `/`
   - Prediction form: `/predict`
   - Results page: `/fake-end-results`

3. **Check environment variables are working**:
   - No database connection errors
   - NextAuth is configured (needed for later auth features)

---

## Project Structure for Vercel

```
leonardo/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utilities and constants
├── prisma/                 # Database schema
│   └── schema.prisma
├── public/                 # Static assets
├── messages/               # i18n translations
├── .env.local             # Local environment variables (gitignored)
├── .env.example           # Example env vars (optional)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── vercel.json            # Vercel configuration (optional)
```

---

## Environment Variables Reference

Create a `.env.example` file for reference:

```env
# Database (provided by Vercel Postgres)
DATABASE_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-generated-secret"

# Admin
ADMIN_EMAIL="lllencinas@gmail.com"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard:
- Go to **Deployments** → Click on failed deployment → **View Build Logs**

Common issues:
- TypeScript errors: Fix type issues locally first
- Missing dependencies: Ensure all packages are in `package.json`
- Environment variables: Check they're set correctly

### Database Connection Issues

1. Verify environment variables are set in Vercel
2. Check Prisma schema is pushed: `npx prisma db push`
3. Verify `DATABASE_URL` or `POSTGRES_PRISMA_URL` is correct

### NextAuth Errors

1. Ensure `NEXTAUTH_SECRET` is set
2. Ensure `NEXTAUTH_URL` matches your production URL
3. Check that Prisma schema includes NextAuth models (User, Session, Account)

---

## Next Steps After Deployment

1. **Set up authentication** (NextAuth.js configuration)
2. **Connect prediction form** to database
3. **Build admin panel** for entering results
4. **Configure custom domain** (optional)
5. **Set up monitoring** (Vercel Analytics)

---

## Useful Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.local

# Open Prisma Studio (connected to production DB)
npx prisma studio

# Check database migrations
npx prisma migrate status

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

---

## Cost Estimate (Free Tier)

- **Vercel Hosting**: Free (Hobby plan)
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS

- **Vercel Postgres**: Free tier includes:
  - 256 MB storage
  - 60 hours compute/month
  - Good for hobby projects and MVPs

**Total monthly cost**: $0 🎉

---

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
