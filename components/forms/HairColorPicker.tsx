"use client";

import { useState } from "react";
import { HAIR_COLORS, type HairColorId } from "@/lib/constants/colors";

interface HairColorPickerProps {
  value: HairColorId;
  onChange: (colorId: HairColorId) => void;
  label: string;
}

export function HairColorPicker({
  value,
  onChange,
  label,
}: HairColorPickerProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const selectedColor =
    HAIR_COLORS.find((c) => c.id === value) || HAIR_COLORS[0];
  const selectedIndex = HAIR_COLORS.findIndex((c) => c.id === value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setPreviewIndex(index);
    onChange(HAIR_COLORS[index].id);
  };

  // Disabled preview popup
  const handleMouseDown = () => {}; // setShowPreview(true);
  const handleMouseUp = () => {}; // setShowPreview(false);
  const handleTouchStart = () => {}; // setShowPreview(true);
  const handleTouchEnd = () => {}; // setShowPreview(false);

  // Create gradient from all hair colors
  const gradientStops = HAIR_COLORS.map((color, index) => {
    const position = (index / (HAIR_COLORS.length - 1)) * 100;
    return `${color.hex} ${position}%`;
  }).join(", ");

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-dark">
        {label}
      </label>

      {/* Hair color preview */}
      <div className="bg-white rounded-2xl p-8 shadow-inner">
        <div className="flex items-center justify-center">
          {/* Hair strands visualization */}
          <div className="relative w-48 h-32 flex items-end justify-center gap-1">
            {/* Multiple hair strands */}
            {Array.from({ length: 15 }, (_, i) => {
              const height = 80 + Math.sin(i * 0.8) * 20; // Varying heights
              const delay = i * 0.05;
              return (
                <div
                  key={i}
                  className="hair-strand transition-all duration-500 rounded-t-full"
                  style={{
                    width: "10px",
                    height: `${height}px`,
                    backgroundColor: selectedColor.hex,
                    transitionDelay: `${delay}s`,
                  }}
                />
              );
            })}
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
          max={HAIR_COLORS.length - 1}
          step="1"
          value={selectedIndex}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-3 bg-transparent rounded-full appearance-none cursor-pointer slider-thumb-hair z-10"
        />

        {/* Color name labels */}
        <div className="flex justify-between mt-3 text-xs text-neutral-medium px-1">
          <span>{HAIR_COLORS[0].name}</span>
          <span>{HAIR_COLORS[Math.floor(HAIR_COLORS.length / 2)].name}</span>
          <span>{HAIR_COLORS[HAIR_COLORS.length - 1].name}</span>
        </div>
      </div>

      {/* Large color preview on hover/touch
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="w-48 h-48 rounded-3xl shadow-2xl border-8 border-white transform scale-110 animate-in fade-in zoom-in duration-200"
            style={{
              backgroundColor: HAIR_COLORS[previewIndex].hex,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className={`text-center drop-shadow-lg ${
                previewIndex <= 3 ? 'text-neutral-dark' : 'text-white'
              }`}>
                <div className="text-4xl font-heading font-bold">
                  {HAIR_COLORS[previewIndex].name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Color swatches */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-2">
        {HAIR_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onChange(color.id)}
            className={`aspect-square rounded-xl border-4 transition-all duration-200 ${
              color.id === value
                ? "border-neutral-dark scale-110 shadow-lg"
                : "border-white hover:border-neutral-light hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>

      <style jsx>{`
        .slider-thumb-hair::-webkit-slider-thumb {
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

        .slider-thumb-hair::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }

        .slider-thumb-hair::-webkit-slider-thumb:active {
          transform: scale(1.5);
        }

        .slider-thumb-hair::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
          border: 4px solid ${selectedColor.hex};
          transition: transform 0.2s ease;
        }

        .slider-thumb-hair::-moz-range-thumb:hover {
          transform: scale(1.3);
        }

        .slider-thumb-hair::-moz-range-thumb:active {
          transform: scale(1.5);
        }
      `}</style>
    </div>
  );
}
