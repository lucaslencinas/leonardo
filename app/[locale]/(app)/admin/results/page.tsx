'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { DateSlider } from '@/components/forms/DateSlider';
import { TimeSlider } from '@/components/forms/TimeSlider';
import { WeightSlider } from '@/components/forms/WeightSlider';
import { HeightSlider } from '@/components/forms/HeightSlider';
import { EyeColorPicker } from '@/components/forms/EyeColorPicker';
import { HairColorPicker } from '@/components/forms/HairColorPicker';
import { type EyeColorId, type HairColorId } from '@/lib/constants/colors';

interface ActualResultsData {
  birthDate: Date;
  birthTime: { hours: number; minutes: number };
  weight: number;
  height: number;
  eyeColor: EyeColorId;
  hairColor: HairColorId;
}

export default function AdminResultsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [existingResults, setExistingResults] = useState<ActualResultsData | null>(null);

  // Due date from settings (January 5, 2026)
  const dueDate = new Date(2026, 0, 5); // Jan 5, 2026 (month is 0-indexed)

  const [formData, setFormData] = useState<ActualResultsData>({
    birthDate: new Date(2026, 0, 5), // Jan 5, 2026
    birthTime: { hours: 12, minutes: 0 },
    weight: 3.5,
    height: 50,
    eyeColor: 'brown' as EyeColorId,
    hairColor: 'black' as HairColorId,
  });

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
          await fetchExistingResults();
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

  const fetchExistingResults = async () => {
    try {
      const response = await fetch('/api/admin/actual-results');
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          const results = data.results;
          const [hours, minutes] = results.birthTime.split(':').map(Number);
          setFormData({
            birthDate: new Date(results.birthDate),
            birthTime: { hours, minutes },
            weight: results.weight,
            height: results.height,
            eyeColor: results.eyeColor as EyeColorId,
            hairColor: results.hairColor as HairColorId,
          });
          setExistingResults(formData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch existing results:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);

    try {
      const adminEmail = localStorage.getItem('adminEmail');
      const response = await fetch('/api/admin/actual-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          enteredBy: adminEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveStatus({
          type: 'success',
          message: existingResults ? t('admin.resultsUpdatedSuccessfully') : t('admin.resultsSavedSuccessfully'),
        });
        setExistingResults(formData);

        // Redirect to winners page after 2 seconds
        setTimeout(() => {
          router.push('/admin/winners');
        }, 2000);
      } else {
        setSaveStatus({
          type: 'error',
          message: data.error || t('admin.failedToSaveResults'),
        });
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus({
        type: 'error',
        message: t('admin.errorWhileSaving'),
      });
    } finally {
      setSaving(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-neutral-medium">{t('admin.verifyingAccess')}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-baby-cream via-baby-blue/10 to-baby-mint/10 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-baby-blue/20">
          <button
            onClick={() => router.push('/admin')}
            className="text-baby-blue hover:underline mb-4 text-sm font-semibold"
          >
            {t('admin.backToDashboard')}
          </button>
          <h1 className="text-3xl font-heading font-bold text-neutral-dark mb-2">
            {t('admin.enterActualBirthResults')}
          </h1>
          <p className="text-neutral-medium">
            {existingResults ? t('admin.updateActualBirthDetails') : t('admin.enterRealBirthDetails')}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-baby-blue/20 space-y-8">
          {/* Birth Date */}
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4">
              📅 Birth Date
            </h3>
            <DateSlider
              value={formData.birthDate}
              onChange={(date) => setFormData({ ...formData, birthDate: date })}
              dueDate={dueDate}
              label={t('admin.actualBirthDate')}
            />
          </div>

          {/* Birth Time */}
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4">
              ⏰ Birth Time
            </h3>
            <TimeSlider
              value={formData.birthTime}
              onChange={(time) => setFormData({ ...formData, birthTime: time })}
              label={t('admin.actualBirthTime')}
            />
          </div>

          {/* Weight */}
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4">
              ⚖️ Weight
            </h3>
            <WeightSlider
              value={formData.weight}
              onChange={(weight) => setFormData({ ...formData, weight })}
              label={t('admin.actualWeight')}
            />
          </div>

          {/* Height */}
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4">
              📏 Height
            </h3>
            <HeightSlider
              value={formData.height}
              onChange={(height) => setFormData({ ...formData, height })}
              label={t('admin.actualHeight')}
            />
          </div>

          {/* Eye Color */}
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4">
              👁️ Eye Color
            </h3>
            <EyeColorPicker
              value={formData.eyeColor}
              onChange={(eyeColor: EyeColorId) => setFormData({ ...formData, eyeColor })}
              label={t('admin.actualEyeColor')}
            />
          </div>

          {/* Hair Color */}
          <div>
            <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4">
              💇 Hair Color
            </h3>
            <HairColorPicker
              value={formData.hairColor}
              onChange={(hairColor: HairColorId) => setFormData({ ...formData, hairColor })}
              label={t('admin.actualHairColor')}
            />
          </div>

          {/* Status Messages */}
          {saveStatus && (
            <div
              className={`p-4 rounded-xl border-2 ${
                saveStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {saveStatus.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-light text-neutral-dark font-semibold rounded-2xl hover:bg-neutral-medium/20 transition-all duration-200 text-center"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saveStatus?.type === 'success'}
              className={`w-full sm:w-auto px-8 py-3 font-bold rounded-2xl shadow-lg transition-all duration-200 ${
                isSaving || saveStatus?.type === 'success'
                  ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                  : 'bg-gradient-to-r from-baby-blue to-baby-mint text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {isSaving ? t('admin.saving') : saveStatus?.type === 'success' ? t('admin.savedCheckmark') : existingResults ? t('admin.updateResults') : t('admin.saveResults')}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-baby-cream/30 rounded-3xl p-6 border-2 border-baby-cream">
          <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4 text-center">
            {t('admin.summary')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-neutral-medium">{t('admin.dateLabel')}</span>
              <div className="font-semibold">{formData.birthDate.toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-neutral-medium">{t('admin.timeLabel')}</span>
              <div className="font-semibold">
                {String(formData.birthTime.hours).padStart(2, '0')}:
                {String(formData.birthTime.minutes).padStart(2, '0')}
              </div>
            </div>
            <div>
              <span className="text-neutral-medium">{t('admin.weight')}</span>
              <div className="font-semibold">{formData.weight} kg</div>
            </div>
            <div>
              <span className="text-neutral-medium">{t('admin.height')}</span>
              <div className="font-semibold">{formData.height} cm</div>
            </div>
            <div>
              <span className="text-neutral-medium">{t('admin.eyeColor')}</span>
              <div className="font-semibold capitalize">{formData.eyeColor}</div>
            </div>
            <div>
              <span className="text-neutral-medium">{t('admin.hairColor')}</span>
              <div className="font-semibold capitalize">{formData.hairColor}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
