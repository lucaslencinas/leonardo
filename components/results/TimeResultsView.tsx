"use client";

import { useState } from "react";
import { MockPrediction } from "@/lib/mock-data";

interface TimeResultsViewProps {
  predictions: MockPrediction[];
}

export function TimeResultsView({ predictions }: TimeResultsViewProps) {
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  const getTimePosition = (hours: number, minutes: number) => {
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const getTimeEmoji = (hours: number) => {
    if (hours >= 6 && hours < 12) return "🌅";
    if (hours >= 12 && hours < 18) return "☀️";
    if (hours >= 18 && hours < 22) return "🌆";
    return "🌙";
  };

  // Group predictions by time
  const groupedByTime = predictions.reduce((acc, pred) => {
    const key = `${pred.birthTime.hours}:${pred.birthTime.minutes}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(pred);
    return acc;
  }, {} as Record<string, MockPrediction[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">⏰</span>
        <h2 className="text-2xl font-heading font-bold text-neutral-dark">
          Birth Time Predictions
        </h2>
      </div>

      <div className="bg-baby-mint/10 rounded-2xl p-6">
        {/* Timeline */}
        <div className="relative h-24">
          {/* Background gradient */}
          <div className="absolute top-1/2 left-0 right-0 h-3 rounded-full bg-gradient-to-r from-indigo-300 via-yellow-200 via-orange-300 to-indigo-400" />

          {/* Time period markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-around text-2xl">
            <span>🌙</span>
            <span>🌅</span>
            <span>☀️</span>
            <span>🌆</span>
            <span>🌙</span>
          </div>

          {/* Prediction dots - grouped by time */}
          {Object.entries(groupedByTime).map(([timeKey, preds]) => {
            const [hours, minutes] = timeKey.split(':').map(Number);
            const position = getTimePosition(hours, minutes);
            const count = preds.length;

            return (
              <div
                key={timeKey}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200"
                style={{ left: `${position}%` }}
                onMouseEnter={() => setHoveredTime(timeKey)}
                onMouseLeave={() => setHoveredTime(null)}
              >
                {/* Stack of dots */}
                <div className="relative flex items-center justify-center">
                  {preds.map((pred, index) => (
                    <div
                      key={pred.id}
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${
                        hoveredTime === timeKey
                          ? "bg-accent-coral"
                          : "bg-baby-mint"
                      }`}
                      style={{
                        position: index === 0 ? "relative" : "absolute",
                        left: index === 0 ? 0 : `${index * 3}px`,
                        transform: hoveredTime === timeKey ? "scale(1.5)" : "scale(1)",
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
                {hoveredTime === timeKey && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-xl">
                    <div className="font-semibold mb-1">
                      {String(hours).padStart(2, "0")}:
                      {String(minutes).padStart(2, "0")}
                    </div>
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

        {/* Time labels */}
        <div className="flex justify-between mt-12 text-xs text-neutral-medium">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
}
