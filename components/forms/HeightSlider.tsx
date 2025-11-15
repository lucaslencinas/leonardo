'use client';

interface HeightSliderProps {
  value: number;
  onChange: (height: number) => void;
  label: string;
}

export function HeightSlider({ value, onChange, label }: HeightSliderProps) {
  const minHeight = 40;
  const maxHeight = 60;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  // Calculate baby silhouette height
  const silhouetteHeight = 80 + ((value - minHeight) / (maxHeight - minHeight)) * 80; // 80px to 160px

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-dark">
        {label}
      </label>

      {/* Baby silhouette with height display */}
      <div className="bg-baby-blue/10 rounded-2xl p-8 text-center space-y-4">
        <div
          className="transition-all duration-300 ease-out mx-auto"
          style={{
            fontSize: `${silhouetteHeight}px`,
            lineHeight: "1",
          }}
        >
          👶
        </div>
        <div className="space-y-1">
          <div className="text-4xl font-heading font-bold text-neutral-dark">
            {value.toFixed(1)}{" "}
            <span className="text-2xl text-neutral-medium">cm</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min={minHeight}
          max={maxHeight}
          step="0.5"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-3 bg-baby-blue/20 rounded-full appearance-none cursor-pointer slider-thumb-height"
          style={{
            background: `linear-gradient(to right, #A8D5E2 0%, #A8D5E2 ${((value - minHeight) / (maxHeight - minHeight)) * 100}%, #E5E5E5 ${((value - minHeight) / (maxHeight - minHeight)) * 100}%, #E5E5E5 100%)`
          }}
        />

        {/* Visual ruler underneath - extended range 35-65cm */}
        <div className="mt-4 relative h-12 bg-gradient-to-r from-baby-blue/10 via-baby-blue/20 to-baby-blue/10 rounded-lg border-2 border-baby-blue/30">
          {/* Ruler markings */}
          <div className="absolute inset-0 flex justify-between items-end px-2 pb-1">
            {Array.from({ length: 31 }, (_, i) => {
              const height = 35 + i;
              const isMainMark = height % 5 === 0;
              const isSelectable = height >= minHeight && height <= maxHeight;
              return (
                <div
                  key={i}
                  className={`${
                    isMainMark
                      ? "h-6 w-0.5 bg-baby-blue"
                      : "h-3 w-px bg-baby-blue/40"
                  } ${!isSelectable && "opacity-30"}`}
                />
              );
            })}
          </div>

          {/* Current height indicator */}
          <div
            className="absolute top-0 w-1 h-full bg-neutral-dark shadow-lg transition-all duration-200"
            style={{
              left: `${((value - minHeight) / (maxHeight - minHeight)) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {value.toFixed(1)} cm
            </div>
          </div>
        </div>

        {/* Height labels */}
        <div className="flex justify-between mt-2 text-xs text-neutral-medium px-1">
          <span className="font-semibold">35 cm</span>
          <span className="font-semibold">{minHeight} cm</span>
          <span>{((minHeight + maxHeight) / 2).toFixed(0)} cm</span>
          <span className="font-semibold">{maxHeight} cm</span>
          <span className="font-semibold">65 cm</span>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb-height::-webkit-slider-thumb {
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

        .slider-thumb-height::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-thumb-height::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #A8D5E2;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb-height::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
