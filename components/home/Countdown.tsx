'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function Countdown() {
  const t = useTranslations('home');
  // Expected due date: February 5, 2026 at 12:00 PM (lunchtime)
  const dueDate = new Date('2026-02-05T12:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = dueDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-neutral-light">
      <p className="text-sm font-medium text-neutral-medium uppercase tracking-wider mb-4">
        {t('countdownLabel')}
      </p>
      <div className="grid grid-cols-4 gap-4">
        {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="bg-baby-blue/20 rounded-2xl p-4 w-full flex items-center justify-center min-h-[80px]">
              <span className="text-3xl md:text-5xl font-heading font-bold text-neutral-dark">
                {timeLeft[unit].toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs md:text-sm font-medium text-neutral-medium mt-2 uppercase">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
