'use client';

import { useEffect, useState } from 'react';
import { DateResultsView } from '@/components/results/DateResultsView';
import { TimeResultsView } from '@/components/results/TimeResultsView';
import { WeightResultsView } from '@/components/results/WeightResultsView';
import { HeightResultsView } from '@/components/results/HeightResultsView';
import { EyeColorResultsView } from '@/components/results/EyeColorResultsView';
import { HairColorResultsView } from '@/components/results/HairColorResultsView';
import { Link } from '@/i18n/routing';

interface Prediction {
  id: string;
  userName: string;
  userEmail?: string;
  birthDate: string;
  birthTime: string;
  weight: number;
  height: number;
  eyeColor: string;
  hairColor: string;
  submittedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const dueDate = new Date('2026-02-05T12:00:00');

  useEffect(() => {
    // Check if user has submitted a prediction
    const submittedEmail = localStorage.getItem('predictionSubmitted');

    async function fetchPredictions() {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch predictions');
        }

        const allPredictions = data.predictions || [];

        // Check if this user has submitted a prediction
        if (submittedEmail) {
          const userPrediction = allPredictions.find(
            (p: Prediction) => {
              const email = p.userEmail || p.user?.email;
              return email?.toLowerCase() === submittedEmail.toLowerCase();
            }
          );
          setHasSubmitted(!!userPrediction);
        }

        setPredictions(allPredictions);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load predictions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  // Convert API predictions to the format expected by result components
  const formattedPredictions = predictions.map((p) => {
    const [hours, minutes] = p.birthTime.split(':').map(Number);
    return {
      id: p.id,
      userName: p.userName,
      birthDate: new Date(p.birthDate),
      birthTime: { hours, minutes },
      weight: p.weight,
      height: p.height,
      eyeColor: p.eyeColor,
      hairColor: p.hairColor,
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-baby-cream via-white to-baby-blue/20 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-heading font-bold text-neutral-dark">
              Loading predictions...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-baby-cream via-white to-baby-blue/20 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-neutral-medium mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-baby-blue text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show gate if user hasn't submitted yet
  if (!hasSubmitted && predictions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-baby-cream via-white to-baby-blue/20 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔒</div>
            <h2 className="text-3xl font-heading font-bold text-neutral-dark mb-4">
              Submit Your Prediction First!
            </h2>
            <p className="text-lg text-neutral-medium mb-2 max-w-2xl mx-auto">
              To keep it fair and fun, you need to make your own prediction before seeing what others guessed.
            </p>
            <p className="text-neutral-medium mb-8">
              <strong>{predictions.length}</strong> {predictions.length === 1 ? 'person has' : 'people have'} already predicted!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/predict"
                className="px-8 py-4 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg"
              >
                Make Your Prediction 🎉
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-white border-2 border-neutral-light text-neutral-dark font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-lg"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-baby-cream via-white to-baby-blue/20 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">
              No predictions yet!
            </h2>
            <p className="text-neutral-medium mb-6">
              Be the first to predict Baby Leo's arrival details
            </p>
            <Link
              href="/predict"
              className="inline-block px-8 py-3 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Make Your Prediction 🎉
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-baby-cream via-white to-baby-blue/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block text-baby-blue hover:text-baby-blue/70 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-neutral-dark">
            Baby Leo Predictions
          </h1>
          <p className="text-xl text-neutral-medium">
            Everyone's predictions at a glance
          </p>
          <div className="inline-flex items-center gap-2 bg-baby-blue/20 px-6 py-3 rounded-full">
            <span className="text-2xl">👥</span>
            <span className="text-lg font-semibold text-neutral-dark">
              {predictions.length} prediction{predictions.length !== 1 ? 's' : ''} submitted
            </span>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link
            href="/predict"
            className="inline-block px-8 py-3 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Add Your Prediction 🎉
          </Link>
        </div>

        {/* Date predictions */}
        <DateResultsView predictions={formattedPredictions} dueDate={dueDate} />

        {/* Time predictions */}
        <TimeResultsView predictions={formattedPredictions} />

        {/* Weight predictions */}
        <WeightResultsView predictions={formattedPredictions} />

        {/* Height predictions */}
        <HeightResultsView predictions={formattedPredictions} />

        {/* Eye color predictions */}
        <EyeColorResultsView predictions={formattedPredictions} />

        {/* Hair color predictions */}
        <HairColorResultsView predictions={formattedPredictions} />

        {/* Footer CTA */}
        <div className="text-center py-8">
          <Link
            href="/predict"
            className="inline-block px-8 py-3 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Add Your Prediction 🎉
          </Link>
        </div>
      </div>
    </div>
  );
}
