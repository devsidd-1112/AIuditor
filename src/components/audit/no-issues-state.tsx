import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NoIssuesStateProps {
  score: number;
}

export function NoIssuesState({ score }: NoIssuesStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        Your AI Stack is Well-Optimized
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Great job! Your current configuration scores {score}/100 for
        optimization. Your tool selection and plan choices align well with your
        team size and needs.
      </p>
      <div className="mt-6 rounded-lg bg-muted/50 p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We recommend reviewing your AI tool spending quarterly to ensure it
          stays optimized as your team grows and pricing changes.
        </p>
      </div>
    </Card>
  );
}
