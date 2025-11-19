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

interface Prediction {
  id: string;
  birthDate: string;
  birthTime: string;
  weight: number;
  height: number;
  eyeColor: string;
  hairColor: string;
  connectionTypes: string[];
  submittedAt: string;
  user: {
    name: string;
    email: string;
  };
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
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [submissionsLocked, setSubmissionsLocked] = useState(false);
  const [isTogglingLock, setIsTogglingLock] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState<Prediction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        setError(data.message || t('accessDeniedError'));
        localStorage.removeItem('adminEmail');
      }
    } catch (err) {
      setError(t('failedToVerifyAccess'));
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
        setPredictions(predictions);
        setStats({
          totalPredictions: predictions.length,
          predictors: predictions.map((p: any) => ({
            name: p.user?.name || t('unknownUser'),
            email: p.user?.email || t('noEmail'),
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
        alert(t('allDataCleared'));
      } else {
        alert(t('failedToClearData') + data.error);
      }
    } catch (err) {
      console.error('Failed to clear data:', err);
      alert(t('errorWhileClearing'));
    } finally {
      setIsClearingData(false);
    }
  };

  const handleEditPrediction = (prediction: Prediction) => {
    setEditingPrediction(prediction);
    setShowEditModal(true);
  };

  const handleSavePrediction = async () => {
    if (!editingPrediction) return;

    setIsSaving(true);
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      const response = await fetch(`/api/admin/predictions/${editingPrediction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail,
          updates: {
            birthDate: editingPrediction.birthDate,
            birthTime: editingPrediction.birthTime,
            weight: editingPrediction.weight,
            height: editingPrediction.height,
            eyeColor: editingPrediction.eyeColor,
            hairColor: editingPrediction.hairColor,
            connectionTypes: editingPrediction.connectionTypes,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchStats();
        setShowEditModal(false);
        setEditingPrediction(null);
        alert('Prediction updated successfully!');
      } else {
        alert('Failed to update prediction: ' + data.error);
      }
    } catch (err) {
      console.error('Failed to update prediction:', err);
      alert('Error while updating prediction');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePrediction = async (predictionId: string) => {
    if (!confirm('Are you sure you want to delete this prediction? This will also delete the user and all related data. This action cannot be undone.')) {
      return;
    }

    setDeletingId(predictionId);
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      const response = await fetch(`/api/admin/predictions/${predictionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchStats();
        alert('Prediction and all related data deleted successfully!');
      } else {
        alert('Failed to delete prediction: ' + data.error);
      }
    } catch (err) {
      console.error('Failed to delete prediction:', err);
      alert('Error while deleting prediction');
    } finally {
      setDeletingId(null);
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-baby-blue/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-2">
              {t('adminAccessTitle')}
            </h1>
            <p className="text-neutral-medium">
              {t('adminAccessDescription')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-dark mb-2">
                {t('emailAddressLabel')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
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
              {isChecking ? t('checkingAccess') : t('verifyAccess')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-baby-blue hover:underline"
            >
              {t('backToHomeLink')}
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
                {t('dashboardTitle')}
              </h1>
              <p className="text-neutral-medium">
                {t('welcomeUser', { name: adminUser?.name || adminUser?.email || '' })}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-neutral-light text-neutral-dark rounded-xl hover:bg-neutral-medium/20 transition-colors text-sm font-semibold"
            >
              {t('logoutButton')}
            </button>
          </div>
        </div>

        {/* Submission Lock Control */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-neutral-dark mb-1">
                {t('submissionControlTitle')}
              </h2>
              <p className="text-neutral-medium text-sm">
                {submissionsLocked
                  ? t('submissionsLockedText')
                  : t('submissionsOpenText')}
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
              {isTogglingLock ? t('updatingStatus') : submissionsLocked ? t('unlockSubmissionsButton') : t('lockSubmissionsButton')}
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <div className="mb-4">
            <h2 className="text-xl font-heading font-bold text-neutral-dark mb-1">
              📱 {t('shareViaQRCode')}
            </h2>
            <p className="text-neutral-medium text-sm">
              {t('shareDescription')}
            </p>
          </div>
          <QRCodeGenerator url={process.env.NEXT_PUBLIC_SITE_URL || 'https://babyleo.vercel.app'} />
        </div>

        {/* Clear All Data Control */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-red-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-neutral-dark mb-1">
                🗑️ {t('clearAllData')}
              </h2>
              <p className="text-neutral-medium text-sm">
                {t('clearAllDataDescription')}
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-6 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-200"
            >
              🗑️ {t('clearAllData')}
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
                  {t('areYouSure')}
                </h2>
                <p className="text-neutral-medium">
                  {t('deleteAllPredictions')}
                </p>
                <p className="text-red-600 font-semibold mt-4">
                  {t('cannotBeUndone')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  disabled={isClearingData}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold bg-neutral-light text-neutral-dark hover:bg-neutral-medium/20 transition-all duration-200"
                >
                  {t('cancelButton')}
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
                  {isClearingData ? t('clearing') : t('confirmDeleteButton')}
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
              {t('participants')}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-accent-peach/20">
            <div className="text-4xl font-bold text-accent-peach mb-2">
              0
            </div>
            <div className="text-neutral-medium font-semibold">
              {t('winnersNotCalculatedText')}
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
                {t('viewAllPredictionsCard')}
              </h2>
              <p className="text-white drop-shadow">
                {t('seeEveryonePredictionsText')}
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
                {t('enterActualResultsCard')}
              </h2>
              <p className="text-white drop-shadow">
                {t('recordRealBirthDetailsText')}
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
                {t('viewWinnersCard')}
              </h2>
              <p className="text-white drop-shadow">
                {t('seeLeaderboardText')}
              </p>
            </div>
          </button>
        </div>

        {/* Participants List */}
        {predictions && predictions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-baby-blue/20">
            <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-4">
              {t('participantsListTitle', { count: predictions.length })}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-light">
                    <th className="text-left py-3 px-4 text-neutral-medium font-semibold">
                      {t('nameColumn')}
                    </th>
                    <th className="text-left py-3 px-4 text-neutral-medium font-semibold">
                      {t('emailColumn')}
                    </th>
                    <th className="text-right py-3 px-4 text-neutral-medium font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((prediction) => (
                    <tr
                      key={prediction.id}
                      className="border-b border-neutral-light hover:bg-baby-cream/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-neutral-dark">
                        {prediction.user.name}
                      </td>
                      <td className="py-3 px-4 text-neutral-medium">
                        {prediction.user.email}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditPrediction(prediction)}
                            className="px-3 py-1 bg-baby-blue text-white rounded-lg hover:bg-baby-blue/80 transition-colors text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePrediction(prediction.id)}
                            disabled={deletingId === prediction.id}
                            className={`px-3 py-1 rounded-lg transition-colors text-sm font-semibold ${
                              deletingId === prediction.id
                                ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {deletingId === prediction.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingPrediction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full my-8">
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
                  Edit Prediction
                </h2>
                <p className="text-neutral-medium">
                  Editing prediction for {editingPrediction.user.name} ({editingPrediction.user.email})
                </p>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={new Date(editingPrediction.birthDate).toISOString().split('T')[0]}
                    onChange={(e) => setEditingPrediction({
                      ...editingPrediction,
                      birthDate: new Date(e.target.value).toISOString(),
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none"
                  />
                </div>

                {/* Birth Time */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Birth Time (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={editingPrediction.birthTime}
                    onChange={(e) => setEditingPrediction({
                      ...editingPrediction,
                      birthTime: e.target.value,
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPrediction.weight}
                    onChange={(e) => setEditingPrediction({
                      ...editingPrediction,
                      weight: parseFloat(e.target.value),
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPrediction.height}
                    onChange={(e) => setEditingPrediction({
                      ...editingPrediction,
                      height: parseFloat(e.target.value),
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none"
                  />
                </div>

                {/* Eye Color */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Eye Color
                  </label>
                  <input
                    type="text"
                    value={editingPrediction.eyeColor}
                    onChange={(e) => setEditingPrediction({
                      ...editingPrediction,
                      eyeColor: e.target.value,
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none"
                  />
                </div>

                {/* Hair Color */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Hair Color
                  </label>
                  <input
                    type="text"
                    value={editingPrediction.hairColor}
                    onChange={(e) => setEditingPrediction({
                      ...editingPrediction,
                      hairColor: e.target.value,
                    })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-neutral-light focus:border-baby-blue focus:outline-none"
                  />
                </div>

                {/* Connection Types */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-1">
                    Connection Types
                  </label>
                  <div className="space-y-2">
                    {['family', 'friends'].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingPrediction.connectionTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingPrediction({
                                ...editingPrediction,
                                connectionTypes: [...editingPrediction.connectionTypes, type],
                              });
                            } else {
                              setEditingPrediction({
                                ...editingPrediction,
                                connectionTypes: editingPrediction.connectionTypes.filter(t => t !== type),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded border-2 border-neutral-light focus:ring-baby-blue"
                        />
                        <span className="text-neutral-dark capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPrediction(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold bg-neutral-light text-neutral-dark hover:bg-neutral-medium/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrediction}
                  disabled={isSaving}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isSaving
                      ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                      : 'bg-baby-blue text-white hover:bg-baby-blue/80 hover:scale-105'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
