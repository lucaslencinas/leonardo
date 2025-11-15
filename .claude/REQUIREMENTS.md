# Leonardo - Baby Prediction Webapp
## Complete Requirements Document

---

## 📋 Project Overview

**Project Name:** Leonardo Baby Prediction App
**Purpose:** Family prediction game for baby Leo's arrival in February 2025
**Users:** Family members (siblings, parents, uncles, etc.)
**Goal:** Let family predict baby details (weight, height, eye color, hair color, birth date/time) with a winner announcement after birth

---

## 🎯 Core Concept

Family members submit their predictions about baby Leo before he's born. After Leo arrives and the admin enters the actual birth details, the app calculates a winner based on prediction accuracy. The winner receives a special prize (e.g., "Your photo in Leo's room").

---

## 💻 Technical Stack

### **Frontend Framework**
- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)

### **UI Components**
- **shadcn/ui** (accessible, customizable components)
- Custom baby-themed components
- Responsive, mobile-first design

### **Authentication**
- **NextAuth.js** v5
- **Providers:**
  - Credentials (email/password)
  - Google OAuth

### **Database**
- **Vercel Postgres** (free tier: 256MB, 60 hours/month)
- **Prisma ORM** (type-safe database access)

### **Internationalization**
- **next-intl**
- **Languages:** Spanish (Argentine), English, Swedish
- **Auto-detection:** Browser language + geographic location

### **Hosting & Deployment**
- **Vercel** (free tier)
- **Domain:** `leonardo.vercel.app` (or similar free .vercel.app subdomain)
- **CI/CD:** Automatic deployment on git push

### **Additional Libraries**
- **Zod** (form validation)
- **date-fns** (date manipulation)
- **React Hook Form** (form management)
- **Recharts** or **Chart.js** (data visualization)

---

## 🎨 Design Requirements

### **Design Style**
- **Theme:** Playful, baby-themed (baby boy - Leo)
- **Color Palette:** Modern pastels (soft blues, mints, creams, warm accents)
- **Typography:** Rounded, friendly fonts (e.g., Inter Rounded, DM Sans, Nunito)
- **Mood:** Warm, welcoming, joyful, family-friendly

### **Responsive Design**
- Mobile-first approach
- Works perfectly on phones (primary device for most users)
- Tablet and desktop optimized
- Touch-friendly interactive elements

### **Animations**
- Smooth page transitions
- Micro-interactions on hover/click
- Form field focus animations
- Loading states with cute baby icons
- Celebration animations (confetti for winner)
- Slider movements with visual feedback

### **Accessibility**
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation
- Screen reader friendly
- ARIA labels on interactive elements

---

## 🔐 Authentication & User Management

### **User Registration**
- Email + password registration
- First name + last name required
- Email verification (optional, can skip for simplicity)
- Google OAuth option (faster registration)

### **User Login**
- Email/password login
- Google OAuth login
- "Remember me" option
- Password reset flow (email-based)

### **User Roles**
- **Standard User:** Can submit/edit own prediction, view others after submission
- **Admin:** `lllencinas@gmail.com` has full access to admin panel

### **Session Management**
- Persistent sessions with NextAuth
- Secure cookie-based authentication
- Auto-logout after inactivity (optional)

---

## 🌍 Internationalization (i18n)

### **Languages**
1. **Spanish (Argentine)** (`es-AR`)
   - Use "vos" conjugations (e.g., "vos podés" not "tú puedes")
   - Local vocabulary (e.g., "bebé" not "guagua")
   - Date format: DD/MM/YYYY

2. **English** (`en`)
   - Standard international English
   - Date format: MM/DD/YYYY

3. **Swedish** (`sv`)
   - Standard Swedish
   - Date format: YYYY-MM-DD

### **Locale Detection**
- **Priority order:**
  1. User's saved preference (cookie)
  2. Geographic location (Argentina → Spanish)
  3. Browser language
  4. Default: English

### **Language Switcher**
- Location: Top-right corner
- Design: Flag icons (🇦🇷 🇬🇧 🇸🇪) or flag images
- Persists selection in cookie
- Smooth transition on language change

