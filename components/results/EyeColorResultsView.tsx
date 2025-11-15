"use client";

import { useState } from "react";
import { MockPrediction } from "@/lib/mock-data";
import { EYE_COLORS } from "@/lib/constants/colors";

interface EyeColorResultsViewProps {
  predictions: MockPrediction[];
}

export function EyeColorResultsView({ predictions }: EyeColorResultsViewProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Count predictions per color
  const colorCounts = predictions.reduce((acc, pred) => {
    acc[pred.eyeColor] = (acc[pred.eyeColor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get predictors for each color
  const colorPredictors = predictions.reduce((acc, pred) => {
    if (!acc[pred.eyeColor]) acc[pred.eyeColor] = [];
    acc[pred.eyeColor].push(pred.userName);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">👁️</span>
        <h2 className="text-2xl font-heading font-bold text-neutral-dark">
          Eye Color Predictions
        </h2>
      </div>

      <div className="bg-baby-blue/10 rounded-2xl p-6">
        <div className="grid grid-cols-5 gap-4">
          {EYE_COLORS.map((color) => {
            const count = colorCounts[color.id] || 0;
            const predictors = colorPredictors[color.id] || [];
            const hasVotes = count > 0;

            return (
              <div
                key={color.id}
                className="relative"
                onMouseEnter={() => setHoveredColor(color.id)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Eye color circle */}
                  <div
                    className={`w-16 h-16 rounded-full border-4 transition-all duration-200 cursor-pointer ${
                      hasVotes
                        ? "border-white shadow-lg"
                        : "border-neutral-light/30 opacity-40"
                    } ${
                      hoveredColor === color.id && hasVotes
                        ? "scale-125 ring-4 ring-accent-coral/30"
                        : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />

                  {/* Color name */}
                  <div className="text-xs text-center text-neutral-medium">
                    {color.name}
                  </div>

                  {/* Vote count badge */}
                  {hasVotes && (
                    <div className="bg-neutral-dark text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      {count}
                    </div>
                  )}

                  {/* Hover tooltip with names */}
                  {hoveredColor === color.id && hasVotes && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-xl">
                      <div className="font-semibold mb-1">{color.name}</div>
                      {predictors.map((name, i) => (
                        <div key={i} className="text-baby-cream/80">
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
