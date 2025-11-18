# Edit Prediction Feature - Testing Guide

## ✅ Feature Status: FULLY IMPLEMENTED

The edit prediction feature is complete and ready to test!

## How to Test

### Test 1: Create Initial Prediction

1. Open `http://localhost:3000/predict`
2. Fill out all 8 steps with test data:
   - Name: "Test User"
   - Email: "test@example.com"
   - Birth date, time, weight, height, colors
3. Submit the prediction
4. ✅ Should see success message
5. ✅ Check localStorage: `predictionSubmitted` should contain "test@example.com"

### Test 2: Edit Mode Auto-Load

1. Refresh the page or navigate to `/predict` again
2. ✅ Should see blue banner: "✏️ You're Editing Your Prediction"
3. ✅ All form fields should be pre-filled with previous values
4. ✅ Submit button should say "Update My Prediction ✏️"

### Test 3: Update Prediction

1. In edit mode, change some values:
   - Change birth date
   - Change weight
   - Change eye color
2. Click through to review step
3. Submit the updated prediction
4. ✅ Should see: "Prediction Updated!" message
5. ✅ Check database: Should still be 1 prediction, not 2

### Test 4: View Updated Prediction

1. Go to `/predictions`
2. Find your test prediction
3. ✅ Should show the UPDATED values, not original

### Test 5: Different User

1. Clear localStorage or use incognito window
2. Submit prediction with different email
3. ✅ Should create NEW prediction (not update)
4. ✅ Database should now have 2 predictions

### Test 6: Locked Submissions

1. As admin, lock submissions
2. Try to edit an existing prediction
3. ✅ Should show "Submissions Are Closed" message
4. ✅ Should NOT allow edits when locked

## API Testing

### Fetch Existing Prediction
```bash
curl "http://localhost:3000/api/predictions/by-email?email=test@example.com"
```

Expected response:
```json
{
  "prediction": {
    "id": "...",
    "userName": "Test User",
    "userEmail": "test@example.com",
    "birthDate": "...",
    "birthTime": "12:00",
    "weight": 3.5,
    "height": 50,
    "eyeColor": "...",
    "hairColor": "..."
  }
}
```

### Update Prediction
```bash
curl -X POST http://localhost:3000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Test User Updated",
    "userEmail": "test@example.com",
    "birthDate": "2026-02-06",
    "birthTime": {"hours": 14, "minutes": 30},
    "weight": 3.8,
    "height": 52,
    "eyeColor": "brown",
    "hairColor": "black"
  }'
```

Expected response:
```json
{
  "success": true,
  "updated": true,
  "message": "Prediction updated successfully!",
  "prediction": { ... }
}
```

## Code References

### Key Files:
- **Form Component**: [app/[locale]/(app)/predict/page.tsx](app/[locale]/(app)/predict/page.tsx)
  - Lines 71-110: Load existing prediction logic
  - Lines 224-235: Edit mode banner
  - Line 549: Dynamic button text

- **API Routes**:
  - [app/api/predictions/route.ts](app/api/predictions/route.ts:41-87): Update logic
  - [app/api/predictions/by-email/route.ts](app/api/predictions/by-email/route.ts): Fetch by email

### Translation Keys Used:
- `predict.editingYourPrediction`
- `predict.editingDescription`
- `predict.editPrediction`
- `predict.updating`
- `predict.predictionUpdated`
- `predict.predictionUpdatedTitle`
- `predict.predictionUpdatedMessage`

## Known Limitations

1. **LocalStorage Dependency**: User must use same browser/device
   - Fix: Implement email verification (separate feature)

2. **No Edit History**: Previous versions are overwritten
   - Fix: Add version tracking (future enhancement)

3. **Email Case Sensitivity**: Already handled with `mode: 'insensitive'`

## Next Steps

If all tests pass:
- ✅ Mark feature as complete
- Update FEATURE_PROPOSALS.md
- Consider adding email verification for cross-device editing

---

**Test Status**: Ready for testing
**Last Updated**: 2025-01-18
