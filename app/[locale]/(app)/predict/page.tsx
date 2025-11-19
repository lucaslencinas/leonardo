'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { DateSlider } from '@/components/forms/DateSlider';
import { TimeSlider } from '@/components/forms/TimeSlider';
import { WeightSlider } from '@/components/forms/WeightSlider';
import { HeightSlider } from '@/components/forms/HeightSlider';
import { EyeColorPicker } from '@/components/forms/EyeColorPicker';
import { HairColorPicker } from '@/components/forms/HairColorPicker';
import { EYE_COLORS, HAIR_COLORS, type EyeColorId, type HairColorId } from '@/lib/constants/colors';

interface FormData {
  userName: string;
  userEmail: string;
  connectionTypes: ('family' | 'friends')[];
  birthDate: Date;
  birthTime: { hours: number; minutes: number };
  weight: number;
  height: number;
  eyeColor: EyeColorId;
  hairColor: HairColorId;
}

export default function PredictPage() {
  const t = useTranslations('predict');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  // Due date: February 5, 2026 at 12:00 PM
  const dueDate = new Date('2026-02-05T12:00:00');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    userEmail: '',
    connectionTypes: [],
    birthDate: dueDate,
    birthTime: { hours: 12, minutes: 0 },
    weight: 3.5, // kg
    height: 50, // cm
    eyeColor: EYE_COLORS[3].id, // light-brown (common for babies)
    hairColor: HAIR_COLORS[4].id, // brown
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    verificationEmailSent?: boolean;
  }>({ type: null, message: '' });
  const [submissionsLocked, setSubmissionsLocked] = useState(false);
  const [isCheckingLock, setIsCheckingLock] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);

  // Check if submissions are locked AND fetch existing prediction
  useEffect(() => {
    const checkLockStatus = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        if (response.ok && data.settings) {
          setSubmissionsLocked(data.settings.submissionsLocked);
        }
      } catch (err) {
        console.error('Failed to check lock status:', err);
      } finally {
        setIsCheckingLock(false);
      }
    };

    const loadExistingPrediction = async () => {
      try {
        // Check localStorage for user's email
        const savedEmail = localStorage.getItem('predictionSubmitted');

        if (savedEmail) {
          const response = await fetch(`/api/predictions/by-email?email=${encodeURIComponent(savedEmail)}`);
          const data = await response.json();

          if (response.ok && data.prediction) {
            const pred = data.prediction;

            // Parse birth time from "HH:MM" format
            const [hours, minutes] = pred.birthTime.split(':').map(Number);

            // Pre-fill form with existing prediction
            setFormData({
              userName: pred.userName || '',
              userEmail: pred.userEmail || '',
              connectionTypes: pred.connectionTypes || [],
              birthDate: new Date(pred.birthDate),
              birthTime: { hours, minutes },
              weight: pred.weight,
              height: pred.height,
              eyeColor: pred.eyeColor as EyeColorId,
              hairColor: pred.hairColor as HairColorId,
            });

            setIsEditMode(true);
          }
        }
      } catch (err) {
        console.error('Failed to load existing prediction:', err);
      } finally {
        setIsLoadingPrediction(false);
      }
    };

    checkLockStatus();
    loadExistingPrediction();
  }, []);

  const steps = [
    { id: 'user', label: t('steps.yourInfo'), icon: '👤' },
    { id: 'date', label: t('steps.birthDate'), icon: '📅' },
    { id: 'time', label: t('steps.birthTime'), icon: '⏰' },
    { id: 'weight', label: t('steps.weight'), icon: '⚖️' },
    { id: 'height', label: t('steps.height'), icon: '📏' },
    { id: 'eyes', label: t('steps.eyeColor'), icon: '👁️' },
    { id: 'hair', label: t('steps.hairColor'), icon: '💇' },
    { id: 'review', label: t('steps.review'), icon: '✓' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('failedToSubmit'));
      }

      // Save email to localStorage to track that user has submitted
      localStorage.setItem('predictionSubmitted', formData.userEmail);

      setSubmitStatus({
        type: 'success',
        message: data.message || t('successMessage'),
        verificationEmailSent: data.verificationEmailSent || false,
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting prediction:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : t('unexpectedError'),
      });

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-dark mb-3">
          {t('title')}
        </h1>
        <p className="text-lg text-neutral-medium">
          {t('subtitle')}
        </p>
      </div>

      {/* Submissions Locked Warning */}
      {submissionsLocked && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl shadow-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
            {t('submissionsClosedTitle')}
          </h2>
          <p className="text-lg text-neutral-medium mb-6">
            {t('submissionsClosedMessage')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-white border-2 border-neutral-light text-neutral-dark font-semibold rounded-2xl hover:bg-neutral-light transition-all duration-200"
            >
              {t('backToHome')}
            </Link>
            <Link
              href="/predictions"
              className="px-6 py-3 bg-baby-blue text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              {tCommon('viewPredictions')}
            </Link>
          </div>
        </div>
      )}

      {/* Show form only if submissions are open */}
      {!isCheckingLock && !submissionsLocked && (
        <>
          {/* Edit Mode Banner */}
          {isEditMode && !isLoadingPrediction && (
            <div className="bg-gradient-to-r from-baby-mint/20 to-baby-blue/20 border-2 border-baby-blue rounded-3xl shadow-md p-6 mb-8 text-center">
              <div className="text-4xl mb-2">✏️</div>
              <h3 className="text-xl font-heading font-bold text-neutral-dark mb-1">
                {t('editingYourPrediction')}
              </h3>
              <p className="text-neutral-medium">
                {t('editingDescription')}
              </p>
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => {
                // Only allow clicking on completed steps (with validation)
                const canNavigate = index < currentStep && formData.userName && formData.userEmail && formData.connectionTypes.length > 0;

                return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                    canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'
                  } ${
                    index === currentStep
                      ? 'scale-110'
                      : index < currentStep
                      ? 'opacity-60'
                      : 'opacity-30'
                  }`}
                  onClick={() => canNavigate && setCurrentStep(index)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      index <= currentStep
                        ? 'bg-baby-blue text-white shadow-md'
                        : 'bg-neutral-light text-neutral-medium'
                    }`}
                  >
                    {index < currentStep ? '✓' : step.icon}
                  </div>
                  <span className="text-xs font-medium text-neutral-dark hidden md:block">
                    {step.label}
                  </span>
                </div>
                );
              })}
            </div>
            <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
              <div
                className="h-full bg-baby-blue transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center mt-2 text-sm text-neutral-medium">
              {t('stepCounter', { current: currentStep + 1, total: steps.length })}
            </div>
          </div>

          {/* Form content */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="min-h-[500px]">
          {/* Step 0: User Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-neutral-dark mb-2">
                  {t('userInfoTitle')}
                </h2>
                <p className="text-neutral-medium">
                  {t('userInfoSubtitle')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  {t('yourName')}
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder={t('namePlaceholder')}
                  className="w-full px-4 py-3 border-2 border-neutral-light rounded-lg focus:border-baby-blue focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  {t('yourEmail')}
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-neutral-light rounded-lg focus:border-baby-blue focus:outline-none transition-colors"
                  required
                />
                <p className="mt-2 text-xs text-neutral-medium">
                  {t('emailNote')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-3">
                  {t('connectionType')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-neutral-light rounded-lg cursor-pointer hover:border-baby-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.connectionTypes.includes('family')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, connectionTypes: [...formData.connectionTypes, 'family'] });
                        } else {
                          setFormData({ ...formData, connectionTypes: formData.connectionTypes.filter(t => t !== 'family') });
                        }
                      }}
                      className="w-5 h-5 text-baby-blue border-2 border-neutral-light rounded focus:ring-2 focus:ring-baby-blue"
                    />
                    <div>
                      <div className="font-semibold text-neutral-dark">{t('family')}</div>
                      <div className="text-xs text-neutral-medium">{t('familyDescription')}</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-neutral-light rounded-lg cursor-pointer hover:border-baby-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.connectionTypes.includes('friends')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, connectionTypes: [...formData.connectionTypes, 'friends'] });
                        } else {
                          setFormData({ ...formData, connectionTypes: formData.connectionTypes.filter(t => t !== 'friends') });
                        }
                      }}
                      className="w-5 h-5 text-baby-blue border-2 border-neutral-light rounded focus:ring-2 focus:ring-baby-blue"
                    />
                    <div>
                      <div className="font-semibold text-neutral-dark">{t('friends')}</div>
                      <div className="text-xs text-neutral-medium">{t('friendsDescription')}</div>
                    </div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-neutral-medium">
                  {t('connectionTypeNote')}
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Date */}
          {currentStep === 1 && (
            <DateSlider
              value={formData.birthDate}
              onChange={(date) => setFormData({ ...formData, birthDate: date })}
              dueDate={dueDate}
              label={t('birthDate')}
            />
          )}

          {/* Step 2: Time */}
          {currentStep === 2 && (
            <TimeSlider
              value={formData.birthTime}
              onChange={(time) => setFormData({ ...formData, birthTime: time })}
              label={t('birthTime')}
            />
          )}

          {/* Step 3: Weight */}
          {currentStep === 3 && (
            <WeightSlider
              value={formData.weight}
              onChange={(weight) => setFormData({ ...formData, weight })}
              label={t('weight')}
            />
          )}

          {/* Step 4: Height */}
          {currentStep === 4 && (
            <HeightSlider
              value={formData.height}
              onChange={(height) => setFormData({ ...formData, height })}
              label={t('height')}
            />
          )}

          {/* Step 5: Eye Color */}
          {currentStep === 5 && (
            <EyeColorPicker
              value={formData.eyeColor}
              onChange={(eyeColor: EyeColorId) => setFormData({ ...formData, eyeColor })}
              label={t('eyeColor')}
            />
          )}

          {/* Step 6: Hair Color */}
          {currentStep === 6 && (
            <HairColorPicker
              value={formData.hairColor}
              onChange={(hairColor: HairColorId) => setFormData({ ...formData, hairColor })}
              label={t('hairColor')}
            />
          )}

          {/* Step 7: Review & Submit */}
          {currentStep === 7 && (
            <div className="space-y-6">
              {/* Success or ready message */}
              {submitStatus.type === 'success' ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 animate-bounce">{isEditMode ? '✅' : '🎉'}</div>
                  <h2 className="text-3xl font-heading font-bold text-neutral-dark mb-4">
                    {isEditMode ? t('predictionUpdatedTitle') : t('predictionSubmittedTitle')}
                  </h2>
                  <p className="text-lg text-neutral-medium mb-6">
                    {isEditMode
                      ? t('predictionUpdatedMessage')
                      : t('predictionSubmittedMessage')
                    }
                  </p>
                  {submitStatus.verificationEmailSent && (
                    <div className="bg-baby-mint/20 border-2 border-baby-mint rounded-2xl p-6 mb-8 max-w-lg mx-auto">
                      <div className="text-4xl mb-3">📧</div>
                      <h3 className="text-xl font-bold text-neutral-dark mb-2">Check Your Email!</h3>
                      <p className="text-neutral-medium">
                        We&apos;ve sent a verification email to <strong>{formData.userEmail}</strong>.
                        Click the link in the email to verify your address and enable cross-device access to your prediction.
                      </p>
                    </div>
                  )}
                  <Link
                    href="/predictions"
                    className="inline-block px-8 py-4 bg-baby-blue text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    {t('viewAllPredictions')}
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📋</div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-dark mb-2">
                    {t('reviewYourPredictionTitle')}
                  </h2>
                  <p className="text-neutral-medium mb-8">
                    {t('reviewInstructions')}
                  </p>
                </div>
              )}

              {/* Summary Card */}
              {submitStatus.type !== 'success' && (
                <div className="bg-baby-cream/30 rounded-3xl p-6 border-2 border-baby-cream space-y-4">
                  <h3 className="text-lg font-heading font-bold text-neutral-dark text-center">
                    {t('predictionSummary')}
                  </h3>

                  {/* Personal Info Section */}
                  <div className="bg-white rounded-2xl p-4">
                    <h4 className="text-xs font-semibold text-neutral-medium uppercase mb-2">{t('personalInfo')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-neutral-medium">{t('name')}</span>
                        <div className="text-base font-bold text-neutral-dark">{formData.userName}</div>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-medium">{t('email')}</span>
                        <div className="text-base font-bold text-neutral-dark truncate">{formData.userEmail}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-light">
                      <span className="text-xs text-neutral-medium">{t('connectionType')}</span>
                      <div className="flex gap-2 mt-1">
                        {formData.connectionTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-block px-3 py-1 bg-baby-blue/10 text-baby-blue text-sm font-semibold rounded-full"
                          >
                            {type === 'family' ? t('family') : t('friends')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Birth Details Section */}
                  <div className="bg-white rounded-2xl p-4">
                    <h4 className="text-xs font-semibold text-neutral-medium uppercase mb-2">{t('birthDetails')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-neutral-medium">{t('dateLabel')}</span>
                        <div className="text-base font-bold text-neutral-dark">{formData.birthDate.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-medium">{t('timeLabel')}</span>
                        <div className="text-base font-bold text-neutral-dark">
                          {String(formData.birthTime.hours).padStart(2, '0')}:{String(formData.birthTime.minutes).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Physical Details Section */}
                  <div className="bg-white rounded-2xl p-4">
                    <h4 className="text-xs font-semibold text-neutral-medium uppercase mb-2">{t('physicalDetails')}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-xs text-neutral-medium">{t('weightLabel')}</span>
                        <div className="text-base font-bold text-neutral-dark">{formData.weight} {t('weightUnit')}</div>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-medium">{t('heightLabel')}</span>
                        <div className="text-base font-bold text-neutral-dark">{formData.height} {t('heightUnit')}</div>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-medium">{t('eyesLabel')}</span>
                        <div className="text-base font-bold text-neutral-dark capitalize">
                          {EYE_COLORS.find((c) => c.id === formData.eyeColor)?.name}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-medium">{t('hairLabel')}</span>
                        <div className="text-base font-bold text-neutral-dark capitalize">
                          {HAIR_COLORS.find((c) => c.id === formData.hairColor)?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {submitStatus.type === 'error' && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                  {submitStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      {submitStatus.type !== 'success' && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between">
          {/* Previous button - hidden on first step */}
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold transition-all duration-200 bg-white border-2 border-baby-blue text-baby-blue hover:bg-baby-blue hover:text-white shadow-md hover:shadow-lg"
            >
              ← {t('previous')}
            </button>
          )}

          {/* Cancel button */}
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-neutral-light text-neutral-dark font-semibold rounded-2xl hover:bg-neutral-medium/20 transition-all duration-200 text-center"
          >
            {tCommon('cancel')}
          </Link>

          {/* Next button - shown on all steps except last */}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 0 && (!formData.userName || !formData.userEmail || formData.connectionTypes.length === 0)}
              className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-2xl shadow-md transition-all duration-200 ${
                currentStep === 0 && (!formData.userName || !formData.userEmail || formData.connectionTypes.length === 0)
                  ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                  : 'bg-baby-blue text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {t('next')} →
            </button>
          ) : (
            /* Submit button - shown only on last step */
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3 font-bold rounded-2xl shadow-lg transition-all duration-200 ${
                isSubmitting
                  ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                  : 'bg-gradient-to-r from-baby-blue to-baby-mint text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {isSubmitting
                ? (isEditMode ? t('updating') : t('submitting'))
                : (isEditMode ? `${t('editPrediction')} ✏️` : `${t('submitPrediction')} 🎉`)
              }
            </button>
          )}
        </div>
      )}
        </>
      )}

      {/* Loading State */}
      {isCheckingLock && (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg text-neutral-medium">{t('checkingSubmissionStatus')}</p>
        </div>
      )}
    </div>
  );
}
