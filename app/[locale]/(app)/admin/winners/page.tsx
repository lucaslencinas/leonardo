'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { getMedal, getScoreColor, getScoreLabel, type ScoredPrediction } from '@/lib/winner-calculation';

interface ActualResults {
  birthDate: string;
  birthTime: string;
  weight: number;
  height: number;
  eyeColor: string;
  hairColor: string;
}

export default function AdminWinnersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [winners, setWinners] = useState<ScoredPrediction[]>([]);
  const [actualResults, setActualResults] = useState<ActualResults | null>(null);
  const [error, setError] = useState('');

  // Check admin access
  useEffect(() => {
    const checkAdmin = async () => {
      const storedEmail = localStorage.getItem('adminEmail');
      if (!storedEmail) {
        router.push('/admin');
        return;
      }

      try {
        const response = await fetch('/api/admin/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: storedEmail }),
        });

        const data = await response.json();
        if (response.ok && data.isAdmin) {
          setIsAuthenticated(true);
          await fetchWinners();
        } else {
          router.push('/admin');
        }
      } catch (err) {
        console.error('Admin check failed:', err);
        router.push('/admin');
      } finally {
        setIsChecking(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchWinners = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/winners');
      const data = await response.json();

      if (response.ok) {
        setWinners(data.winners || []);
        setActualResults(data.actualResults);
      } else {
        setError(data.error || 'Failed to load winners');
      }
    } catch (err) {
      console.error('Failed to fetch winners:', err);
      setError('An error occurred while loading winners');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-neutral-medium">
          {isChecking ? 'Verifying access...' : 'Calculating winners...'}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-baby-cream via-baby-blue/10 to-baby-mint/10 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <button
            onClick={() => router.push('/admin')}
            className="text-baby-blue hover:underline mb-4 text-sm font-semibold"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-2">
            🏆 Winners & Leaderboard
          </h1>
          <p className="text-neutral-medium">
            {actualResults ? 'Results calculated based on actual birth details' : 'No results entered yet'}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
              {error}
            </h2>
            <p className="text-neutral-medium mb-6">
              Please enter the actual birth results first
            </p>
            <button
              onClick={() => router.push('/admin/results')}
              className="px-6 py-3 bg-baby-blue text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Enter Results
            </button>
          </div>
        )}

        {/* Actual Results Summary */}
        {actualResults && (
          <div className="bg-gradient-to-r from-baby-blue to-baby-mint text-white rounded-3xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6 text-center">
              📋 Actual Birth Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="text-sm opacity-90 mb-1">Date</div>
                <div className="text-lg font-bold">
                  {new Date(actualResults.birthDate).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="text-sm opacity-90 mb-1">Time</div>
                <div className="text-lg font-bold">{actualResults.birthTime}</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="text-sm opacity-90 mb-1">Weight</div>
                <div className="text-lg font-bold">{actualResults.weight} kg</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="text-sm opacity-90 mb-1">Height</div>
                <div className="text-lg font-bold">{actualResults.height} cm</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="text-sm opacity-90 mb-1">Eye Color</div>
                <div className="text-lg font-bold capitalize">{actualResults.eyeColor}</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4">
                <div className="text-sm opacity-90 mb-1">Hair Color</div>
                <div className="text-lg font-bold capitalize">{actualResults.hairColor}</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {winners.length > 0 && (
          <div className="space-y-4">
            {winners.map((winner, index) => (
              <div
                key={winner.id}
                className={`bg-white rounded-3xl shadow-lg p-6 border-2 transition-all duration-200 hover:shadow-xl ${
                  index === 0
                    ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-white'
                    : index === 1
                    ? 'border-gray-300 bg-gradient-to-r from-gray-50 to-white'
                    : index === 2
                    ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-white'
                    : 'border-baby-blue/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Rank & Medal */}
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{getMedal(winner.rank!)}</div>
                    <div>
                      <div className="text-3xl font-heading font-bold text-neutral-dark">
                        #{winner.rank}
                      </div>
                      <div className={`text-sm font-semibold ${getScoreColor(winner.score)}`}>
                        {getScoreLabel(winner.score)}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="text-2xl font-heading font-bold text-neutral-dark mb-1">
                      {winner.user.name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-neutral-medium mb-3">
                      {winner.user.email}
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                      <div className="bg-baby-cream/30 rounded-lg p-2">
                        <div className="text-neutral-medium">Date</div>
                        <div className="font-bold">{winner.breakdown.dateScore}pt</div>
                      </div>
                      <div className="bg-baby-cream/30 rounded-lg p-2">
                        <div className="text-neutral-medium">Time</div>
                        <div className="font-bold">{winner.breakdown.timeScore}pt</div>
                      </div>
                      <div className="bg-baby-cream/30 rounded-lg p-2">
                        <div className="text-neutral-medium">Weight</div>
                        <div className="font-bold">{winner.breakdown.weightScore}pt</div>
                      </div>
                      <div className="bg-baby-cream/30 rounded-lg p-2">
                        <div className="text-neutral-medium">Height</div>
                        <div className="font-bold">{winner.breakdown.heightScore}pt</div>
                      </div>
                      <div className="bg-baby-cream/30 rounded-lg p-2">
                        <div className="text-neutral-medium">Eyes</div>
                        <div className="font-bold">
                          {winner.breakdown.eyeColorScore === 0 ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="bg-baby-cream/30 rounded-lg p-2">
                        <div className="text-neutral-medium">Hair</div>
                        <div className="font-bold">
                          {winner.breakdown.hairColorScore === 0 ? '✓' : '✗'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Score */}
                  <div className="text-center md:text-right">
                    <div className="text-sm text-neutral-medium mb-1">Total Score</div>
                    <div className={`text-4xl font-heading font-bold ${getScoreColor(winner.score)}`}>
                      {winner.score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {winners.length === 0 && !error && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
              No Predictions Yet
            </h2>
            <p className="text-neutral-medium">
              Waiting for family and friends to submit their predictions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
