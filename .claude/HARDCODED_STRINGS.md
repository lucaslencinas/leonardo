# Hardcoded Strings Needing Internationalization

## app/[locale]/(app)/predict/page.tsx

### Step Labels (lines 112-119)
- `'Your Info'` → `predict.steps.yourInfo`
- `'Birth Date'` → `predict.steps.birthDate`
- `'Birth Time'` → `predict.steps.birthTime`
- `'Weight'` → `predict.steps.weight`
- `'Height'` → `predict.steps.height`
- `'Eye Color'` → `predict.steps.eyeColor`
- `'Hair Color'` → `predict.steps.hairColor`
- `'Review'` → `predict.steps.review`

### Submissions Locked Section (lines 198-215)
- `'Submissions Are Closed'` → `predict.submissionsClosedTitle`
- `'We're no longer accepting new predictions. The baby has arrived or submissions have been locked by the administrator.'` → `predict.submissionsClosedMessage`
- `'← Back to Home'` → `common.backToHome`
- `'View Predictions →'` → `common.viewPredictions`

### Progress Step Counter (line 280)
- `'Step {currentStep + 1} of {steps.length}'` → `predict.stepCounter` (with variables)

### Step 0: User Info (lines 292-327)
- `'👤 Tell us about yourself'` → `predict.tellUsAboutYourself`
- `'We'll use this to identify your prediction'` → `predict.identifyPredictionMessage`
- `'Your Name'` → `predict.yourName`
- `'e.g., John Smith'` → `predict.namePlaceholder`
- `'Your Email'` → `predict.yourEmail`
- `'your.email@example.com'` → `predict.emailPlaceholder`
- `'We'll never share your email. One prediction per email.'` → `predict.emailPrivacyNote`

### Review Step Labels (lines 434-480)
- `'Name'` → `predict.nameLabel`
- `'Email'` → `predict.emailLabel`
- `'📅 Date'` → `predict.dateLabel` (already have, reuse)
- `'⏰ Time'` → `predict.timeLabel` (already have, reuse)
- `'⚖️ Weight'` → `predict.weightLabel` (already have, reuse)
- `'📏 Height'` → `predict.heightLabel` (already have, reuse)
- `'👁️ Eyes'` → `predict.eyesLabel`
- `'💇 Hair'` → `predict.hairLabel`

### Success Messages (lines 395-408)
- `'Prediction Updated!'` → `predict.predictionUpdatedTitle`
- `'Prediction Submitted!'` → `predict.predictionSubmittedTitle`
- `'Your prediction has been successfully updated!'` → `predict.predictionUpdatedMessage`
- `'Thank you for participating! Your prediction has been saved.'` → `predict.predictionSubmittedMessage`
- `'View all predictions →'` → `predict.viewAllPredictions`

### Review Section (lines 414-418)
- `'📋'` → (emoji, keep)
- `'Review Your Prediction'` → `predict.reviewYourPredictionTitle`
- `'Please check your prediction before submitting'` → `predict.reviewInstructions`
- `'Your Prediction Summary'` → `predict.yourPredictionSummary`

### Navigation Buttons (lines 510-533)
- `'← Previous'` → `predict.previousButton` (already have, reuse)
- `'Cancel'` → `common.cancel`
- `'Next →'` → `predict.nextButton` (already have, reuse)

### Loading State (line 561)
- `'Checking submission status...'` → `predict.checkingSubmissionStatus`

## app/[locale]/(app)/predictions/page.tsx

### No Predictions State (lines 172-182)
- `'No predictions yet!'` → `predictions.noPredictionsYetTitle`
- `'Be the first to predict Baby Leo's arrival details'` → `predictions.beTheFirst`
- `'Make Your Prediction 🎉'` → (reuse from gate section)

### Header Section (lines 198-211)
- `'← Back to Home'` → `common.backToHome`
- `'Baby Leo Predictions'` → `predictions.pageTitle`
- `'Everyone's predictions at a glance'` → `predictions.pageSubtitle`
- `'{predictions.length} prediction{predictions.length !== 1 ? 's' : ''} submitted'` → `predictions.predictionsSubmitted` (with plural)

## Translation Keys to Add

### English (messages/en.json)

```json
{
  "common": {
    "backToHome": "← Back to Home",
    "viewPredictions": "View Predictions →",
    "cancel": "Cancel"
  },
  "predict": {
    "steps": {
      "yourInfo": "Your Info",
      "birthDate": "Birth Date",
      "birthTime": "Birth Time",
      "weight": "Weight",
      "height": "Height",
      "eyeColor": "Eye Color",
      "hairColor": "Hair Color",
      "review": "Review"
    },
    "submissionsClosedTitle": "Submissions Are Closed",
    "submissionsClosedMessage": "We're no longer accepting new predictions. The baby has arrived or submissions have been locked by the administrator.",
    "stepCounter": "Step {current} of {total}",
    "tellUsAboutYourself": "👤 Tell us about yourself",
    "identifyPredictionMessage": "We'll use this to identify your prediction",
    "emailPrivacyNote": "We'll never share your email. One prediction per email.",
    "nameLabel": "Name",
    "emailLabel": "Email",
    "eyesLabel": "👁️ Eyes",
    "hairLabel": "💇 Hair",
    "predictionUpdatedTitle": "Prediction Updated!",
    "predictionSubmittedTitle": "Prediction Submitted!",
    "predictionUpdatedMessage": "Your prediction has been successfully updated!",
    "predictionSubmittedMessage": "Thank you for participating! Your prediction has been saved.",
    "viewAllPredictions": "View all predictions →",
    "reviewYourPredictionTitle": "Review Your Prediction",
    "reviewInstructions": "Please check your prediction before submitting",
    "yourPredictionSummary": "Your Prediction Summary",
    "checkingSubmissionStatus": "Checking submission status..."
  },
  "predictions": {
    "noPredictionsYetTitle": "No predictions yet!",
    "beTheFirst": "Be the first to predict Baby Leo's arrival details",
    "pageTitle": "Baby Leo Predictions",
    "pageSubtitle": "Everyone's predictions at a glance",
    "predictionsSubmitted": "{count, plural, =1 {# prediction submitted} other {# predictions submitted}}"
  }
}
```

## Files to Update
1. ✅ messages/en.json - Add new keys
2. ✅ messages/sv.json - Add Swedish translations
3. ✅ messages/es-AR.json - Add Spanish translations
4. ✅ app/[locale]/(app)/predict/page.tsx - Replace hardcoded strings
5. ✅ app/[locale]/(app)/predictions/page.tsx - Replace hardcoded strings
