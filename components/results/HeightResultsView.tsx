"use client";

import { useState } from "react";
import { MockPrediction } from "@/lib/mock-data";

interface HeightResultsViewProps {
  predictions: MockPrediction[];
}

export function HeightResultsView({ predictions }: HeightResultsViewProps) {
  const [hoveredHeight, setHoveredHeight] = useState<number | null>(null);

  const minHeight = 40;
  const maxHeight = 60;

  const getPosition = (height: number) => {
    return ((height - minHeight) / (maxHeight - minHeight)) * 100;
  };

  // Group predictions by height
  const groupedByHeight = predictions.reduce((acc, pred) => {
    const key = pred.height.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(pred);
    return acc;
  }, {} as Record<string, MockPrediction[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">📏</span>
        <h2 className="text-2xl font-heading font-bold text-neutral-dark">
          Height Predictions
        </h2>
      </div>

      <div className="bg-baby-lavender/10 rounded-2xl p-6">
        {/* Horizontal Ruler */}
        <div className="relative h-20">
          {/* Ruler background */}
          <div className="absolute top-1/2 left-0 right-0 h-12 bg-gradient-to-r from-baby-lavender/10 via-baby-lavender/20 to-baby-lavender/10 rounded-lg border-2 border-baby-lavender/30">
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
                        ? "h-6 w-0.5 bg-baby-lavender"
                        : "h-3 w-px bg-baby-lavender/40"
                    } ${!isSelectable && "opacity-30"}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Prediction dots - grouped by height */}
          {Object.entries(groupedByHeight).map(([heightKey, preds]) => {
            const height = parseFloat(heightKey);
            const position = getPosition(height);
            const count = preds.length;

            return (
              <div
                key={heightKey}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200 z-10"
                style={{ left: `${position}%` }}
                onMouseEnter={() => setHoveredHeight(height)}
                onMouseLeave={() => setHoveredHeight(null)}
              >
                {/* Stack of dots */}
                <div className="relative flex items-center justify-center">
                  {preds.map((pred, index) => (
                    <div
                      key={pred.id}
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${
                        hoveredHeight === height
                          ? "bg-accent-coral"
                          : "bg-neutral-dark"
                      }`}
                      style={{
                        position: index === 0 ? "relative" : "absolute",
                        left: index === 0 ? 0 : `${index * 3}px`,
                        transform: hoveredHeight === height ? "scale(1.5)" : "scale(1)",
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
                {hoveredHeight === height && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl">
                    <div className="font-semibold mb-1">{height} cm</div>
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

        {/* Height labels */}
        <div className="flex justify-between mt-4 text-xs text-neutral-medium px-1">
          <span className="font-semibold">35 cm</span>
          <span className="font-semibold">{minHeight} cm</span>
          <span>{((minHeight + maxHeight) / 2)} cm</span>
          <span className="font-semibold">{maxHeight} cm</span>
          <span className="font-semibold">65 cm</span>
        </div>
      </div>
    </div>
  );
}
