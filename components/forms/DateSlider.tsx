'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { addDays, formatDate } from '@/lib/utils';

interface DateSliderProps {
  value: Date;
  onChange: (date: Date) => void;
  dueDate: Date;
  label: string;
}

export function DateSlider({ value, onChange, dueDate, label }: DateSliderProps) {
  const locale = useLocale();

  // Calculate date range: ±2 weeks from due date
  const minDate = addDays(dueDate, -14);
  const maxDate = addDays(dueDate, 14);
  const totalDays = 28; // 14 days before + 14 days after

  // Calculate slider position (0-28 days)
  const getDaysFromMin = (date: Date) => {
    const diffTime = date.getTime() - minDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(totalDays, diffDays));
  };

  const sliderValue = getDaysFromMin(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value);
    const newDate = addDays(minDate, days);
    onChange(newDate);
  };

  // Calculate days difference from due date for display
  const daysFromDue = Math.round((value.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysText = daysFromDue === 0
    ? 'Due Date'
    : daysFromDue > 0
    ? `${daysFromDue} day${daysFromDue > 1 ? 's' : ''} after`
    : `${Math.abs(daysFromDue)} day${Math.abs(daysFromDue) > 1 ? 's' : ''} before`;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-dark">
        {label}
      </label>

      {/* Selected Date Display */}
      <div className="bg-baby-blue/10 rounded-2xl p-6 text-center space-y-2">
        <div className="text-3xl font-heading font-bold text-neutral-dark">
          {formatDate(value, locale)}
        </div>
        <div className="text-sm font-medium text-baby-blue">
          {daysText}
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min="0"
          max={totalDays}
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-3 bg-baby-blue/20 rounded-full appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #A8D5E2 0%, #A8D5E2 ${(sliderValue / totalDays) * 100}%, #E5E5E5 ${(sliderValue / totalDays) * 100}%, #E5E5E5 100%)`
          }}
        />

        {/* Markers */}
        <div className="flex justify-between mt-2 text-xs text-neutral-medium px-1">
          <span>-2 weeks</span>
          <span className="font-semibold text-baby-blue">Due Date</span>
          <span>+2 weeks</span>
        </div>

        {/* Date markers */}
        <div className="flex justify-between mt-1 text-xs text-neutral-medium px-1">
          <span>{formatDate(minDate, locale).split(' ')[1]} {formatDate(minDate, locale).split(' ')[0]}</span>
          <span>{formatDate(maxDate, locale).split(' ')[1]} {formatDate(maxDate, locale).split(' ')[0]}</span>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #A8D5E2;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #A8D5E2;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
