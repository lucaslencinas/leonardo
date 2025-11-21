'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('VerifyEmail');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email || !token) {
        setStatus('error');
        setError(t('missingParams'));
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');

          // Store email in localStorage for UserHeader
          if (email) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('emailVerified', 'true');
            localStorage.setItem('verifiedAt', new Date().toISOString());
          }

          // Redirect to predict page after 5 seconds
          setTimeout(() => {
            router.push('/predict');
          }, 5000);
        } else {
          setStatus('error');
          setError(data.error || t('verificationFailed'));
        }
      } catch (err) {
        setStatus('error');
        setError(t('unexpectedError'));
      }
    };

    verifyEmail();
  }, [email, token, t, router]);

  // Countdown timer effect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, countdown]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          locale: window.location.pathname.split('/')[1] || 'en'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t('emailResent'));
      } else {
        alert(data.error || t('resendFailed'));
      }
    } catch (err) {
      alert(t('resendFailed'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <svg className="animate-spin h-16 w-16 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('verifying')}</h1>
              <p className="text-gray-600">{t('pleaseWait')}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('success')}</h1>
              <p className="text-gray-600 mb-4">{t('successMessage')}</p>
              <p className="text-sm text-gray-500">
                {countdown > 0
                  ? `${t('redirecting')} ${countdown} ${countdown === 1 ? t('second') : t('seconds')}...`
                  : t('redirecting')}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('error')}</h1>
              <p className="text-gray-600 mb-6">{error}</p>

              {email && (
                <button
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? t('resending') : t('resendEmail')}
                </button>
              )}

              <button
                onClick={() => router.push('/')}
                className="w-full mt-3 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                {t('backHome')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
