# Leonardo - Testing Guide

## 🧪 Current Build Status

### ✅ What's Working:

1. **Next.js 16** with TypeScript
2. **Internationalization** (3 languages: EN, ES-AR, SV)
3. **Homepage** with countdown timer
4. **Language switcher** with flag icons
5. **Baby-themed design** with modern pastels

---

## 🚀 How to Test

### **1. Start the Development Server**

```bash
npm run dev
```

The server will start at: **http://localhost:3000**

---

### **2. Test the Homepage**

**What you should see:**
- ✅ Beautiful gradient background (soft pastels)
- ✅ Large "Leonardo" heading with gradient text
- ✅ Welcome message in current language
- ✅ Live countdown timer to February 15, 2025
  - Days, Hours, Minutes, Seconds updating every second
- ✅ Two CTA buttons:
  - "Make Your Prediction" (blue button)
  - "View All Predictions" (white button)
- ✅ Animated baby emojis at the bottom (👶🍼🎉)

**Mobile Test:**
- Resize your browser to mobile size
- Everything should be responsive and look good

---

### **3. Test Language Switching**

**Location:** Top-right corner

**What to test:**
1. Click the language switcher (shows current flag + language name)
2. Dropdown appears with 3 options:
   - 🇬🇧 English
   - 🇦🇷 Español (Argentine Spanish)
   - 🇸🇪 Svenska (Swedish)
3. Select each language and verify:
   - Page content changes immediately
   - URL changes to `/en`, `/es-AR`, or `/sv`
   - All text updates correctly
   - Selected language has checkmark

**Specific things to verify in Spanish:**
- Uses "vos" forms (e.g., "querés" not "quieres")
- Argentine vocabulary
- Check the welcome message

**Specific things to verify in Swedish:**
- Swedish translations look natural
- Date format is YYYY-MM-DD (will be visible in forms later)

---

### **4. Test Routing**

**Try these URLs manually:**

1. **Root URL:**
   - Visit `http://localhost:3000`
   - Should auto-detect your browser language
   - Should redirect to `/en`, `/es-AR`, or `/sv`

2. **Direct locale URLs:**
   - `http://localhost:3000/en` - English
   - `http://localhost:3000/es-AR` - Spanish
   - `http://localhost:3000/sv` - Swedish

3. **Navigation (not implemented yet):**
   - Click "Make Your Prediction" → Should go to `/[locale]/predict` (will show 404 for now)
   - Click "View All Predictions" → Should go to `/[locale]/predictions` (will show 404 for now)

---

### **5. Test Design Elements**

**Color Palette Check:**
- Background: Soft gradient (blue → cream → mint)
- Countdown boxes: Light blue background
- Buttons: Blue and mint colors
- Text: Dark grey, readable

**Typography:**
- Headings: Rounded, friendly font (Nunito)
- Body: Clean sans-serif (Inter)

**Animations:**
- Baby emojis bounce continuously
- Language switcher has smooth dropdown animation
- Hover effects on buttons (scale up slightly)

---

### **6. Browser Console Check**

Open browser DevTools (F12) and check:
- **Console tab:** Should have no red errors
- **Network tab:** All requests should succeed
- **Performance:** Page should load quickly

---

## 🐛 Known Issues / Warnings

### **Next.js Middleware Warning**
```
⚠ The "middleware" file convention is deprecated.
```
**Status:** This is a Next.js warning about future changes. The app works fine.
**Impact:** None - functionality works correctly

---

## ✅ Testing Checklist

Use this checklist to verify everything works:

- [ ] Server starts without errors (`npm run dev`)
- [ ] Homepage loads at `http://localhost:3000`
- [ ] Countdown timer is running and updating every second
- [ ] Language switcher appears in top-right corner
- [ ] Can switch between all 3 languages (EN, ES-AR, SV)
- [ ] Text changes when switching languages
- [ ] Argentine Spanish uses "vos" forms
- [ ] Mobile responsive (resize browser to ~375px width)
- [ ] No console errors in browser DevTools
- [ ] Buttons have hover effects
- [ ] Baby emojis are animating
- [ ] Gradient background looks good
- [ ] Fonts load correctly (rounded headings, clean body text)

---

## 🎨 Visual Testing

### **Expected Look:**

**Desktop:**
```
┌─────────────────────────────────────────────┐
│                    🇦🇷 Español ▼     (top-right) │
│                                             │
│              Leonardo                       │
│        (gradient blue text)                 │
│                                             │
│   Welcome to Baby Leo's Prediction Game!   │
│                                             │
│   ┌─────────────────────────────────┐      │
│   │   Days until Leo's arrival      │      │
│   │   ┌──┐ ┌──┐ ┌──┐ ┌──┐          │      │
│   │   │92│ │12│ │34│ │56│          │      │
│   │   └──┘ └──┘ └──┘ └──┘          │      │
│   │   days hrs min sec              │      │
│   └─────────────────────────────────┘      │
│                                             │
│  [Make Your Prediction] [View Predictions] │
│                                             │
│           👶    🍼    🎉                   │
│        (bouncing)                           │
└─────────────────────────────────────────────┘
```

**Mobile:**
- Everything stacks vertically
- Language switcher stays top-right
- Countdown grid shrinks but stays readable
- Buttons stack vertically

---

## 📝 What's NOT Implemented Yet

These features will show errors/404s (expected):

- [ ] Login/Register pages
- [ ] Prediction form
- [ ] Predictions gallery
- [ ] Results page
- [ ] Admin panel
- [ ] Database connection
- [ ] Authentication

**This is normal!** We're testing Phase 1 only.

---

## 🔧 Troubleshooting

### **Server won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### **Port 3000 already in use:**
```bash
# Kill existing process
npx kill-port 3000
npm run dev
```

### **Translations not updating:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

### **Styles not loading:**
- Check `app/globals.css` exists
- Restart dev server

---

## ✨ What to Test Next

After confirming everything above works, we'll build:

1. **Authentication system** (login/register)
2. **Prediction form** (the fun interactive part!)
3. **Predictions gallery**
4. **Admin panel**
5. **Results & winner calculation**

---

## 📸 Share Feedback

After testing, let me know:
1. ✅ What works well
2. 🐛 Any bugs or issues
3. 🎨 Design feedback (colors, fonts, layout)
4. 🌍 Translation feedback (especially Spanish & Swedish)
5. 💡 Any feature requests or changes

---

**Last Updated:** 2025-11-15
**Build Version:** Phase 1 - Foundation Complete