### **Translation Scope**
- All UI text
- Form labels and placeholders
- Error messages
- Success messages
- Email notifications (if implemented)
- Admin panel
- Results page

---

## 📝 Prediction Form Specifications

### **Form Fields**

#### 1. **Birth Date**
- **Type:** Date picker (calendar UI)
- **Range:** January 1, 2025 - March 31, 2025 (reasonable range around February)
- **UI:** Interactive calendar with baby-themed styling
- **Validation:** Must be a future date (until Leo is born)

#### 2. **Birth Time**
- **Type:** Time picker (clock UI or dropdown)
- **Format:** 24-hour or AM/PM based on locale
- **UI:** Clock interface or hour/minute dropdowns
- **Precision:** Minute-level

#### 3. **Weight**
- **Type:** Slider
- **Range:** 2.5 kg - 5.0 kg (5.5 lbs - 11 lbs)
- **Units:** kg (primary), with lbs conversion shown
- **Step:** 0.1 kg (100g increments)
- **Visual Feedback:** Baby icon that grows/shrinks with slider
- **Display:** Show both kg and lbs simultaneously

#### 4. **Height**
- **Type:** Slider
- **Range:** 40 cm - 60 cm (15.7" - 23.6")
- **Units:** cm (primary), with inches conversion shown
- **Step:** 0.5 cm
- **Visual Feedback:** Ruler or baby silhouette that adjusts
- **Display:** Show both cm and inches simultaneously

#### 5. **Eye Color**
- **Type:** Color slider/picker
- **Options:** Predefined realistic baby eye colors:
  - Blue (light blue, sky blue, dark blue)
  - Brown (light brown, medium brown, dark brown)
  - Green (light green, hazel-green)
  - Hazel (brown-green mix)
  - Grey
- **UI:** Horizontal color palette slider or color circles
- **Visual:** Show realistic eye illustration with selected color

#### 6. **Hair Color**
- **Type:** Color slider/picker
- **Options:** Predefined realistic baby hair colors:
  - Blonde (light blonde, golden blonde)
  - Brown (light brown, medium brown, dark brown)
  - Black
  - Red (ginger, auburn)
  - Very light (almost no hair)
- **UI:** Horizontal color palette slider or color circles
- **Visual:** Show baby silhouette with selected hair color

### **Form Behavior**
- **Auto-save:** Save progress in localStorage (optional)
- **Validation:** Real-time validation with helpful error messages
- **Progress indicator:** Show completion percentage
- **Mobile-optimized:** Large touch targets, easy scrolling
- **Animations:** Smooth transitions between form sections
- **Preview:** Show summary before final submission

### **Form Submission**
- **Button:** Large, prominent "Submit Prediction" CTA
- **Confirmation:** "Are you sure?" modal before submitting
- **Success:** Celebration animation + redirect to predictions view
- **Edit:** Users can edit until admin locks submissions (January 5, 2025)

---

## 👥 User Experience Flow

### **New User Flow**
1. Land on homepage (welcome screen, countdown to due date)
2. Choose: Login or Register
3. Register with email/password or Google
4. Redirect to prediction form
5. Fill out prediction form
6. Submit prediction
7. Redirect to "All Predictions" page
8. See own prediction + all others' predictions

### **Returning User Flow**
1. Login
2. If no prediction yet: Redirect to form
3. If prediction submitted: Redirect to predictions view
4. Can edit prediction until admin locks

### **Prediction Visibility Rules**
- ❌ **Before submitting:** User CANNOT see others' predictions
- ✅ **After submitting:** User CAN see:
  - Their own prediction (highlighted)
  - All other predictions (comparison cards)
  - Statistics (average predictions, popular choices)
  - Countdown to due date

### **After Leo's Birth Flow**
1. Admin enters actual birth details
2. Admin activates "Winner Mode"
3. App calculates scores for all predictions
4. Results page displays:
   - Winner announcement with celebration
   - Top 3 leaderboard
   - Everyone's predictions vs. actual
   - Fun statistics

---

## 👨‍💼 Admin Panel Features

