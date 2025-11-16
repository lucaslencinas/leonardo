/**
 * Winner Calculation Algorithm
 *
 * Calculates the "distance" between each prediction and the actual results.
 * Lower score = better prediction = closer to reality
 */

interface Prediction {
  id: string;
  userId: string;
  birthDate: Date;
  birthTime: string; // "14:30" format
  weight: number; // kg
  height: number; // cm
  eyeColor: string;
  hairColor: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface ActualResults {
  birthDate: Date;
  birthTime: string; // "14:30" format
  weight: number; // kg
  height: number; // cm
  eyeColor: string;
  hairColor: string;
}

export interface ScoredPrediction extends Prediction {
  score: number;
  breakdown: {
    dateScore: number;
    timeScore: number;
    weightScore: number;
    heightScore: number;
    eyeColorScore: number;
    hairColorScore: number;
  };
  rank?: number;
}

/**
 * Scoring weights and rules:
 * - Date: 1 point per day difference
 * - Time: 1 point per 60 minutes difference (rounded to hours)
 * - Weight: 1 point per 100g difference
 * - Height: 1 point per cm difference
 * - Eye Color: 10 points if wrong, 0 if correct
 * - Hair Color: 10 points if wrong, 0 if correct
 */

export function calculateWinners(
  predictions: Prediction[],
  actualResults: ActualResults
): ScoredPrediction[] {
  const scoredPredictions = predictions.map((prediction) => {
    const breakdown = {
      dateScore: calculateDateScore(prediction.birthDate, actualResults.birthDate),
      timeScore: calculateTimeScore(prediction.birthTime, actualResults.birthTime),
      weightScore: calculateWeightScore(prediction.weight, actualResults.weight),
      heightScore: calculateHeightScore(prediction.height, actualResults.height),
      eyeColorScore: calculateColorScore(prediction.eyeColor, actualResults.eyeColor),
      hairColorScore: calculateColorScore(prediction.hairColor, actualResults.hairColor),
    };

    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

    return {
      ...prediction,
      score: totalScore,
      breakdown,
    };
  });

  // Sort by score (lowest = best)
  const sorted = scoredPredictions.sort((a, b) => a.score - b.score);

  // Add rank
  return sorted.map((prediction, index) => ({
    ...prediction,
    rank: index + 1,
  }));
}

/**
 * Calculate date score: 1 point per day difference
 */
function calculateDateScore(predicted: Date, actual: Date): number {
  const predictedDate = new Date(predicted);
  const actualDate = new Date(actual);

  // Reset time to midnight for both dates
  predictedDate.setHours(0, 0, 0, 0);
  actualDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(predictedDate.getTime() - actualDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Calculate time score: 1 point per 60 minutes difference
 */
function calculateTimeScore(predicted: string, actual: string): number {
  const [predictedHours, predictedMinutes] = predicted.split(':').map(Number);
  const [actualHours, actualMinutes] = actual.split(':').map(Number);

  const predictedTotalMinutes = predictedHours * 60 + predictedMinutes;
  const actualTotalMinutes = actualHours * 60 + actualMinutes;

  const diffMinutes = Math.abs(predictedTotalMinutes - actualTotalMinutes);

  // Round to hours (60 minutes = 1 point)
  return Math.round(diffMinutes / 60);
}

/**
 * Calculate weight score: 1 point per 100g difference
 */
function calculateWeightScore(predicted: number, actual: number): number {
  const diffKg = Math.abs(predicted - actual);
  const diffGrams = diffKg * 1000;

  // 1 point per 100g
  return Math.round(diffGrams / 100);
}

/**
 * Calculate height score: 1 point per cm difference
 */
function calculateHeightScore(predicted: number, actual: number): number {
  return Math.abs(predicted - actual);
}

/**
 * Calculate color score: 10 points if wrong, 0 if correct
 */
function calculateColorScore(predicted: string, actual: string): number {
  return predicted.toLowerCase() === actual.toLowerCase() ? 0 : 10;
}

/**
 * Get medal for rank
 */
export function getMedal(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
}

/**
 * Get score color (for UI)
 */
export function getScoreColor(score: number): string {
  if (score === 0) return 'text-green-600'; // Perfect!
  if (score <= 5) return 'text-green-500'; // Excellent
  if (score <= 10) return 'text-yellow-500'; // Good
  if (score <= 20) return 'text-orange-500'; // Okay
  return 'text-red-500'; // Far off
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score === 0) return 'Perfect! 🎯';
  if (score <= 5) return 'Excellent! ⭐';
  if (score <= 10) return 'Very Good! 👍';
  if (score <= 20) return 'Good! 👌';
  if (score <= 30) return 'Not bad! 😊';
  return 'Nice try! 💪';
}
