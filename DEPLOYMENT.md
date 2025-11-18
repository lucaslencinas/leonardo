# Deployment Guide - Leonardo Baby Prediction App

This guide walks you through deploying the Leonardo app to Vercel with a Postgres database.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Repository pushed to GitHub

## Quick Deploy (15 minutes)

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click **Deploy** (initial deployment will succeed but app needs database)

### 3. Add Postgres Database

In your Vercel project dashboard:

1. Go to **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Choose a region close to your users
5. Click **Create**

Vercel automatically adds these environment variables:
- `DATABASE_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- And more...

### 4. Add Required Environment Variables

Go to **Settings** → **Environment Variables** and add:

#### NEXTAUTH_SECRET
Generate a secret:
```bash
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
- Name: `NEXTAUTH_SECRET`
- Value: (paste the generated secret)
- Environment: Production, Preview, Development

#### NEXTAUTH_URL
- Name: `NEXTAUTH_URL`
- Value: `https://your-project-name.vercel.app`
- Environment: Production

#### NEXT_PUBLIC_SITE_URL
- Name: `NEXT_PUBLIC_SITE_URL`
- Value: `https://your-project-name.vercel.app`
- Environment: Production, Preview

#### ADMIN_EMAIL
- Name: `ADMIN_EMAIL`
- Value: `your-admin-email@example.com`
- Environment: Production, Preview, Development

### 5. Push Database Schema

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push
```

**Option B: Manual Setup**

1. Go to **Settings** → **Environment Variables** in Vercel
2. Copy the `POSTGRES_PRISMA_URL` value
3. Create `.env.local` locally:
   ```bash
   DATABASE_URL="<paste-postgres-prisma-url-here>"
   ```
4. Push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 6. Redeploy

**Via Vercel Dashboard:**
- Go to **Deployments** tab
- Click **•••** on latest deployment
- Click **Redeploy**

**Via CLI:**
```bash
vercel --prod
```

### 7. Test Your Deployment

Visit `https://your-project-name.vercel.app` and test:

- ✅ Homepage with countdown
- ✅ Multi-language support (EN, ES-AR, SV)
- ✅ `/predict` - Prediction form
- ✅ `/predictions` - View all predictions
- ✅ `/admin` - Admin dashboard (use your admin email)

## Environment Variables Reference

Complete list of environment variables:

```env
# Database (auto-added by Vercel Postgres)
DATABASE_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Authentication
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-generated-secret-key"

# Public URLs (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_SITE_URL="https://your-app.vercel.app"

# Admin
ADMIN_EMAIL="your-admin-email@example.com"

# Optional: Google OAuth (for future use)
# GOOGLE_CLIENT_ID="..."
# GOOGLE_CLIENT_SECRET="..."
```

## Common Issues

### Build Fails

**Check build logs:**
- Vercel Dashboard → Deployments → [Failed deployment] → View Logs

**Common causes:**
- TypeScript errors (fix locally with `npm run build`)
- Missing dependencies (check `package.json`)
- Environment variables not set

### Database Connection Errors

**Solutions:**
1. Verify database is created in Vercel Storage tab
2. Check environment variables are set correctly
3. Confirm Prisma schema was pushed: `npx prisma db push`
4. Check `DATABASE_URL` format is correct

### "NEXTAUTH_SECRET is not set"

**Solution:**
1. Add `NEXTAUTH_SECRET` in Vercel Settings → Environment Variables
2. Redeploy the app

### Admin Panel Shows "Not Authorized"

**Solution:**
1. Verify `ADMIN_EMAIL` matches the email you're using
2. Check browser console for errors
3. Try clearing localStorage and re-entering email

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push

# Vercel will auto-deploy to production
```

**Preview Deployments:**
- Every push to non-main branches creates a preview deployment
- Preview URL: `https://leonardo-<hash>.vercel.app`

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to use new domain

## Useful Commands

```bash
# Vercel CLI commands
vercel                      # Deploy to preview
vercel --prod              # Deploy to production
vercel env pull            # Download environment variables
vercel env ls              # List environment variables
vercel logs                # View deployment logs
vercel domains             # Manage domains

# Database commands
npx prisma studio          # Open database viewer
npx prisma db push         # Push schema changes
npx prisma generate        # Regenerate Prisma client
npx prisma migrate dev     # Create migration (dev only)
```

## Production Checklist

Before sharing your app:

- [ ] All environment variables are set
- [ ] Database schema is pushed
- [ ] Admin email is configured
- [ ] Test all pages load correctly
- [ ] Test prediction form submission
- [ ] Test admin panel access
- [ ] Verify all 3 languages work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Verify analytics are working (Vercel Analytics tab)

## Monitoring

**Vercel Analytics:**
- Go to **Analytics** tab in dashboard
- View page views, unique visitors, and more

**Vercel Logs:**
- Go to **Deployments** → Click deployment → **Functions**
- View real-time function logs

**Database Usage:**
- Go to **Storage** tab → Click your database
- Monitor storage and compute usage

## Cost

**Free Tier Includes:**
- Vercel Hosting: Unlimited deployments
- Postgres Database: 256MB storage, 60 hours compute/month
- Analytics: Basic metrics
- SSL Certificates: Automatic

**Estimated Cost:** $0/month (free tier is sufficient for this project)

## Backup Strategy

**Database Backups:**

```bash
# Export data via Prisma
npx prisma db pull          # Pull schema
npx prisma db seed          # Run seed file (if configured)

# Or use pg_dump (if you have database credentials)
pg_dump $DATABASE_URL > backup.sql
```

**Vercel Postgres** automatically creates backups, but you can also:
1. Export via Prisma Studio
2. Use Vercel's database snapshots (paid feature)

## Rollback

If deployment fails:

**Via Dashboard:**
1. Go to **Deployments**
2. Find last working deployment
3. Click **•••** → **Promote to Production**

**Via CLI:**
```bash
vercel rollback
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

## Troubleshooting Contact

For issues specific to this project, check:
1. Vercel deployment logs
2. Browser console errors
3. API route responses in Network tab
4. Prisma schema matches database structure

---

**Last Updated:** 2025-01-18
**Current Production URL:** https://your-project.vercel.app
