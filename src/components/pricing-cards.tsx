"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient, useSession } from "@/lib/auth-client";
import { PRICING_PLANS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ctaLabels: Record<string, string> = {
  basic: "Get Started",
  pro: "Go Pro",
  elite: "Go Elite",
};

export function PricingCards() {
  const { data: session } = useSession();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  async function handleCheckout(planSlug: string) {
    if (!session) {
      router.push("/register");
      return;
    }

    setCheckoutLoading(planSlug);
    try {
      await authClient.checkout({ slug: planSlug });
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
      {PRICING_PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "relative flex flex-col",
            plan.popular && "border-primary ring-2 ring-primary/20"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Most Popular</Badge>
            </div>
          )}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.credits} credits/month</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 text-center">
            <div className="mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 text-left">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              disabled={checkoutLoading !== null}
              onClick={() => handleCheckout(plan.id)}
            >
              {checkoutLoading === plan.id
                ? "Redirecting..."
                : ctaLabels[plan.id] || "Get Started"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
