import Link from "next/link";
import { Code, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference | Plushify",
  description:
    "Plushify REST API documentation for integrating plushie generation into your applications.",
};

const plannedEndpoints = [
  {
    method: "POST",
    path: "/api/v1/generate",
    description: "Submit a photo for plushie transformation",
  },
  {
    method: "GET",
    path: "/api/v1/generations/:id",
    description: "Check generation status and retrieve results",
  },
  {
    method: "GET",
    path: "/api/v1/gallery",
    description: "List all saved gallery items",
  },
  {
    method: "GET",
    path: "/api/v1/credits",
    description: "Check current credit balance",
  },
  {
    method: "GET",
    path: "/api/v1/styles",
    description: "List available plushie styles",
  },
];

export default function ApiPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">API Reference</h1>
      <p className="text-muted-foreground mb-8">
        Integrate Plushify&apos;s plushie generation into your own applications
        with our REST API.
      </p>

      {/* Elite plan callout */}
      <Card className="border-primary/30 bg-primary/5 mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">
                Available on the Elite Plan
              </p>
              <p className="text-sm text-muted-foreground">
                API access is exclusively available to Elite plan subscribers.
                Upgrade your plan to unlock programmatic access to all Plushify
                features.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming soon */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">API Documentation</CardTitle>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <CardDescription>
            We are actively developing the Plushify REST API. Comprehensive
            documentation with code examples, authentication guides, and SDKs
            will be available here once the API launches.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Planned endpoints */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Planned Endpoints</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {plannedEndpoints.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="flex items-start gap-3 border-b last:border-0 pb-3 last:pb-0"
                >
                  <Badge
                    variant="outline"
                    className="font-mono text-xs shrink-0 mt-0.5"
                  >
                    {endpoint.method}
                  </Badge>
                  <div>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {endpoint.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
