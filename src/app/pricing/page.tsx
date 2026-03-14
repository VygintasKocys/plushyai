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
  title: "Pricing | Plushify",
  description:
    "Simple, credit-based pricing for Plushify. Choose from Basic, Pro, or Elite plans.",
};

const faqs = [
  {
    q: "What is a credit?",
    a: "Each credit lets you generate one plushie version of a photo. Different plans include different numbers of credits per month.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Do unused credits roll over?",
    a: "No, credits reset at the start of each billing cycle. We encourage you to use all your credits each month!",
  },
  {
    q: "Is there a free trial?",
    a: "New users get 3 free credits to try Plushify before choosing a plan.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and PayPal.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 7-day money-back guarantee on all plans if you're not satisfied.",
  },
];

const ctaLabels: Record<string, string> = {
  basic: "Get Started",
  pro: "Go Pro",
  elite: "Go Elite",
};

export default function PricingPage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Credit-Based Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Pay for what you use. Each credit generates one adorable plushie
            version of your photo.
          </p>
        </div>

        {/* Pricing Cards */}
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
                  asChild
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/register">
                    {ctaLabels[plan.id] || "Get Started"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* How Credits Work */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            How Credits Work
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                1
              </div>
              <div>
                <p className="font-medium">1 credit = 1 generation</p>
                <p className="text-sm text-muted-foreground">
                  Each plushie transformation uses exactly one credit, regardless
                  of style or settings.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Credits reset monthly</p>
                <p className="text-sm text-muted-foreground">
                  Your credit balance refreshes at the start of each billing
                  cycle.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                3
              </div>
              <div>
                <p className="font-medium">
                  Unused credits don&apos;t roll over
                </p>
                <p className="text-sm text-muted-foreground">
                  Make the most of your plan each month — credits expire when
                  your billing cycle resets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border rounded-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-medium hover:bg-muted/50 transition-colors">
                  {faq.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
