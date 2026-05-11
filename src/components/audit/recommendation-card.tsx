import { AlertCircle, TrendingDown, Users, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/audit/calculations";
import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const categoryIcons = {
  downgrade: TrendingDown,
  overlap: Layers, // V2: Updated from 'consolidation'
  unused_seats: Users, // V2: Updated from 'seat_optimization'
  enterprise_overkill: TrendingDown, // V2: New
  api_optimization: AlertCircle,
  credit_opportunity: AlertCircle,
  already_optimized: AlertCircle,
};

const categoryLabels = {
  downgrade: "Plan Downgrade",
  overlap: "Tool Consolidation", // V2: Updated from 'consolidation'
  unused_seats: "Seat Optimization", // V2: Updated from 'seat_optimization'
  enterprise_overkill: "Enterprise Overkill", // V2: New
  api_optimization: "API Optimization",
  credit_opportunity: "Credit Opportunity",
  already_optimized: "Already Optimized",
};

const severityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const Icon = categoryIcons[recommendation.category];
  const hasSavings = recommendation.savings.monthly > 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{recommendation.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {recommendation.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant="outline"
            className={`${severityColors[recommendation.severity]} capitalize`}
          >
            {recommendation.severity}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {Math.round(recommendation.confidence * 100)}% confidence
          </span>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mt-4 rounded-lg bg-muted/50 p-4">
        <p className="text-sm leading-relaxed">{recommendation.reasoning}</p>
      </div>

      {/* Suggestion */}
      {recommendation.actionable && (
        <div className="mt-4">
          <p className="text-sm font-medium">Recommended Action:</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {recommendation.suggestion}
          </p>
        </div>
      )}

      {/* Savings */}
      {hasSavings && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium">Potential Savings:</span>
          <div className="text-right">
            <p className="font-semibold text-green-600">
              {formatCurrency(recommendation.savings.monthly)}/month
            </p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(recommendation.savings.annual)}/year
            </p>
          </div>
        </div>
      )}

      {/* Category Badge */}
      <div className="mt-4">
        <Badge variant="secondary" className="text-xs">
          {categoryLabels[recommendation.category]}
        </Badge>
      </div>
    </Card>
  );
}
