'use client';

import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useState } from 'react';

const locales = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es-AR', flag: '🇦🇷', name: 'Español' },
  { code: 'sv', flag: '🇸🇪', name: 'Svenska' },
];

export function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = params.locale as string;
  const currentLocaleData = locales.find((l) => l.code === currentLocale) || locales[0];

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-neutral-light"
        aria-label="Change language"
      >
        <span className="text-2xl">{currentLocaleData.flag}</span>
        <span className="text-sm font-medium text-neutral-dark hidden sm:inline">
          {currentLocaleData.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-2xl shadow-lg border border-neutral-light z-20 overflow-hidden">
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-baby-blue/20 transition-colors duration-150 ${
                  locale.code === currentLocale ? 'bg-baby-blue/10' : ''
                }`}
              >
                <span className="text-2xl">{locale.flag}</span>
                <span className="text-sm font-medium text-neutral-dark">{locale.name}</span>
                {locale.code === currentLocale && (
                  <svg
                    className="w-4 h-4 ml-auto text-baby-blue"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
