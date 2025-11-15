"use client";

import { useState } from "react";
import { MockPrediction } from "@/lib/mock-data";

interface WeightResultsViewProps {
  predictions: MockPrediction[];
}

export function WeightResultsView({ predictions }: WeightResultsViewProps) {
  const [hoveredWeight, setHoveredWeight] = useState<number | null>(null);

  const minWeight = 2.5;
  const maxWeight = 4.5;

  const getPosition = (weight: number) => {
    return ((weight - minWeight) / (maxWeight - minWeight)) * 100;
  };

  // Group predictions by weight
  const groupedByWeight = predictions.reduce((acc, pred) => {
    const key = pred.weight.toFixed(1);
    if (!acc[key]) acc[key] = [];
    acc[key].push(pred);
    return acc;
  }, {} as Record<string, MockPrediction[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">⚖️</span>
        <h2 className="text-2xl font-heading font-bold text-neutral-dark">
          Weight Predictions
        </h2>
      </div>

      <div className="bg-baby-peach/10 rounded-2xl p-6">
        {/* Scale with ruler */}
        <div className="relative h-20">
          {/* Ruler background */}
          <div className="absolute top-1/2 left-0 right-0 h-12 bg-gradient-to-r from-baby-peach/10 via-baby-peach/20 to-baby-peach/10 rounded-lg border-2 border-baby-peach/30">
            {/* Ruler markings */}
            <div className="absolute inset-0 flex justify-between items-end px-2 pb-1">
              {Array.from({ length: 21 }, (_, i) => {
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
          </div>

          {/* Prediction dots - grouped by weight */}
          {Object.entries(groupedByWeight).map(([weightKey, preds]) => {
            const weight = parseFloat(weightKey);
            const position = getPosition(weight);
            const count = preds.length;

            return (
              <div
                key={weightKey}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200 z-10"
                style={{ left: `${position}%` }}
                onMouseEnter={() => setHoveredWeight(weight)}
                onMouseLeave={() => setHoveredWeight(null)}
              >
                {/* Stack of dots */}
                <div className="relative flex items-center justify-center">
                  {preds.map((pred, index) => (
                    <div
                      key={pred.id}
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${
                        hoveredWeight === weight
                          ? "bg-accent-coral"
                          : "bg-baby-peach"
                      }`}
                      style={{
                        position: index === 0 ? "relative" : "absolute",
                        left: index === 0 ? 0 : `${index * 3}px`,
                        transform: hoveredWeight === weight ? "scale(1.5)" : "scale(1)",
                        zIndex: index,
                      }}
                    />
                  ))}
                  {count > 1 && (
                    <div className="absolute -top-2 -right-2 bg-neutral-dark text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {count}
                    </div>
                  )}
                </div>
                {hoveredWeight === weight && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl">
                    <div className="font-semibold mb-1">{weight.toFixed(1)} kg</div>
                    {preds.map((pred) => (
                      <div key={pred.id} className="text-baby-cream/80">
                        {pred.userName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weight labels */}
        <div className="flex justify-between mt-4 text-xs text-neutral-medium px-1">
          <span className="font-semibold">{minWeight} kg</span>
          <span>{((minWeight + maxWeight) / 2).toFixed(1)} kg</span>
          <span className="font-semibold">{maxWeight} kg</span>
        </div>
      </div>
    </div>
  );
}
