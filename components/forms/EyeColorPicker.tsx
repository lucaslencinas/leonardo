'use client';

import { useState } from 'react';
import { EYE_COLORS, type EyeColorId } from '@/lib/constants/colors';

interface EyeColorPickerProps {
  value: string;
  onChange: (colorId: string) => void;
  label: string;
}

export function EyeColorPicker({ value, onChange, label }: EyeColorPickerProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const selectedColor = EYE_COLORS.find((c) => c.id === value) || EYE_COLORS[0];
  const selectedIndex = EYE_COLORS.findIndex((c) => c.id === value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setPreviewIndex(index);
    onChange(EYE_COLORS[index].id);
  };

  const handleMouseDown = () => setShowPreview(true);
  const handleMouseUp = () => setShowPreview(false);
  const handleTouchStart = () => setShowPreview(true);
  const handleTouchEnd = () => setShowPreview(false);

  // Create gradient from all eye colors
  const gradientStops = EYE_COLORS.map((color, index) => {
    const position = (index / (EYE_COLORS.length - 1)) * 100;
    return `${color.hex} ${position}%`;
  }).join(', ');

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-dark">
        {label}
      </label>

      {/* Eye preview */}
      <div className="bg-white rounded-2xl p-8 shadow-inner">
        <div className="flex items-center justify-center gap-6">
          {/* Left eye */}
          <div className="relative w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full relative overflow-hidden"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30" />
              <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/30 rounded-full blur-sm" />
            </div>
            <div className="absolute w-8 h-8 bg-black rounded-full" />
          </div>

          {/* Right eye */}
          <div className="relative w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full relative overflow-hidden"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30" />
              <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/30 rounded-full blur-sm" />
            </div>
            <div className="absolute w-8 h-8 bg-black rounded-full" />
          </div>
        </div>

        {/* Color name */}
        <div className="text-center mt-6">
          <div className="text-2xl font-heading font-bold text-neutral-dark">
            {selectedColor.name}
          </div>
        </div>
      </div>

      {/* Color gradient slider */}
      <div className="relative px-2">
        <div
          className="absolute inset-x-2 top-0 h-3 rounded-full"
          style={{
            background: `linear-gradient(to right, ${gradientStops})`,
          }}
        />

        <input
          type="range"
          min="0"
          max={EYE_COLORS.length - 1}
          step="1"
          value={selectedIndex}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-3 bg-transparent rounded-full appearance-none cursor-pointer slider-thumb-eye z-10"
        />

        {/* Color name labels */}
        <div className="flex justify-between mt-3 text-xs text-neutral-medium px-1">
          <span>{EYE_COLORS[0].name}</span>
          <span>{EYE_COLORS[Math.floor(EYE_COLORS.length / 2)].name}</span>
          <span>{EYE_COLORS[EYE_COLORS.length - 1].name}</span>
        </div>
      </div>

      {/* Large color preview on hover/touch */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="w-48 h-48 rounded-3xl shadow-2xl border-8 border-white transform scale-110 animate-in fade-in zoom-in duration-200"
            style={{
              backgroundColor: EYE_COLORS[previewIndex].hex,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-center space-y-2 drop-shadow-lg">
                <div className="text-4xl font-heading font-bold">
                  {EYE_COLORS[previewIndex].name}
                </div>
                <div className="text-sm opacity-90">
                  {EYE_COLORS[previewIndex].hex}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color swatches */}
      <div className="grid grid-cols-5 gap-2">
        {EYE_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onChange(color.id)}
            className={`aspect-square rounded-xl border-4 transition-all duration-200 ${
              color.id === value
                ? 'border-neutral-dark scale-110 shadow-lg'
                : 'border-white hover:border-neutral-light hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>

      <style jsx>{`
        .slider-thumb-eye::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          border: 4px solid ${selectedColor.hex};
          transition: transform 0.2s ease;
        }

        .slider-thumb-eye::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }

        .slider-thumb-eye::-webkit-slider-thumb:active {
          transform: scale(1.5);
        }

        .slider-thumb-eye::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          border: 4px solid ${selectedColor.hex};
          transition: transform 0.2s ease;
        }

        .slider-thumb-eye::-moz-range-thumb:hover {
          transform: scale(1.3);
        }

        .slider-thumb-eye::-moz-range-thumb:active {
          transform: scale(1.5);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%);
        }
      `}</style>
    </div>
  );
}
