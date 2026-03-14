import Link from "next/link";
import {
  Sparkles,
  Camera,
  Palette,
  Zap,
  Clock,
  Download,
  Upload,
  Wand2,
} from "lucide-react";
import { BeforeAfterCard } from "@/components/before-after-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_GALLERY, TESTIMONIALS, PRICING_PLANS } from "@/lib/mock-data";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced AI transforms your photos with stunning accuracy",
  },
  {
    icon: Camera,
    title: "Any Photo",
    description: "Works with selfies, pets, family photos, and more",
  },
  {
    icon: Palette,
    title: "Multiple Styles",
    description: "Choose from Classic, Kawaii, Chibi, and other styles",
  },
  {
    icon: Zap,
    title: "High Quality",
    description: "Crystal-clear results up to 4K resolution",
  },
  {
    icon: Clock,
    title: "Fast Generation",
    description: "Get your plushie version in seconds, not minutes",
  },
  {
    icon: Download,
    title: "Download & Share",
    description: "Save your creations and share them anywhere",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Upload Your Photo",
    description: "Drag and drop or select any photo of a person, pet, or group",
  },
  {
    icon: Wand2,
    title: "AI Transforms It",
    description: "Our AI converts your photo into an adorable plushie version",
  },
  {
    icon: Download,
    title: "Download & Enjoy",
    description: "Save your plushie creation in high resolution",
  },
];

const showcaseItems = MOCK_GALLERY.slice(0, 6);

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Turn Any Photo Into an{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Adorable Plushie
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of yourself, your pet, or anyone you love — our AI
            will transform it into a cute, cuddly plushie version in seconds.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Button asChild size="lg">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#showcase">See Examples</Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 max-w-md mx-auto">
          <BeforeAfterCard
            beforeFrom="#f9a8d4"
            beforeTo="#f472b6"
            afterFrom="#fbbf24"
            afterTo="#f59e0b"
          />
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            See the Magic in Action
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {showcaseItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <BeforeAfterCard
                    beforeFrom={item.beforeFrom}
                    beforeTo={item.beforeTo}
                    afterFrom={item.afterFrom}
                    afterTo={item.afterTo}
                  />
                  <p className="mt-3 text-sm font-medium text-center">
                    {item.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <step.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Loved by Thousands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {t.avatarInitial}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Credit-Based Pricing</h2>
          <p className="text-muted-foreground mb-8">
            Start free, upgrade when you need more
          </p>
          <div className="flex justify-center gap-6 flex-wrap mb-8">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.id} className="text-center">
                <p className="font-semibold">{plan.name}</p>
                <p className="text-2xl font-bold">${plan.price}</p>
                <p className="text-sm text-muted-foreground">
                  {plan.credits} credits/mo
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline">
            <Link href="/pricing">View Full Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Plushify?</h2>
          <p className="text-muted-foreground">
            Join thousands of happy users turning their favorite photos into
            adorable plushie versions.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
