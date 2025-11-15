import { mockPredictions } from "@/lib/mock-data";
import { DateResultsView } from "@/components/results/DateResultsView";
import { TimeResultsView } from "@/components/results/TimeResultsView";
import { WeightResultsView } from "@/components/results/WeightResultsView";
import { HeightResultsView } from "@/components/results/HeightResultsView";
import { EyeColorResultsView } from "@/components/results/EyeColorResultsView";
import { HairColorResultsView } from "@/components/results/HairColorResultsView";

export default function FakeEndResultsPage() {
  const dueDate = new Date("2026-02-05T12:00:00");

  return (
    <div className="min-h-screen bg-gradient-to-br from-baby-cream via-white to-baby-blue/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-neutral-dark">
            Baby Leo Predictions
          </h1>
          <p className="text-xl text-neutral-medium">
            Everyone's predictions at a glance
          </p>
          <div className="inline-flex items-center gap-2 bg-baby-blue/20 px-6 py-3 rounded-full">
            <span className="text-2xl">👥</span>
            <span className="text-lg font-semibold text-neutral-dark">
              {mockPredictions.length} predictions submitted
            </span>
          </div>
        </div>

        {/* Date predictions */}
        <DateResultsView predictions={mockPredictions} dueDate={dueDate} />

        {/* Time predictions */}
        <TimeResultsView predictions={mockPredictions} />

        {/* Weight predictions */}
        <WeightResultsView predictions={mockPredictions} />

        {/* Height predictions */}
        <HeightResultsView predictions={mockPredictions} />

        {/* Eye color predictions */}
        <EyeColorResultsView predictions={mockPredictions} />

        {/* Hair color predictions */}
        <HairColorResultsView predictions={mockPredictions} />
      </div>
    </div>
  );
}