### **Admin Access**
- **Admin User:** `lllencinas@gmail.com`
- **URL:** `/admin` (protected route)
- **Redirect:** Non-admin users redirected to home

### **Admin Dashboard Features**

#### 1. **View All Submissions**
- Table view of all predictions
- Sortable by user, date, any field
- Filter by submission date
- Export to CSV/Excel
- Search by user name/email

#### 2. **Submit Own Prediction**
- Admin can submit prediction like any user
- Same form interface
- Marked as "Admin's Prediction" in results

#### 3. **Enter Actual Birth Results**
- Form to enter Leo's actual details:
  - Birth date
  - Birth time
  - Weight
  - Height
  - Eye color
  - Hair color
- Save as "Actual Results"
- Can edit if needed

#### 4. **Lock/Unlock Submissions**
- **Auto-lock date:** January 5, 2025, 23:59 ART
- Manual override toggle
- When locked:
  - No new predictions accepted
  - No edits allowed
  - Message shown: "Predictions are closed"

#### 5. **Activate Winner Mode**
- Button: "Calculate Winner"
- Runs scoring algorithm
- Switches app to "Results Mode"
- All users see results page

#### 6. **Manage Predictions**
- Edit any user's prediction (emergency only)
- Delete predictions (with confirmation)
- View submission timestamps

#### 7. **Statistics Dashboard**
- Total submissions
- Completion rate
- Average predictions
- Most popular choices
- Submission timeline chart

---

## 🏆 Winner Calculation Logic

### **Scoring Algorithm**

Each prediction is scored across multiple dimensions. Lower score = better (closer to actual).

#### **1. Date Accuracy** (Weight: 30%)
- Exact date: 0 points
- 1 day off: 10 points
- 2 days off: 20 points
- 3 days off: 30 points
- 4+ days off: 40 points

#### **2. Time Accuracy** (Weight: 15%)
- Within 30 minutes: 0 points
- Within 1 hour: 5 points
- Within 2 hours: 10 points
- Within 4 hours: 15 points
- Within 8 hours: 20 points
- 8+ hours off: 25 points

#### **3. Weight Accuracy** (Weight: 20%)
- Percentage difference from actual:
  - 0-2% off: 0 points
  - 2-5% off: 5 points
  - 5-10% off: 10 points
  - 10-15% off: 15 points
  - 15%+ off: 20 points

#### **4. Height Accuracy** (Weight: 20%)
- Percentage difference from actual:
  - 0-2% off: 0 points
  - 2-5% off: 5 points
  - 5-10% off: 10 points
  - 10-15% off: 15 points
  - 15%+ off: 20 points

#### **5. Eye Color Match** (Weight: 7.5%)
- Exact match: 0 points
- No match: 15 points

#### **6. Hair Color Match** (Weight: 7.5%)
- Exact match: 0 points
- No match: 15 points

### **Total Score Calculation**
```
Total Score = (Date × 0.30) + (Time × 0.15) + (Weight × 0.20) + (Height × 0.20) + (Eyes × 0.075) + (Hair × 0.075)
```

**Winner:** Lowest total score

### **Tiebreaker**
If multiple users have same score:
1. Earliest submission timestamp wins
2. If still tied: Both declared co-winners

---

## 📊 Results Page Design

### **Winner Announcement**
- Large, prominent display
- Winner's name + photo (optional)
- Final score
- Confetti animation
- Prize announcement: "Your photo will be displayed in Leo's room!" (or TBD)
- Share button (social media, WhatsApp)

### **Leaderboard (Top 3)**
- 🥇 1st place (gold medal)
- 🥈 2nd place (silver medal)
- 🥉 3rd place (bronze medal)
- Names, scores, key predictions

### **Full Results Table**
- All participants ranked
- Columns:
  - Rank
  - Name
  - Date predicted / Actual
  - Time predicted / Actual
  - Weight predicted / Actual
  - Height predicted / Actual
  - Eye color predicted / Actual
  - Hair color predicted / Actual
  - Total score
- Sortable by any column
- Highlight differences (red/green)

