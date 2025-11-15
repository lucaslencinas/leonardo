'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { formatTime } from '@/lib/utils';

interface TimeSliderProps {
  value: { hours: number; minutes: number };
  onChange: (time: { hours: number; minutes: number }) => void;
  label: string;
}

export function TimeSlider({ value, onChange, label }: TimeSliderProps) {
  const locale = useLocale();

  // Convert time to minutes since midnight (0-1439)
  const timeToMinutes = (hours: number, minutes: number) => hours * 60 + minutes;
  const minutesToTime = (totalMinutes: number) => ({
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  });

  const currentMinutes = timeToMinutes(value.hours, value.minutes);
  const maxMinutes = 1439; // 23:59

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value);
    const newTime = minutesToTime(minutes);
    onChange(newTime);
  };

  // Determine period of day
  const getPeriodOfDay = (hours: number) => {
    if (hours >= 5 && hours < 12) return { icon: '🌅', text: 'Morning' };
    if (hours >= 12 && hours < 17) return { icon: '☀️', text: 'Afternoon' };
    if (hours >= 17 && hours < 21) return { icon: '🌆', text: 'Evening' };
    return { icon: '🌙', text: 'Night' };
  };

  const period = getPeriodOfDay(value.hours);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-dark">
        {label}
      </label>

      {/* Selected Time Display */}
      <div className="bg-baby-mint/10 rounded-2xl p-6 text-center space-y-2">
        <div className="text-5xl mb-2">
          {period.icon}
        </div>
        <div className="text-3xl font-heading font-bold text-neutral-dark font-mono">
          {String(value.hours).padStart(2, '0')}:{String(value.minutes).padStart(2, '0')}
        </div>
        <div className="text-sm font-medium text-baby-mint">
          {period.text}
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min="0"
          max={maxMinutes}
          step="15" // 15-minute intervals for easier selection
          value={currentMinutes}
          onChange={handleSliderChange}
          className="w-full h-3 bg-baby-mint/20 rounded-full appearance-none cursor-pointer slider-thumb-time"
          style={{
            background: `linear-gradient(to right, #B8E6D5 0%, #B8E6D5 ${(currentMinutes / maxMinutes) * 100}%, #E5E5E5 ${(currentMinutes / maxMinutes) * 100}%, #E5E5E5 100%)`
          }}
        />

        {/* Time markers */}
        <div className="flex justify-between mt-2 text-xs text-neutral-medium px-1">
          <span>00:00</span>
          <span>06:00</span>
          <span className="font-semibold text-baby-mint">12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>

        {/* Period indicators */}
        <div className="flex justify-between mt-1 text-xs text-neutral-medium px-1">
          <span>🌙 Night</span>
          <span>🌅 Morning</span>
          <span>🌆 Evening</span>
        </div>
      </div>

      {/* Quick time buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Midnight', hours: 0, minutes: 0 },
          { label: 'Morning', hours: 6, minutes: 0 },
          { label: 'Noon', hours: 12, minutes: 0 },
          { label: 'Evening', hours: 18, minutes: 0 },
        ].map((time) => (
          <button
            key={time.label}
            onClick={() => onChange({ hours: time.hours, minutes: time.minutes })}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
              value.hours === time.hours && value.minutes === time.minutes
                ? 'bg-baby-mint text-white shadow-md'
                : 'bg-baby-mint/10 text-neutral-dark hover:bg-baby-mint/20'
            }`}
          >
            {time.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .slider-thumb-time::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #B8E6D5;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb-time::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-thumb-time::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #B8E6D5;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb-time::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
