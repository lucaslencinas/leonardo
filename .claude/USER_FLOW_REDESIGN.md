# User Flow Redesign - Access Control + Clear Authentication

**Created:** November 20, 2024
**Status:** In Progress

## Problems We're Solving

1. **No access control** - Public website, anyone can submit predictions
2. **Confusing user flow** - No clear concept of "logging in"
3. **Unclear create vs edit** - Users don't know if they're updating or creating
4. **Invisible session** - localStorage makes it unclear who is logged in

## New User Flow

### Step 1: Access Code Gate
**Location:** Landing page (`/[locale]`)

```
┌─────────────────────────────────────┐
│  Welcome to Baby Leo Predictions!   │
│                                     │
│  Enter Access Code:                 │
│  [________________]  [Continue]     │
│                                     │
│  Or use this link with code:        │
│  babyleo.xyz?code=FAMILY2025        │
└─────────────────────────────────────┘
```

**Implementation:**
- Check URL param `?code=XXX` first
- If no code in URL, show access code input form
- Validate code against database
- Store valid code in localStorage
- Redirect to `/[locale]/predict`

### Step 2: Email Entry & Verification
**Location:** First step of prediction form (`/[locale]/predict`)

```
┌─────────────────────────────────────┐
│  Step 1: Your Information           │
│                                     │
│  Email: [________________]          │
│  [Send Verification Code]           │
│                                     │
│  Verification Code:                 │
│  [_____] [Verify]                   │
└─────────────────────────────────────┘
```

**Implementation:**
- Check if email already verified in localStorage
- If yes, skip to next step
- If no, ask for email
- Send verification code
- Verify code
- Mark as verified in localStorage
- Auto-check if prediction exists
- Show banner: "Creating new" or "Editing existing"

### Step 3: Prediction Form
**Location:** `/[locale]/predict`

```
┌─────────────────────────────────────┐
│  Logged in as: lucas@example.com    │
│  [Logout]                           │
│                                     │
│  ✏️ You're Editing Your Prediction  │
│  or                                 │
│  ✨ Create Your Prediction          │
│                                     │
│  [Rest of form steps...]            │
└─────────────────────────────────────┘
```

**Implementation:**
- Show user header with email and logout
- Clear banner indicating create vs edit
- All existing form functionality

## Database Schema Changes

### New Model: AccessCode

```prisma
model AccessCode {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "FAMILY2025"
  description String?  // e.g., "Family members"
  type        String   @default("GENERAL") // FAMILY, FRIENDS, VIP
  isActive    Boolean  @default(true)
  maxUses     Int?     // null = unlimited
  usedCount   Int      @default(0)
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([code])
}
```

## API Endpoints

### POST /api/auth/validate-code
**Request:**
```json
{
  "code": "FAMILY2025"
}
```

**Response:**
```json
{
  "valid": true,
  "codeType": "FAMILY",
  "message": "Access granted"
}
```

### POST /api/auth/logout
**Response:**
```json
{
  "success": true
}
```

## LocalStorage Structure

```typescript
{
  "accessCode": "FAMILY2025",
  "userEmail": "lucas@example.com",
  "emailVerified": true,
  "verifiedAt": "2024-11-20T19:00:00.000Z"
}
```

## Components to Create

1. **AccessCodeGate** - Landing page access control
2. **UserHeader** - Shows logged-in email + logout
3. **EmailVerificationStep** - Step 1 of prediction form
4. **SessionBanner** - "Creating" vs "Editing" indicator

## Migration Steps

1. ✅ Create database schema
2. ✅ Seed initial access codes
3. ✅ Create API endpoints
4. ✅ Build AccessCodeGate component
5. ✅ Update landing page
6. ✅ Refactor prediction form
7. ✅ Add UserHeader component
8. ✅ Test complete flow
9. ✅ Deploy to production

## Access Codes to Create

- `FAMILY2025` - For family members
- `FRIENDS2025` - For friends
- `VIP2025` - For special guests

## Benefits

✅ **Access control** - Only people with codes can participate
✅ **Clear identity** - Always know who you are (email in header)
✅ **Obvious state** - Create vs edit is crystal clear
✅ **Better UX** - Step-by-step guided flow
✅ **Cross-device** - Email verification enables access anywhere
✅ **Admin control** - Can deactivate codes, set limits, track usage
