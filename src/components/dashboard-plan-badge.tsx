"use client";

import { PlanBadge, usePlanState } from "@/components/plan-badge";
import { Progress } from "@/components/ui/progress";

export function DashboardPlanBadge() {
  const { planName, isLoading } = usePlanState();
  return <PlanBadge planName={planName} isLoading={isLoading} />;
}

export function DashboardCreditProgress({ credits }: { credits: number }) {
  const { planCredits, isLoading } = usePlanState();
  const maxCredits = isLoading ? credits : planCredits;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {credits} / {isLoading ? "..." : maxCredits} credits remaining
        </span>
      </div>
      <Progress
        value={maxCredits > 0 ? Math.min(100, (credits / maxCredits) * 100) : 0}
      />
    </div>
  );
}
