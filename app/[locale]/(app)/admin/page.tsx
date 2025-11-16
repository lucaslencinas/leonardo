'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { QRCodeGenerator } from '@/components/admin/QRCodeGenerator';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export default function AdminPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<{
    totalPredictions: number;
    predictors: Array<{ name: string; email: string }>;
  } | null>(null);
  const [submissionsLocked, setSubmissionsLocked] = useState(false);
  const [isTogglingLock, setIsTogglingLock] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Check if already authenticated (from localStorage)
  useEffect(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    if (storedEmail) {
      verifyAdmin(storedEmail);
    }
  }, []);

  // Fetch stats and settings after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const verifyAdmin = async (emailToCheck: string) => {
    setIsChecking(true);
    setError('');

    try {
      const response = await fetch('/api/admin/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();

      if (response.ok && data.isAdmin) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        localStorage.setItem('adminEmail', emailToCheck);
      } else {
        setError(data.message || 'Access denied');
        localStorage.removeItem('adminEmail');
      }
    } catch (err) {
      setError('Failed to verify admin access');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAdmin(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setStats(null);
    localStorage.removeItem('adminEmail');
    setEmail('');
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/predictions');
      const data = await response.json();

      if (response.ok) {
        const predictions = data.predictions || [];
        setStats({
          totalPredictions: predictions.length,
          predictors: predictions.map((p: any) => ({
            name: p.user?.name || 'Unknown',
            email: p.user?.email || 'No email',
          })),
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (response.ok && data.settings) {
        setSubmissionsLocked(data.settings.submissionsLocked);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const toggleSubmissionLock = async () => {
    setIsTogglingLock(true);
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionsLocked: !submissionsLocked,
          adminEmail,
        }),
      });

      const data = await response.json();

      if (response.ok && data.settings) {
        setSubmissionsLocked(data.settings.submissionsLocked);
      }
    } catch (err) {
      console.error('Failed to toggle lock:', err);
    } finally {
      setIsTogglingLock(false);
    }
  };

  const handleClearAllData = async () => {
    setIsClearingData(true);
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      const response = await fetch('/api/admin/clear-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh stats after clearing
        await fetchStats();
        setShowClearConfirm(false);
        alert('All data cleared successfully!');
      } else {
        alert('Failed to clear data: ' + data.error);
      }
    } catch (err) {
      console.error('Failed to clear data:', err);
      alert('An error occurred while clearing data');
    } finally {
      setIsClearingData(false);
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-baby-blue/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-2">
              🔐 Admin Access
            </h1>
            <p className="text-neutral-medium">
              Enter your admin email to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isChecking}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                isChecking
                  ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                  : 'bg-baby-blue text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {isChecking ? 'Checking...' : 'Verify Admin Access'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-baby-blue hover:underline"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-baby-cream via-baby-blue/10 to-baby-mint/10 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-1">
                👑 Admin Dashboard
              </h1>
              <p className="text-neutral-medium">
                Welcome, {adminUser?.name || adminUser?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-neutral-light text-neutral-dark rounded-xl hover:bg-neutral-medium/20 transition-colors text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Submission Lock Control */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-neutral-dark mb-1">
                🔒 Submission Control
              </h2>
              <p className="text-neutral-medium text-sm">
                {submissionsLocked
                  ? 'Submissions are currently locked. No new predictions can be submitted.'
                  : 'Submissions are open. Users can submit predictions.'}
              </p>
            </div>
            <button
              onClick={toggleSubmissionLock}
              disabled={isTogglingLock}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isTogglingLock
                  ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                  : submissionsLocked
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                  : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
              }`}
            >
              {isTogglingLock ? 'Updating...' : submissionsLocked ? '🔓 Unlock Submissions' : '🔒 Lock Submissions'}
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <div className="mb-4">
            <h2 className="text-xl font-heading font-bold text-neutral-dark mb-1">
              📱 Share via QR Code
            </h2>
            <p className="text-neutral-medium text-sm">
              Generate a QR code for your production website. Perfect for sharing in person!
            </p>
          </div>
          <QRCodeGenerator url={process.env.NEXT_PUBLIC_SITE_URL || 'https://your-site.vercel.app'} />
        </div>

        {/* Clear All Data Control */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-red-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-neutral-dark mb-1">
                🗑️ Clear All Data
              </h2>
              <p className="text-neutral-medium text-sm">
                Permanently delete all predictions, results, and user data. This action cannot be undone!
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-6 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-200"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
                  Are you absolutely sure?
                </h2>
                <p className="text-neutral-medium">
                  This will permanently delete:
                </p>
                <ul className="text-left mt-4 space-y-2 text-neutral-dark">
                  <li>• All {stats?.totalPredictions || 0} predictions</li>
                  <li>• All actual results</li>
                  <li>• All user data (except admin)</li>
                </ul>
                <p className="text-red-600 font-semibold mt-4">
                  This action cannot be undone!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  disabled={isClearingData}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold bg-neutral-light text-neutral-dark hover:bg-neutral-medium/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllData}
                  disabled={isClearingData}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isClearingData
                      ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105'
                  }`}
                >
                  {isClearingData ? 'Clearing...' : 'Yes, Clear All'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-baby-mint/20">
            <div className="text-4xl font-bold text-baby-mint mb-2">
              {stats?.predictors.length || 0}
            </div>
            <div className="text-neutral-medium font-semibold">
              Participants
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-accent-peach/20">
            <div className="text-4xl font-bold text-accent-peach mb-2">
              0
            </div>
            <div className="text-neutral-medium font-semibold">
              Winners (Not Calculated)
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/predictions')}
            className="relative bg-gradient-to-r from-baby-mint to-baby-cream rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/80 to-yellow-600/80"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-heading font-bold mb-2 text-white drop-shadow-md">
                View All Predictions
              </h2>
              <p className="text-white drop-shadow">
                See everyone's predictions and statistics
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/results')}
            className="relative bg-gradient-to-r from-baby-blue to-baby-mint rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-teal-600/80"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-heading font-bold mb-2 text-white drop-shadow-md">
                Enter Actual Results
              </h2>
              <p className="text-white drop-shadow">
                Record the real birth details to calculate winners
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/winners')}
            className="relative bg-gradient-to-r from-accent-peach to-accent-coral rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-red-600/80"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-2xl font-heading font-bold mb-2 text-white drop-shadow-md">
                View Winners
              </h2>
              <p className="text-white drop-shadow">
                See the leaderboard and announce winners
              </p>
            </div>
          </button>
        </div>

        {/* Participants List */}
        {stats && stats.predictors.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-baby-blue/20">
            <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">
              👥 Participants ({stats.predictors.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-light">
                    <th className="text-left py-3 px-4 text-neutral-medium font-semibold">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-medium font-semibold">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.predictors.map((predictor, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-light hover:bg-baby-cream/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-neutral-dark">
                        {predictor.name}
                      </td>
                      <td className="py-3 px-4 text-neutral-medium">
                        {predictor.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
