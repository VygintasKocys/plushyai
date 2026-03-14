import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started | Plushify",
  description:
    "Step-by-step guide to creating your first plushie with Plushify.",
};

const steps = [
  {
    title: "Create an Account",
    description:
      "Sign up with your email address or use Google authentication to create your Plushify account. New accounts automatically receive 3 free credits so you can try the service before committing to a plan.",
    tip: "Use the same email across devices to keep your gallery synced.",
  },
  {
    title: "Purchase Credits",
    description:
      "Head to the Pricing page to choose a plan that fits your needs. Credits are added instantly after purchase. Basic is great for casual use, Pro for regular creators, and Elite for power users who want API access.",
    tip: "The Pro plan offers the best value at $0.19 per credit.",
  },
  {
    title: "Upload Your First Photo",
    description:
      "Navigate to the Generate page and upload any photo you want to transform. We accept JPEG, PNG, and WebP formats up to 10MB. For best results, use a well-lit photo with a clear subject.",
    tip: "Photos with a single subject and simple background produce the best results.",
  },
  {
    title: "Choose a Style",
    description:
      "Select one of five plushie styles for your transformation. Each style produces a distinctly different result:",
    substeps: [
      "Classic Plushie — Soft, cuddly plushie with rounded features and stitched details",
      "Kawaii — Adorable Japanese-inspired style with big eyes and chibi proportions",
      "Realistic Plush — Lifelike plush toy with detailed textures and natural proportions",
      "Chibi — Super-deformed style with oversized head and tiny body",
      "Vintage Teddy — Classic teddy bear style with button eyes and nostalgic charm",
    ],
  },
  {
    title: "Generate Your Plushie",
    description:
      "Click the Generate button to start the AI transformation. The process typically takes 10 to 30 seconds depending on the style and image complexity. One credit is deducted when generation begins.",
    tip: "You can cancel a generation in progress, but the credit will still be consumed.",
  },
  {
    title: "Save to Your Gallery",
    description:
      "Once you are happy with the result, save it to your personal gallery. From there you can download the image in your plan's maximum resolution, share a link, or regenerate using a different style. All saved images remain in your gallery as long as your account is active.",
    tip: "Try the same photo with multiple styles to find your favorite look.",
  },
];

export default function GettingStartedPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Getting Started</h1>
      <p className="text-muted-foreground mb-8">
        Follow these six steps to go from sign-up to your first adorable plushie.
      </p>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
              {index + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">{step.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {step.description}
              </p>
              {step.substeps && (
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-2">
                  {step.substeps.map((sub) => (
                    <li key={sub}>{sub}</li>
                  ))}
                </ul>
              )}
              {step.tip && (
                <p className="text-sm bg-primary/5 border border-primary/10 rounded-md px-3 py-2">
                  <span className="font-medium text-primary">Tip:</span>{" "}
                  {step.tip}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Button asChild>
          <Link href="/generate">Start Generating</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs/credits">Learn About Credits</Link>
        </Button>
      </div>
    </div>
  );
}
