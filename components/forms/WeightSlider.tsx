"use client";

interface WeightSliderProps {
  value: number;
  onChange: (weight: number) => void;
  label: string;
}

export function WeightSlider({ value, onChange, label }: WeightSliderProps) {
  const minWeight = 2.5;
  const maxWeight = 4.5;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  // Calculate baby icon size based on weight
  const babySize = 60 + ((value - minWeight) / (maxWeight - minWeight)) * 60; // 60px to 120px

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-dark">
        {label}
      </label>

      {/* Baby visual with weight display */}
      <div className="bg-baby-peach/10 rounded-2xl p-8 text-center space-y-4">
        <div
          className="transition-all duration-300 ease-out mx-auto"
          style={{
            fontSize: `${babySize}px`,
            lineHeight: "1",
          }}
        >
          👶
        </div>
        <div className="space-y-1">
          <div className="text-4xl font-heading font-bold text-neutral-dark">
            {value.toFixed(1)}{" "}
            <span className="text-2xl text-neutral-medium">kg</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-2">
        <input
          type="range"
          min={minWeight}
          max={maxWeight}
          step="0.1"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-3 bg-baby-peach/20 rounded-full appearance-none cursor-pointer slider-thumb-weight"
          style={{
            background: `linear-gradient(to right, #FFD4B2 0%, #FFD4B2 ${
              ((value - minWeight) / (maxWeight - minWeight)) * 100
            }%, #E5E5E5 ${
              ((value - minWeight) / (maxWeight - minWeight)) * 100
            }%, #E5E5E5 100%)`,
          }}
        />

        {/* Visual ruler underneath */}
        <div className="mt-4 relative h-12 bg-gradient-to-r from-baby-peach/10 via-baby-peach/20 to-baby-peach/10 rounded-lg border-2 border-baby-peach/30">
          {/* Ruler markings */}
          <div className="absolute inset-0 flex justify-between items-end px-2 pb-1">
            {Array.from({ length: 21 }, (_, i) => {
              const weight = minWeight + i * 0.1;
              const isMainMark = i % 5 === 0;
              return (
                <div
                  key={i}
                  className={`${
                    isMainMark
                      ? "h-6 w-0.5 bg-baby-peach"
                      : "h-3 w-px bg-baby-peach/40"
                  }`}
                />
              );
            })}
          </div>

          {/* Current weight indicator */}
          <div
            className="absolute top-0 w-1 h-full bg-neutral-dark shadow-lg transition-all duration-200"
            style={{
              left: `${((value - minWeight) / (maxWeight - minWeight)) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {value.toFixed(1)}kg
            </div>
          </div>
        </div>

        {/* Weight labels */}
        <div className="flex justify-between mt-2 text-xs text-neutral-medium px-1">
          <span className="font-semibold">{minWeight} kg</span>
          <span>{((minWeight + maxWeight) / 2).toFixed(1)} kg</span>
          <span className="font-semibold">{maxWeight} kg</span>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb-weight::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffd4b2;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb-weight::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider-thumb-weight::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffd4b2;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }

        .slider-thumb-weight::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
