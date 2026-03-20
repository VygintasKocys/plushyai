"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { PRICING_PLANS } from "@/lib/mock-data";

interface PlanState {
  planName: string;
  planCredits: number;
  isLoading: boolean;
  subscription: { id: string; productId: string; status: string } | null;
}

export function usePlanState(): PlanState {
  const [state, setState] = useState<PlanState>({
    planName: "Free",
    planCredits: 3,
    isLoading: true,
    subscription: null,
  });

  useEffect(() => {
    authClient.customer
      .state()
      .then(({ data }) => {
        const activeSub = data?.activeSubscriptions?.[0];

        if (activeSub) {
          const plan = PRICING_PLANS.find(
            (p) => p.polarProductId === activeSub.productId
          );
          setState({
            planName: plan?.name ?? "Free",
            planCredits: plan?.credits ?? 3,
            isLoading: false,
            subscription: {
              id: activeSub.id,
              productId: activeSub.productId,
              status: activeSub.status,
            },
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      })
      .catch(() => {
        setState((prev) => ({ ...prev, isLoading: false }));
      });
  }, []);

  return state;
}

export function PlanBadge({ planName, isLoading }: { planName: string; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        <Crown className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      <Crown className="h-3 w-3 mr-1" />
      {planName}
    </Badge>
  );
}