### **Visual Comparisons**
- **Weight Distribution Chart:** All predictions vs. actual (scatter plot)
- **Height Distribution Chart:** All predictions vs. actual (scatter plot)
- **Date Predictions Calendar:** Show all predicted dates with actual highlighted
- **Popular Choices:** Pie charts for eye color, hair color predictions

### **Fun Statistics**
- "Most optimistic weight guess"
- "Closest time prediction"
- "Earliest predicted date"
- "Latest predicted date"
- "Most popular eye color"
- "Most popular hair color"
- "Average weight prediction vs. actual"
- "Average height prediction vs. actual"

---

## 🔒 Security & Privacy

### **Data Protection**
- Passwords hashed with bcrypt
- Secure session management
- HTTPS only (enforced by Vercel)
- Environment variables for secrets
- No sensitive data in client-side code

### **Privacy**
- No data sold or shared with third parties
- Family-only access (private webapp)
- GDPR compliance notice (for Swedish visitors)
- Users can request data deletion

### **Rate Limiting**
- Prevent spam submissions
- Login attempt limiting (brute force protection)
- API rate limiting on Vercel

---

## 📅 Timeline & Deadlines

### **Submission Deadline**
- **Auto-lock date:** January 5, 2025, 23:59 (Argentina Time - ART/GMT-3)
- **Manual lock:** Admin can lock earlier if needed
- **After lock:** No new predictions, no edits allowed

### **Expected Due Date**
- **February 2025** (display countdown timer)

### **Development Timeline**
- **Phase 1-2 (Setup + Auth):** 2 hours
- **Phase 3 (i18n):** 1.5 hours
- **Phase 4 (Prediction Form):** 3 hours
- **Phase 5 (Predictions View):** 2 hours
- **Phase 6 (Admin Panel):** 2 hours
- **Phase 7 (Winner Calculation):** 1.5 hours
- **Phase 8 (Design & Animations):** Ongoing
- **Phase 9 (Deployment):** 1 hour
- **Total:** ~10-12 hours

---

## 🎁 Winner Prize

**Prize Details:** TBD (to be decided)

**Ideas:**
- "Your photo in Leo's room for a year"
- "Special mention in Leo's baby book"
- "Dinner hosted by Leo's parents"
- "Custom baby gift from Leo's family"
- "Eternal glory and bragging rights"

**Display on Results Page:**
- Show prize description prominently
- Photo/illustration of prize (if applicable)

---

## 🚀 Hosting & Infrastructure

### **Hosting Platform**
- **Vercel** (free tier)
  - Automatic HTTPS
  - Global CDN
  - Automatic deployments
  - Serverless functions
  - Environment variables
  - Custom domains (free .vercel.app subdomain)

### **Database**
- **Vercel Postgres** (free tier)
  - 256 MB storage (more than enough for ~50 users)
  - 60 hours compute/month
  - Automatic backups
  - Connection pooling

### **Domain**
- **Free options:**
  - `leonardo.vercel.app`
  - `babyleo.vercel.app`
  - `leobaby2025.vercel.app`
  - Or any available `.vercel.app` subdomain

### **Budget**
- **Total cost:** $0 (zero)
- All services use free tiers
- No credit card required initially

---

## 📦 Database Schema (Prisma)

### **User Table**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // Hashed, nullable for OAuth users
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  prediction    Prediction?
  accounts      Account[]
  sessions      Session[]
}

