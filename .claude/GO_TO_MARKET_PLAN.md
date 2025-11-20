# Leonardo - Product MVP & Go-to-Market Plan

**Created:** November 19, 2025
**Purpose:** Evaluate turning the personal baby prediction game into a product that other expecting parents might want to use

---

## Current State Assessment

You have a solid foundation:
- Working multi-step prediction form
- Admin panel with winner calculation
- Multi-language support (EN, ES, SV)
- Mobile-responsive design
- Clean tech stack (Next.js, Prisma, PostgreSQL)

## MVP Requirements to Make This a Product

### 1. Core Product Changes (Must-have)

#### Multi-tenancy Architecture
- Each expecting parent gets their own "game instance"
- Separate data/predictions per family
- Unique URLs per game (e.g., `babyguess.app/smith-family`)

#### Authentication & Authorization
- Simple email-based auth for game creators
- Magic link login (no passwords needed)
- Ability to manage your own game(s)

#### Game Creation Flow
- Self-service onboarding: "Create your baby prediction game in 2 minutes"
- Setup form: baby's name, due date, parents' names
- Choose what to predict (make fields optional)
- Customize deadline for submissions

#### Simplified Tech
- Remove hard-coded values (due date, baby name, admin email)
- Database schema updates for multi-tenancy
- Shared link for participants (no login required to predict)

### 2. Nice-to-Have for MVP

- Basic customization: Choose theme colors, add photo
- Email notifications: Remind creator to enter results after due date
- Shareable QR code for the game URL
- Export predictions as PDF

### 3. Monetization Strategy (Choose One)

#### Option A: Freemium
- Free: Basic game, up to 25 predictions
- $9.99: Unlimited predictions + customization + PDF export + remove branding

#### Option B: One-time Payment
- $14.99 per game (most people only have 1-2 babies)
- All features included

#### Option C: Free Forever
- Monetize through ads or sponsorships from baby brands
- Build audience first

**Recommendation:** Start with **Option B** (one-time $14.99) - simpler to build, clear value proposition, matches the one-time nature of the event.

---

## Realistic Go-to-Market Plan

### Phase 1: Validation (Weeks 1-4)

**Goal:** Confirm people want this before building multi-tenancy

#### 1. Create Landing Page
- Headline: "Turn Your Baby Arrival Into a Fun Guessing Game for Family & Friends"
- Show screenshots of your current version
- Explain how it works
- CTA: "Join Waitlist" or "Get Early Access"
- Tool: Carrd.co, Framer, or add to your existing domain

#### 2. Manual Beta Testing
- Reach out to 5-10 pregnant friends/family
- Manually set up separate game instances for them (even if you have to do it manually)
- Charge $0 but ask for detailed feedback
- Success metric: 3+ people actually use it and get engagement

#### 3. Test Marketing Channels (Spend $0-100)
- Reddit: r/BabyBumps, r/predaddit (share your story, don't spam)
- Facebook groups: Pregnancy/parenting groups in your local area
- Instagram: Create account, post about your experience, use hashtags (#babyshower #pregnancyannouncement)
- Success metric: 20+ waitlist signups from strangers

### Phase 2: MVP Build (Weeks 5-10)

If validation looks good:
- Build multi-tenancy features
- Add Stripe for payments (start with one-time purchase)
- Create simple creator dashboard
- Email functionality (confirmations, reminders)

### Phase 3: Soft Launch (Weeks 11-16)

**Target:** 20 paying customers

#### 1. Outreach to Warm Audience
- Convert waitlist to customers
- Ask for testimonials and screenshots
- Encourage sharing on social media

#### 2. Content Marketing
- Blog posts: "10 Creative Baby Shower Ideas" (include your tool)
- Pinterest pins: Baby shower games (huge audience here)
- TikTok/Instagram Reels: Show how it works

#### 3. Partnerships
- Baby shower planners
- Pregnancy influencers (micro-influencers, 5-50k followers)
- Doulas, midwives (they know lots of expecting parents)

#### 4. Pricing Test
- Try $9.99, $14.99, $19.99 to see what converts best

### Phase 4: Scale or Stop (Month 5+)

**Decision Point:** If you get 20+ paying customers and decent feedback, consider:
- Building additional features (photo sharing, more game types)
- Expanding marketing
- Adding subscriptions for baby shower planners (unlimited games)

**If < 10 customers:** Keep it as a free tool you can talk about in interviews, but don't invest more time.

---

## Competition Research Needed

Before building, check:
1. Google: "baby prediction game," "baby pool," "baby betting"
2. Product Hunt: Search for baby shower tools
3. App stores: Baby prediction apps

### Differentiation Opportunities
- Most are just spreadsheets or basic forms
- Yours has beautiful UI, scoring algorithm, multi-language
- Could focus on international/multi-cultural families

---

## Success Metrics

### Validation Success
- 50+ waitlist signups
- 5+ beta testers actually use it
- 70%+ would pay $10-15

### MVP Success (6 months)
- 50 paying customers = $750 revenue
- 60%+ complete the game (not just create and abandon)
- 4+ star average rating/feedback

---

## Effort Estimate

- **Validation:** 20-30 hours
- **MVP build:** 60-80 hours (multi-tenancy is the hard part)
- **Marketing (ongoing):** 5-10 hours/week

---

## Honest Assessment

### Pros
- Niche but clear target market
- Low competition in well-designed solutions
- Emotionally engaging product
- You already have working code

### Cons
- Small market (only pregnant people, only once or twice per person)
- Seasonal spikes (spring births from summer conceptions)
- Hard to find customers (not actively searching for this)
- Could be replicated easily

### Realistic Outcome
This could be a nice **side project** that makes $2-5k/year with minimal maintenance. Unlikely to be a full business, but could be a great portfolio piece and learning experience.

---

## Recommended Next Steps

1. **Spend 1 week on validation** - Create landing page, post in 5 communities, see if anyone cares
2. **If you get 30+ interested people** - Build the multi-tenancy MVP
3. **Launch at $14.99** - Simpler than subscriptions
4. **Give yourself a deadline** - "If I don't have 20 paying customers in 3 months, I'll open-source it and move on"

---

## Potential Tasks to Explore

- [ ] Create landing page for validation
- [ ] Build multi-tenancy architecture
- [ ] Set up Stripe integration
- [ ] Create marketing plan with specific copy
- [ ] Research competition in detail
- [ ] Design creator onboarding flow
- [ ] Plan database schema changes for multi-tenancy
