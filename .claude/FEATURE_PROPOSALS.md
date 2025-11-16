# Feature Proposals

## 1. Email Verification Flow ✉️

### Purpose
Allow users to access predictions from different devices by verifying their email.

### Flow
```
User visits /predictions without localStorage
  ↓
Shows: "Enter email to verify"
  ↓
User enters email → System sends 6-digit code
  ↓
User enters code from email
  ↓
System validates code → Saves to localStorage
  ↓
Shows predictions
```

### Implementation Requirements

#### A. Database Changes (Prisma)
```prisma
model User {
  id                      String    @id @default(cuid())
  email                   String    @unique
  name                    String
  verificationCode        String?   // 6-digit code
  verificationCodeExpiry  DateTime? // Expires after 15 minutes
  predictions             Prediction[]
}
```

#### B. Email Service Setup
**Recommended: Resend.com**
- Free tier: 100 emails/day
- Simple API
- No credit card required

```bash
npm install resend
```

```.env
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@yourdomain.com
```

#### C. API Routes Needed

**1. `POST /api/verify/request`**
```typescript
// Generates 6-digit code
// Saves to database with 15min expiry
// Sends email with code
```

**2. `POST /api/verify/check`**
```typescript
// Validates code
// Checks expiry
// Returns success/fail
```

#### D. UI Components
- Email input modal on `/predictions`
- Code verification input
- Loading states
- Error messages

### Estimated Time
- Setup: 30 minutes
- Implementation: 1-2 hours
- Testing: 30 minutes

**Total: ~3 hours**

---

## 2. Edit Predictions 📝

### Purpose
Allow users to modify their predictions before the deadline.

### Rules
- Can edit anytime **before** submissions lock (Jan 5, 2026)
- After lock date: NO edits allowed
- Must use same email to edit

### Implementation

#### A. Database Changes
Already supported! Just need to:
- Check if prediction exists for email
- Update instead of create

#### B. API Changes
**Update `POST /api/predictions`**
```typescript
// Check if prediction exists for this email
const existing = await prisma.prediction.findFirst({
  where: { user: { email: formData.userEmail } }
});

if (existing) {
  // UPDATE existing prediction
  await prisma.prediction.update({
    where: { id: existing.id },
    data: { ...newData }
  });
} else {
  // CREATE new prediction
  await prisma.prediction.create({...});
}
```

#### C. UI Changes
**Prediction Form (`/predict`)**
- On load, check if user has existing prediction
- If yes, pre-fill form with their data
- Change button text: "Update My Prediction" vs "Submit Prediction"
- Show message: "You're editing your prediction"

#### D. UX Flow
```
User visits /predict
  ↓
Checks localStorage for email
  ↓
Fetches their existing prediction
  ↓
Pre-fills form
  ↓
Shows: "✏️ Editing Your Prediction"
  ↓
User modifies and submits
  ↓
Updates database (not creates new)
```

### Estimated Time
- API changes: 30 minutes
- UI pre-fill logic: 1 hour
- Testing: 30 minutes

**Total: ~2 hours**

---

## 3. Missing Translations 🌍

### Current Situation
- Translations exist for: home, predict, predictions, results, admin
- Many hardcoded strings in newly added features:
  - Admin dashboard cards
  - Clear all data
  - Prediction gate
  - Review summary sections
  - Error messages

### Pages Needing Translation Audit
1. ✅ Home page - has translations
2. ⚠️ Predict page - partial (new features need i18n)
3. ⚠️ Predictions page - partial (gate needs i18n)
4. ⚠️ Admin pages - minimal translations
5. ❌ Clear data modal - NO translations
6. ❌ Lock submissions UI - NO translations

### Implementation Strategy
1. **Audit**: Find all hardcoded strings
2. **Add keys**: Update messages/en.json, sv.json, es-AR.json
3. **Replace**: Change hardcoded strings to `t('key')`
4. **Test**: Check all 3 languages

### Estimated Time
- Audit: 30 minutes
- Add translations: 1 hour
- Replace strings: 1-2 hours
- Test: 30 minutes

**Total: ~3-4 hours**

---

## Priority Recommendation

### Quick Wins (Do These First)
1. **Edit Predictions** - 2 hours, high user value
2. **Translations** - 3-4 hours, professional polish

### Can Wait
3. **Email Verification** - 3 hours, nice-to-have
   - Current localStorage approach works fine
   - Only needed if cross-device is essential

---

## Decision Time!

**Which features do you want me to implement?**

A. All three?
B. Edit predictions + Translations (skip email verification)?
C. Just one specific feature?

Let me know and I'll implement them in order! 🚀
