'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function UserHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations('auth');
  const router = useRouter();

  useEffect(() => {
    // Check for email on mount
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = () => {
      const updatedEmail = localStorage.getItem('userEmail');
      setUserEmail(updatedEmail);
    };

    window.addEventListener('storage', handleStorageChange);

    // Poll for changes (for same-tab updates)
    const interval = setInterval(() => {
      const currentEmail = localStorage.getItem('userEmail');
      if (currentEmail !== userEmail) {
        setUserEmail(currentEmail);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userEmail]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });

      // Clear all localStorage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('emailVerified');
      localStorage.removeItem('verifiedAt');
      localStorage.removeItem('accessCode');
      localStorage.removeItem('accessCodeType');

      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('[UserHeader] Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!userEmail) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Logged in as:</span>
          <span className="text-sm font-semibold text-purple-700">{userEmail}</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-sm text-gray-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? '...' : t('logout')}
        </button>
      </div>
    </div>
  );
}
