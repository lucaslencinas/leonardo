'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  birthDate: Date;
  birthTime: { hours: number; minutes: number };
  weight: number;
  height: number;
  eyeColor: EyeColorId;
  hairColor: HairColorId;
}

export default function PredictPage() {
  const t = useTranslations('predict');

  // Due date: February 5, 2026 at 12:00 PM
  const dueDate = new Date('2026-02-05T12:00:00');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    userEmail: '',
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
  }>({ type: null, message: '' });

  const steps = [
    { id: 'user', label: 'Your Info', icon: '👤' },
    { id: 'date', label: 'Birth Date', icon: '📅' },
    { id: 'time', label: 'Birth Time', icon: '⏰' },
    { id: 'weight', label: 'Weight', icon: '⚖️' },
    { id: 'height', label: 'Height', icon: '📏' },
    { id: 'eyes', label: 'Eye Color', icon: '👁️' },
    { id: 'hair', label: 'Hair Color', icon: '💇' },
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit prediction');
      }

      setSubmitStatus({
        type: 'success',
        message: data.message || 'Prediction submitted successfully!',
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting prediction:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
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

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
                index === currentStep
                  ? 'scale-110'
                  : index < currentStep
                  ? 'opacity-60'
                  : 'opacity-30'
              }`}
              onClick={() => setCurrentStep(index)}
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
          ))}
        </div>
        <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
          <div
            className="h-full bg-baby-blue transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-neutral-medium">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Success/Error Message */}
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {submitStatus.type === 'success' ? '✅' : '❌'}
            </span>
            <p className="font-medium">{submitStatus.message}</p>
          </div>
          {submitStatus.type === 'success' && (
            <div className="mt-3">
              <Link
                href="/predictions"
                className="text-sm text-green-700 underline hover:text-green-900"
              >
                View all predictions →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Form content */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="min-h-[500px]">
          {/* Step 0: User Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-neutral-dark mb-2">
                  👤 Tell us about yourself
                </h2>
                <p className="text-neutral-medium">
                  We'll use this to identify your prediction
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-neutral-light rounded-lg focus:border-baby-blue focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-dark mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-neutral-light rounded-lg focus:border-baby-blue focus:outline-none transition-colors"
                  required
                />
                <p className="mt-2 text-xs text-neutral-medium">
                  We'll never share your email. One prediction per email.
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
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
            currentStep === 0
              ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
              : 'bg-white border-2 border-baby-blue text-baby-blue hover:bg-baby-blue hover:text-white shadow-md hover:shadow-lg'
          }`}
        >
          ← Previous
        </button>

        <Link
          href="/"
          className="px-6 py-3 bg-neutral-light text-neutral-dark font-semibold rounded-2xl hover:bg-neutral-medium/20 transition-all duration-200"
        >
          Cancel
        </Link>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={currentStep === 0 && (!formData.userName || !formData.userEmail)}
            className={`px-6 py-3 font-semibold rounded-2xl shadow-md transition-all duration-200 ${
              currentStep === 0 && (!formData.userName || !formData.userEmail)
                ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                : 'bg-baby-blue text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || submitStatus.type === 'success'}
            className={`px-8 py-3 font-bold rounded-2xl shadow-lg transition-all duration-200 ${
              isSubmitting || submitStatus.type === 'success'
                ? 'bg-neutral-light text-neutral-medium cursor-not-allowed'
                : 'bg-gradient-to-r from-baby-blue to-baby-mint text-white hover:shadow-xl hover:scale-105'
            }`}
          >
            {isSubmitting ? 'Submitting...' : submitStatus.type === 'success' ? 'Submitted ✓' : `${t('submitPrediction')} 🎉`}
          </button>
        )}
      </div>

      {/* Summary preview (shown on last step) */}
      {currentStep === steps.length - 1 && (
        <div className="mt-8 bg-baby-cream/30 rounded-3xl p-6 border-2 border-baby-cream">
          <h3 className="text-lg font-heading font-bold text-neutral-dark mb-4 text-center">
            📋 Your Prediction Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="col-span-2">
              <span className="text-neutral-medium">Name:</span>
              <div className="font-semibold">{formData.userName || 'Not provided'}</div>
            </div>
            <div className="col-span-2">
              <span className="text-neutral-medium">Email:</span>
              <div className="font-semibold">{formData.userEmail || 'Not provided'}</div>
            </div>
            <div>
              <span className="text-neutral-medium">Date:</span>
              <div className="font-semibold">{formData.birthDate.toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-neutral-medium">Time:</span>
              <div className="font-semibold">
                {String(formData.birthTime.hours).padStart(2, '0')}:
                {String(formData.birthTime.minutes).padStart(2, '0')}
              </div>
            </div>
            <div>
              <span className="text-neutral-medium">Weight:</span>
              <div className="font-semibold">{formData.weight} kg</div>
            </div>
            <div>
              <span className="text-neutral-medium">Height:</span>
              <div className="font-semibold">{formData.height} cm</div>
            </div>
            <div>
              <span className="text-neutral-medium">Eye Color:</span>
              <div className="font-semibold">
                {EYE_COLORS.find((c) => c.id === formData.eyeColor)?.name}
              </div>
            </div>
            <div>
              <span className="text-neutral-medium">Hair Color:</span>
              <div className="font-semibold">
                {HAIR_COLORS.find((c) => c.id === formData.hairColor)?.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
