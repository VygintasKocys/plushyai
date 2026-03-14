import Link from "next/link";
import { BookOpen, Coins, HelpCircle, Code } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | Plushify",
  description:
    "Learn how to use Plushify to transform your photos into adorable plushie versions.",
};

const docSections = [
  {
    href: "/docs",
    label: "Getting Started",
    description:
      "Create your account, upload a photo, and generate your first plushie in minutes.",
    icon: BookOpen,
  },
  {
    href: "/docs/credits",
    label: "Credits",
    description:
      "Understand the credit system, pricing tiers, and how credits are consumed.",
    icon: Coins,
  },
  {
    href: "/docs/faq",
    label: "FAQ",
    description:
      "Answers to the most frequently asked questions about Plushify.",
    icon: HelpCircle,
  },
  {
    href: "/docs/api",
    label: "API Reference",
    description:
      "Integrate Plushify into your own applications with our REST API.",
    icon: Code,
  },
];

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Documentation</h1>
      <p className="text-muted-foreground mb-8">
        Everything you need to know about transforming your photos into adorable
        plushies with Plushify.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {docSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full hover:ring-2 hover:ring-primary/20 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <section.icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Inline Getting Started guide */}
      <GettingStartedContent />
    </div>
  );
}

function GettingStartedContent() {
  const steps = [
    {
      title: "Create an Account",
      description:
        "Sign up with your email address or use Google to create your Plushify account. New accounts receive 3 free credits to try the service.",
    },
    {
      title: "Choose a Plan",
      description:
        "Pick the plan that fits your needs. Basic is great for casual users, Pro for regular creators, and Elite for power users and teams.",
    },
    {
      title: "Upload a Photo",
      description:
        "Navigate to the Generate page and upload any photo. We support JPEG, PNG, and WebP formats up to 10MB.",
    },
    {
      title: "Pick a Style",
      description:
        "Choose from five plushie styles: Classic Plushie, Kawaii, Realistic Plush, Chibi, or Vintage Teddy. Each style gives a unique look.",
    },
    {
      title: "Generate Your Plushie",
      description:
        "Hit the generate button and watch the AI transform your photo. Results are typically ready in 10-30 seconds depending on the style.",
    },
    {
      title: "Save to Gallery",
      description:
        "Love the result? Save it to your gallery. You can download, share, or regenerate with a different style at any time.",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              {index + 1}
            </div>
            <div>
              <h3 className="font-medium mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
