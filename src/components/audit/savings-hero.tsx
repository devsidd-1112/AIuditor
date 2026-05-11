import { formatCurrency } from "@/lib/audit/calculations";
import type { SavingsSummary, OptimizationScore } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SavingsHeroProps {
  // Support both old and new prop formats for compatibility
  savings?: SavingsSummary;
  score?: OptimizationScore;
  
  // New format (used in public reports)
  currentMonthly?: number;
  optimizedMonthly?: number;
  monthlySavings?: number;
  annualSavings?: number;
  savingsPercentage?: number;
  optimizationScore?: number;
  rating?: "excellent" | "good" | "moderate" | "poor";
}

export function SavingsHero(props: SavingsHeroProps) {
  // Support both prop formats
  const currentMonthly = props.currentMonthly ?? props.savings?.current.monthly ?? 0;
  const monthlySavings = props.monthlySavings ?? props.savings?.savings.monthly ?? 0;
  const annualSavings = props.annualSavings ?? props.savings?.savings.annual ?? 0;
  const savingsPercentage = props.savingsPercentage ?? props.savings?.savings.percentage ?? 0;
  const optimizationScore = props.optimizationScore ?? props.score?.overall ?? 0;
  const rating = props.rating ?? props.score?.rating ?? "moderate";
  const breakdown = props.score?.breakdown;
  
  const hasSignificantSavings = monthlySavings >= 20;

  const ratingColors = {
    excellent: "bg-green-100 text-green-800 border-green-200",
    good: "bg-blue-100 text-blue-800 border-blue-200",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    poor: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Results</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Analysis of your AI tool spending
          </p>
        </div>
        <Badge
          variant="outline"
          className={`${ratingColors[rating]} capitalize`}
        >
          {rating}
        </Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Current Spend */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Current Spend
          </p>
          <p className="mt-1 text-3xl font-bold">
            {formatCurrency(currentMonthly)}
            <span className="text-base font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(currentMonthly * 12)}/year
          </p>
        </div>

        {/* Potential Savings */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Potential Savings
          </p>
          <p
            className={`mt-1 text-3xl font-bold ${
              hasSignificantSavings ? "text-green-600" : ""
            }`}
          >
            {formatCurrency(monthlySavings)}
            <span className="text-base font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(annualSavings)}/year
            {savingsPercentage > 0 && (
              <span className="ml-1">({savingsPercentage.toFixed(0)}%)</span>
            )}
          </p>
        </div>

        {/* Optimization Score */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Optimization Score
          </p>
          <p className="mt-1 text-3xl font-bold">
            {optimizationScore}
            <span className="text-base font-normal text-muted-foreground">
              /100
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground capitalize">
            {rating} efficiency
          </p>
        </div>
      </div>

      {/* Score Breakdown (only show if available) */}
      {breakdown && (
        <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Plan Efficiency
            </p>
            <p className="mt-1 text-lg font-semibold">
              {breakdown.planEfficiency}
              <span className="text-sm font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Tool Redundancy
            </p>
            <p className="mt-1 text-lg font-semibold">
              {breakdown.toolRedundancy}
              <span className="text-sm font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Seat Utilization
            </p>
            <p className="mt-1 text-lg font-semibold">
              {breakdown.seatUtilization}
              <span className="text-sm font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Enterprise Fit
            </p>
            <p className="mt-1 text-lg font-semibold">
              {breakdown.enterpriseOverkill}
              <span className="text-sm font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
