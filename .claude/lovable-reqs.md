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

## 📱 Mobile Optimization

### **Touch Targets**

- Minimum size: 44×44px (Apple guidelines)
- Spacing between targets: 8px minimum

### **Mobile-specific Features**

- Bottom navigation (if needed)
- Pull-to-refresh on predictions page
- Swipe gestures for image galleries
- Native date/time pickers

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
