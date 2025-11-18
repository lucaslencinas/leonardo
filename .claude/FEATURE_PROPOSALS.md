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

## 2. ✅ Edit Predictions - COMPLETE! 📝

### Status: FULLY IMPLEMENTED

Users can now modify their predictions before the deadline!

### Features Implemented

✅ **Auto-load existing predictions**
- Form checks localStorage for user's email
- Fetches prediction via `/api/predictions/by-email`
- Pre-fills all form fields automatically

✅ **Smart Update/Create Logic**
- API automatically detects existing predictions
- Updates existing record instead of creating duplicates
- Maintains data integrity

✅ **Edit Mode UI**
- Blue banner: "✏️ You're Editing Your Prediction"
- Dynamic button text: "Update My Prediction" vs "Submit Prediction"
- Different success messages for updates vs new submissions

✅ **Submission Lock Respect**
- Edits blocked when admin locks submissions
- Shows clear "Submissions Are Closed" message

### How to Test

See [.claude/EDIT_PREDICTION_TEST.md](.claude/EDIT_PREDICTION_TEST.md) for complete testing guide.

### Code References

- Form: [app/[locale]/(app)/predict/page.tsx](app/[locale]/(app)/predict/page.tsx:71-110)
- API: [app/api/predictions/route.ts](app/api/predictions/route.ts:41-87)
- Fetch: [app/api/predictions/by-email/route.ts](app/api/predictions/by-email/route.ts)

---

## Status Summary

✅ **Translations** - COMPLETE! All pages fully translated (EN, ES-AR, SV)
✅ **Edit Predictions** - COMPLETE! Users can modify predictions before deadline

## Remaining Features

### Email Verification (~3 hours)
**Status**: Proposed, not yet implemented

**Purpose**: Cross-device access to predictions

**Current Limitation**:
- Users can only edit predictions on the same browser (localStorage dependency)
- Switching devices or browsers means they can't access their prediction

**Proposed Solution**:
- Email verification with 6-digit code
- Users can access predictions from any device
- More secure than localStorage only

**Priority**: Nice-to-have, not critical
- Current localStorage approach works well for single-device users
- Consider implementing if cross-device access becomes important

See "Email Verification Flow" section above for implementation details.

---

## Next Steps

**Recommended priorities:**

1. **Test Edit Predictions** - Verify the feature works as expected
2. **Polish & Bug Fixes** - Address any issues found during testing
3. **Email Verification** (Optional) - If cross-device access is needed
4. **Bonding Features** (from SESSION_SUMMARY.md):
   - Google Photos integration
   - Email notifications

**Ready to implement any of these? Let me know!** 🚀
