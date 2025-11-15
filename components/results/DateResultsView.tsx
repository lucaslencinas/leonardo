"use client";

import { useState } from "react";
import { MockPrediction } from "@/lib/mock-data";
import { addDays } from "@/lib/utils";

interface DateResultsViewProps {
  predictions: MockPrediction[];
  dueDate: Date;
}

export function DateResultsView({ predictions, dueDate }: DateResultsViewProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const minDate = addDays(dueDate, -14);
  const maxDate = addDays(dueDate, 14);
  const totalDays = 28;

  // Group predictions by date
  const groupedByDate = predictions.reduce((acc, pred) => {
    const key = pred.birthDate.toISOString().split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(pred);
    return acc;
  }, {} as Record<string, MockPrediction[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">📅</span>
        <h2 className="text-2xl font-heading font-bold text-neutral-dark">
          Birth Date Predictions
        </h2>
      </div>

      <div className="bg-baby-blue/10 rounded-2xl p-6">
        {/* Timeline */}
        <div className="relative h-24">
          {/* Background line */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-baby-blue/20 rounded-full" />

          {/* Due date marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-16 bg-accent-coral"
            style={{ left: "50%" }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-accent-coral whitespace-nowrap">
              Due Date
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-neutral-medium whitespace-nowrap">
              {dueDate.toLocaleDateString()}
            </div>
          </div>

          {/* Prediction dots - grouped by date */}
          {Object.entries(groupedByDate).map(([dateKey, preds]) => {
            const date = new Date(dateKey);
            const daysDiff = Math.floor(
              (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const position = (daysDiff / totalDays) * 100;
            const count = preds.length;

            return (
              <div
                key={dateKey}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200"
                style={{ left: `${position}%` }}
                onMouseEnter={() => setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Stack of dots */}
                <div className="relative flex items-center justify-center">
                  {preds.map((pred, index) => (
                    <div
                      key={pred.id}
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${
                        hoveredDate === dateKey
                          ? "bg-accent-coral"
                          : "bg-baby-blue"
                      }`}
                      style={{
                        position: index === 0 ? "relative" : "absolute",
                        left: index === 0 ? 0 : `${index * 3}px`,
                        transform: hoveredDate === dateKey ? "scale(1.5)" : "scale(1)",
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
                {hoveredDate === dateKey && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-xl">
                    <div className="font-semibold mb-1">{date.toLocaleDateString()}</div>
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

        {/* Date range labels */}
        <div className="flex justify-between mt-16 text-xs text-neutral-medium">
          <span>{minDate.toLocaleDateString()}</span>
          <span>{maxDate.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
