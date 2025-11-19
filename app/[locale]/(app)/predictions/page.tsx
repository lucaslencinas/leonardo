'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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
  connectionTypes: string[];
  submittedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function PredictionsPage() {
  const t = useTranslations('predictions');
  const tCommon = useTranslations('common');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'family' | 'friends'>('all');

  const dueDate = new Date('2026-02-05T12:00:00');

  useEffect(() => {
    // Check if user has submitted a prediction or is an admin
    const submittedEmail = localStorage.getItem('predictionSubmitted');
    const adminEmail = localStorage.getItem('adminEmail');

    async function fetchPredictions() {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t('failedToFetch'));
        }

        const allPredictions = data.predictions || [];

        // Admins can always view predictions
        if (adminEmail) {
          setHasSubmitted(true);
        }
        // Check if this user has submitted a prediction
        else if (submittedEmail) {
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
        setError(err instanceof Error ? err.message : t('failedToLoad'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  // Filter predictions based on connection type
  const filteredPredictions = predictions.filter((p) => {
    if (connectionFilter === 'all') return true;
    return p.connectionTypes.includes(connectionFilter);
  });

  // Convert API predictions to the format expected by result components
  const formattedPredictions = filteredPredictions.map((p) => {
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
              {t('loadingPredictions')}
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
              {t('somethingWentWrong')}
            </h2>
            <p className="text-neutral-medium mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-baby-blue text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
            >
              {t('goHome')}
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
              {t('gateTitle')}
            </h2>
            <p className="text-lg text-neutral-medium mb-2 max-w-2xl mx-auto">
              {t('gateMessage')}
            </p>
            <p className="text-neutral-medium mb-8">
              {t('gateCount', { count: predictions.length })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/predict"
                className="px-8 py-4 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg"
              >
                {t('makePrediction')} 🎉
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-white border-2 border-neutral-light text-neutral-dark font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-lg"
              >
                {t('backToHomeLink')}
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
              {t('noPredictionsYetTitle')}
            </h2>
            <p className="text-neutral-medium mb-6">
              {t('beTheFirst')}
            </p>
            <Link
              href="/predict"
              className="inline-block px-8 py-3 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              {t('makePrediction')}
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
            {tCommon('backToHome')}
          </Link>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-neutral-dark">
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-neutral-medium">
            {t('pageSubtitle')}
          </p>
          <div className="inline-flex items-center gap-2 bg-baby-blue/20 px-6 py-3 rounded-full">
            <span className="text-2xl">👥</span>
            <span className="text-lg font-semibold text-neutral-dark">
              {t('predictionsSubmitted', { count: predictions.length })}
            </span>
          </div>
        </div>

        {/* Connection Type Filter */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold text-neutral-dark">{t('filterByConnection')}</h3>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => setConnectionFilter('all')}
              className={`px-6 py-3 font-semibold rounded-2xl transition-all duration-200 ${
                connectionFilter === 'all'
                  ? 'bg-baby-blue text-white shadow-lg'
                  : 'bg-white border-2 border-neutral-light text-neutral-dark hover:border-baby-blue'
              }`}
            >
              {t('allPredictions')} ({predictions.length})
            </button>
            <button
              onClick={() => setConnectionFilter('family')}
              className={`px-6 py-3 font-semibold rounded-2xl transition-all duration-200 ${
                connectionFilter === 'family'
                  ? 'bg-baby-blue text-white shadow-lg'
                  : 'bg-white border-2 border-neutral-light text-neutral-dark hover:border-baby-blue'
              }`}
            >
              {t('familyOnly')} ({predictions.filter(p => p.connectionTypes.includes('family')).length})
            </button>
            <button
              onClick={() => setConnectionFilter('friends')}
              className={`px-6 py-3 font-semibold rounded-2xl transition-all duration-200 ${
                connectionFilter === 'friends'
                  ? 'bg-baby-blue text-white shadow-lg'
                  : 'bg-white border-2 border-neutral-light text-neutral-dark hover:border-baby-blue'
              }`}
            >
              {t('friendsOnly')} ({predictions.filter(p => p.connectionTypes.includes('friends')).length})
            </button>
          </div>
          {formattedPredictions.length === 0 && connectionFilter !== 'all' && (
            <p className="text-neutral-medium text-sm mt-2">
              {t('noMatchingPredictions')}
            </p>
          )}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link
            href="/predict"
            className="inline-block px-8 py-3 bg-gradient-to-r from-baby-blue to-baby-mint text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {t('addYourPrediction')}
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
            {t('addYourPrediction')}
          </Link>
        </div>
      </div>
    </div>
  );
}