enum Role {
  USER
  ADMIN
}
```

### **Prediction Table**
```prisma
model Prediction {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  birthDate    DateTime
  birthTime    String   // "14:30" format
  weight       Float    // in kg
  height       Float    // in cm
  eyeColor     String   // hex or predefined value
  hairColor    String   // hex or predefined value

  submittedAt  DateTime @default(now())
  updatedAt    DateTime @updatedAt
  isLocked     Boolean  @default(false)

  @@index([userId])
}
```

### **ActualResults Table**
```prisma
model ActualResults {
  id          String   @id @default(cuid())

  birthDate   DateTime
  birthTime   String
  weight      Float
  height      Float
  eyeColor    String
  hairColor   String

  enteredAt   DateTime @default(now())
  enteredBy   String   // Admin user ID
}
```

### **Settings Table**
```prisma
model Settings {
  id                  String   @id @default(cuid())
  submissionsLocked   Boolean  @default(false)
  winnerModeActive    Boolean  @default(false)
  lockDate            DateTime // January 5, 2025
  updatedAt           DateTime @updatedAt
}
```

---

## 🎯 Core Pages & Routes

### **Public Routes**
- `/` - Homepage (welcome + countdown)
- `/login` - Login page
- `/register` - Registration page
- `/[locale]/*` - All routes with i18n

### **Protected Routes (Auth Required)**
- `/predict` - Prediction form
- `/predictions` - View all predictions
- `/results` - Winner & results (after winner mode activated)
- `/profile` - User profile (edit name, change password)

### **Admin Routes**
- `/admin` - Admin dashboard
- `/admin/submissions` - View all submissions
- `/admin/actual` - Enter actual results
- `/admin/settings` - App settings (lock/unlock, winner mode)

### **API Routes**
- `/api/auth/*` - NextAuth endpoints
- `/api/predictions` - CRUD for predictions
- `/api/admin/*` - Admin operations
- `/api/results` - Calculate and fetch results

---

## 🎨 Design System

### **Color Palette (Modern Pastels - Baby Boy Theme)**

#### Primary Colors
- **Baby Blue:** `#A8D5E2` (main brand color)
- **Soft Mint:** `#B8E6D5` (secondary)
- **Cream:** `#FFF9E6` (backgrounds)
- **Warm Peach:** `#FFD4B2` (accents)

#### Neutral Colors
- **Off-white:** `#FAFAFA` (main background)
- **Light Grey:** `#E5E5E5` (borders)
- **Medium Grey:** `#9CA3AF` (text secondary)
- **Dark Grey:** `#374151` (text primary)

#### Status Colors
- **Success:** `#A7D7C5` (soft green)
- **Error:** `#F5B5B5` (soft red)
- **Warning:** `#FFE4B5` (soft orange)
- **Info:** `#B5D7F5` (soft blue)

### **Typography**
- **Headings:** Nunito (rounded, friendly) - 700 weight
- **Body:** Inter (clean, readable) - 400 weight
- **Accents:** DM Sans (modern) - 500 weight

### **Spacing System**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

### **Border Radius**
- Small: 8px (buttons, inputs)
- Medium: 16px (cards)
- Large: 24px (modals, large cards)
- Full: 9999px (pills, avatars)

### **Shadows**
- Small: `0 1px 3px rgba(0,0,0,0.08)`
- Medium: `0 4px 12px rgba(0,0,0,0.1)`
- Large: `0 10px 30px rgba(0,0,0,0.12)`

---

## 🎬 Animation Guidelines

### **Micro-interactions**
- Button hover: Scale 1.02, slight lift shadow
- Input focus: Border glow, scale 1.01
- Card hover: Lift shadow, subtle scale

### **Page Transitions**
- Fade in: 300ms ease-out
- Slide up: 400ms ease-out
- Route change: Smooth crossfade

### **Loading States**
- Skeleton screens for content
- Spinner with baby icon
- Progress bars for multi-step forms

### **Success Animations**
- Confetti on form submission
- Checkmark animation
- Trophy bounce for winner

### **Slider Animations**
- Smooth value updates
- Visual feedback (baby icon size, ruler extension)
- Color transitions on color pickers

---

## 📱 Mobile Optimization

### **Touch Targets**
- Minimum size: 44×44px (Apple guidelines)
- Spacing between targets: 8px minimum

### **Mobile-specific Features**
- Bottom navigation (if needed)
- Pull-to-refresh on predictions page
- Swipe gestures for image galleries
- Native date/time pickers

### **Performance**
- Lazy load images
- Code splitting per route
- Optimize bundle size
- Fast initial load (< 3 seconds on 3G)

---

## 🧪 Testing Strategy

### **Manual Testing Checklist**
- [ ] Registration flow (email + Google)
- [ ] Login flow
- [ ] Prediction form submission
- [ ] Edit prediction
- [ ] View predictions (before/after submitting)
- [ ] Language switching (all 3 languages)
- [ ] Admin panel access
- [ ] Enter actual results
- [ ] Winner calculation
- [ ] Mobile responsiveness
- [ ] All animations work smoothly

### **User Testing**
- Test with 2-3 family members before launch
- Collect feedback on:
  - Ease of use
  - Design appeal
  - Mobile experience
  - Language accuracy (especially Swedish/Spanish)

---

## 📚 Additional Features (Nice to Have)

### **Phase 2 Enhancements** (Post-MVP)
- Email notifications (submission confirmation, results ready)
- WhatsApp sharing of results
- Photo upload (users upload baby photos from their childhood)
- "Guess who Leo looks like" feature (upload comparison photos)
- Prediction history download (PDF summary)
- Baby name suggestions (if name is not final)
- Real-time leaderboard during submission period
- Push notifications (if using PWA)

---

## 🎯 Success Metrics

### **Launch Goals**
- 100% family participation (all invitees submit predictions)
- Zero critical bugs on launch day
- < 3 second page load on mobile
- All 3 languages working perfectly
- Mobile-responsive on all devices

### **User Satisfaction**
- Positive feedback from family
- Easy submission process (no support questions needed)
- Excitement around results reveal

---

## 🚀 Deployment Checklist

### **Pre-launch**
- [ ] All features tested and working
- [ ] All 3 languages reviewed and accurate
- [ ] Admin panel tested
- [ ] Google OAuth configured
- [ ] Database migrations run
- [ ] Environment variables set on Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SEO meta tags added
- [ ] Favicon and app icons created
- [ ] Error pages (404, 500) designed
- [ ] Privacy notice added

### **Launch Day**
- [ ] Share link with family
- [ ] Monitor for errors
- [ ] Be available for questions
- [ ] Celebrate! 🎉

### **Post-launch**
- [ ] Monitor submission rate
- [ ] Check for bugs reported by users
- [ ] Ensure all languages working correctly
- [ ] Prepare for Leo's arrival!

---

## 📞 Contact & Support

### **Developer**
- Primary: Claude Code (AI Development Assistant)
- Human Developer: Lucas (lllencinas@gmail.com)

### **Admin**
- Lucas (lllencinas@gmail.com)

### **Support for Family Members**
- Email: lllencinas@gmail.com
- In-app help: FAQ section (optional)

---

## 📝 Notes for Lovable (AI Design Assistant)

### **Design Focus Areas**
1. **Color Palette:** Modern pastels for baby boy (blues, mints, creams)
2. **Interactive Elements:** Sliders for weight/height/colors need to be visually engaging
3. **Prediction Cards:** Show predictions in beautiful, comparable card layout
4. **Results Visualization:** Charts and comparisons should be clear and celebratory
5. **Mobile-first:** Most users on phones - optimize for mobile experience
6. **Animations:** Playful but not overwhelming - enhance UX, don't distract
7. **Typography:** Friendly, rounded fonts for headings; clean sans-serif for body

### **Key Pages to Design**
1. Homepage (welcome + countdown)
2. Prediction form (most important - needs to be fun!)
3. Predictions gallery (after submission)
4. Results page (winner announcement)
5. Admin panel (clean, functional)

### **Design Inspiration Keywords**
- Baby shower invitations
- Modern nursery design
- Playful web apps (Duolingo, Headspace)
- Pastel color schemes
- Scandinavian minimalism meets playful
- Family-friendly interfaces

---

## 🎉 Final Notes

This webapp is a **labor of love** for baby Leo's arrival. The goal is to create a memorable, fun experience for the family while being technically solid and beautifully designed.

**Key Principles:**
- ✨ **Playful but professional** - Fun design, solid code
- 📱 **Mobile-first** - Most users on phones
- 🌍 **Inclusive** - Three languages for international family
- 🎯 **User-focused** - Easy to use for all ages
- 🚀 **Fast** - Quick load times, smooth interactions
- ❤️ **Memorable** - Something the family will cherish

**Let's build something special for Leo!** 👶💙

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Ready for Development & Design Collaboration
