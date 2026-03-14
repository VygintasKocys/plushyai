import Link from "next/link";
import { Check } from "lucide-react";
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
import { PRICING_PLANS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits | Plushify",
  description:
    "Understand how Plushify credits work, pricing tiers, and cost per feature.",
};

const creditCosts = [
  { feature: "Standard plushie generation", cost: "1 credit" },
  { feature: "HD quality upscale", cost: "1 credit" },
  { feature: "Style change (re-generation)", cost: "1 credit" },
  { feature: "Batch processing (per image)", cost: "1 credit" },
  { feature: "4K export (Elite only)", cost: "1 credit" },
];

export default function CreditsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Credits</h1>
      <p className="text-muted-foreground mb-8">
        Plushify uses a simple credit-based system. Each credit lets you perform
        one generation or transformation.
      </p>

      {/* How credits work */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">How Credits Work</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            When you subscribe to a Plushify plan, you receive a monthly
            allocation of credits. Each plushie generation consumes exactly one
            credit, regardless of the style you choose or the complexity of the
            image.
          </p>
          <p>
            Credits are added to your account immediately when your subscription
            starts or renews. You can track your remaining balance on the
            Dashboard.
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Pricing Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.credits} credits/month
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-2 text-left">
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
                  asChild
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Credit costs per feature */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Credit Costs Per Feature</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {creditCosts.map((item) => (
                <div
                  key={item.feature}
                  className="flex items-center justify-between text-sm border-b last:border-0 pb-3 last:pb-0"
                >
                  <span>{item.feature}</span>
                  <Badge variant="secondary">{item.cost}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Renewal and expiration */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Renewal &amp; Expiration
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Monthly renewal</p>
              <p>
                Credits are automatically replenished at the start of each
                billing cycle. Your renewal date is shown on your Dashboard.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">
                No rollover
              </p>
              <p>
                Unused credits do not carry over to the next billing cycle. We
                recommend using all your credits each month for the best value.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">
                Plan changes
              </p>
              <p>
                If you upgrade mid-cycle, the difference in credits is added
                immediately. Downgrades take effect at the next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
