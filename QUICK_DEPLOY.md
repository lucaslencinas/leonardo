# Quick Deploy to Vercel - Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code is committed to Git
- [ ] GitHub repository is created and code is pushed
- [ ] You have a Vercel account (free is fine)

---

## 🚀 Deployment Steps (15 minutes)

### 1. Push to GitHub (if not done)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Go to: https://vercel.com/new**

1. Import your GitHub repository `leonardo`
2. Click **Deploy** (no configuration needed yet)
3. Wait for first deployment (will succeed but app won't work fully)

### 3. Add Postgres Database

**In your Vercel project dashboard:**

1. Go to **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Choose region (e.g., US East)
5. Click **Create**

✅ Vercel automatically adds these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `DATABASE_URL`
- And others...

### 4. Add Required Environment Variables

**Go to: Settings → Environment Variables**

Add these **3 required variables**:

**1. NEXTAUTH_SECRET**
```bash
# Generate on macOS/Linux:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
- Name: `NEXTAUTH_SECRET`
- Value: (paste the generated secret)
- Environment: Production

**2. NEXTAUTH_URL**
- Name: `NEXTAUTH_URL`
- Value: `https://your-project-name.vercel.app` (your actual Vercel URL)
- Environment: Production

**3. ADMIN_EMAIL**
- Name: `ADMIN_EMAIL`
- Value: `lllencinas@gmail.com`
- Environment: Production (and Preview, Production if you want)

### 5. Push Database Schema

**Option A: From Vercel Dashboard**

1. Go to **Settings** → **Environment Variables**
2. Click **•••** on `POSTGRES_PRISMA_URL` → **Copy**
3. Create local `.env.local`:
   ```bash
   echo 'DATABASE_URL="<paste-the-url-here>"' > .env.local
   ```
4. Push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

**Option B: Install Vercel CLI**

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Push schema
npx prisma generate
npx prisma db push
```

### 6. Redeploy

**Option A: Vercel Dashboard**
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **Redeploy**

**Option B: Vercel CLI**
```bash
vercel --prod
```

### 7. Test Your Site! 🎉

Visit: `https://your-project-name.vercel.app`

Test these pages:
- ✅ Homepage: `/`
- ✅ Predictions: `/predictions`
- ✅ Make Prediction: `/predict`
- ✅ Results (fake): `/fake-end-results`

---

## 🐛 Common Issues

### "Database connection error"
- Check environment variables in Vercel are set
- Verify you ran `npx prisma db push`

### "NEXTAUTH_SECRET is not set"
- Add `NEXTAUTH_SECRET` in Vercel environment variables
- Redeploy

### Build fails
- Check build logs in Vercel dashboard
- Ensure all TypeScript errors are fixed locally first

---

## 📝 What's Configured

✅ **Hosting**: Vercel (free tier)
✅ **Database**: Vercel Postgres (free tier)
✅ **Framework**: Next.js 16
✅ **i18n**: English, Swedish, Spanish (Argentine)
✅ **Styling**: Tailwind CSS
✅ **ORM**: Prisma

---

## 🔜 Next Steps

After successful deployment:

1. **Set up authentication** (NextAuth configuration)
2. **Connect prediction form** to save to database
3. **Build admin panel** to enter actual results
4. **Custom domain** (optional, configure in Vercel)

---

## 💰 Cost

**$0/month** on free tier:
- Vercel Hosting: Free (unlimited deployments)
- Vercel Postgres: Free (256MB, 60hrs compute/month)

Perfect for this baby prediction app! 🍼

---

## 🆘 Need Help?

- Check logs: Vercel Dashboard → Deployments → [Click deployment] → View Function Logs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs/getting-started

---

## ⚡ Super Quick Deploy (30 seconds)

If you just want to deploy NOW:

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repo → Deploy
4. Done! (Add database + env vars later)

The site will work partially - you can add database and environment variables afterward.
