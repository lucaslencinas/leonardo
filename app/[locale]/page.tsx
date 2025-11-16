'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Countdown } from '@/components/home/Countdown';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const t = useTranslations('home');
  const [participantCount, setParticipantCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();
        if (response.ok && data.predictions) {
          // Count unique participants
          const uniqueParticipants = new Set(data.predictions.map((p: any) => p.userEmail));
          setParticipantCount(uniqueParticipants.size);
        }
      } catch (err) {
        console.error('Failed to fetch participants:', err);
      }
    };
    fetchParticipants();
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        {/* Header with baby theme */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-neutral-dark tracking-tight">
            <span className="baby-gradient bg-clip-text text-transparent">
              Leonardo
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-heading text-baby-blue">
            {t('welcome')}
          </p>
          <p className="text-lg md:text-xl text-neutral-medium max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Info card about the game */}
        <div className="bg-gradient-to-br from-baby-blue/10 to-baby-mint/10 rounded-3xl p-6 border-2 border-baby-blue/20 max-w-2xl mx-auto">
          <h2 className="text-xl font-heading font-bold text-neutral-dark mb-3">
            🎯 What is this?
          </h2>
          <p className="text-neutral-medium">
            Family and friends are invited to predict Leonardo's birth details!
            Guess the date, time, weight, height, eye color, and hair color.
            The closest predictions win! 🏆
          </p>
          {participantCount !== null && participantCount > 0 && (
            <div className="mt-4 pt-4 border-t border-baby-blue/20">
              <p className="text-2xl font-bold text-baby-blue">
                {participantCount} {participantCount === 1 ? 'person has' : 'people have'} already predicted!
              </p>
              <p className="text-sm text-neutral-medium mt-1">
                Join the fun and make your prediction
              </p>
            </div>
          )}
        </div>

        {/* Countdown */}
        <Countdown />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center pt-8 w-full sm:w-auto">
          <Link
            href="/predict"
            className="w-full sm:w-auto px-8 py-4 bg-baby-blue text-neutral-dark font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg text-center"
          >
            {t('getStarted')}
          </Link>
          <Link
            href="/predictions"
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-baby-mint text-neutral-dark font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg text-center"
          >
            {t('viewPredictions')}
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-8 text-6xl opacity-50 pt-12">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>👶</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🍼</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🎉</span>
        </div>
      </div>
    </div>
  );
}
