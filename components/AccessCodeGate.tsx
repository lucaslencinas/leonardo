'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface AccessCodeGateProps {
  onAccessGranted: () => void;
  locale: string;
}

export default function AccessCodeGate({ onAccessGranted, locale }: AccessCodeGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('accessCode');

  useEffect(() => {
    // Check if there's a code in the URL
    const urlCode = searchParams.get('code');
    if (urlCode) {
      console.log('[AccessCodeGate] Code found in URL:', urlCode);
      validateCode(urlCode);
    }

    // Check if code is already validated in localStorage
    const storedCode = localStorage.getItem('accessCode');
    if (storedCode) {
      console.log('[AccessCodeGate] Code found in localStorage');
      onAccessGranted();
    }
  }, [searchParams]);

  const validateCode = async (codeToValidate: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('[AccessCodeGate] Validating code:', codeToValidate);

      const response = await fetch('/api/auth/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToValidate }),
      });

      const data = await response.json();

      if (data.valid) {
        console.log('[AccessCodeGate] Code validated successfully');
        // Store the code in localStorage
        localStorage.setItem('accessCode', codeToValidate.toUpperCase());
        localStorage.setItem('accessCodeType', data.codeType);

        // Remove code from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        window.history.replaceState({}, '', url);

        onAccessGranted();
      } else {
        console.error('[AccessCodeGate] Code validation failed:', data.error);
        setError(data.error || 'Invalid access code');
      }
    } catch (error) {
      console.error('[AccessCodeGate] Error validating code:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      validateCode(code.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
              {t('inputLabel')}
            </label>
            <input
              type="text"
              id="accessCode"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="FAMILY2025"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase text-center text-xl tracking-wider"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('verifying') : t('submitButton')}
          </button>
        </form>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            {t('helpText')}
          </p>
        </div>
      </div>
    </div>
  );
}
