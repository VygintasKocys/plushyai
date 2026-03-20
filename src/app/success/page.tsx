import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful | Plushify",
  description: "Your Plushify subscription is now active. Start creating adorable plushie versions of your photos.",
};

export default async function SuccessPage() {
  await requireAuth();

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your subscription is now active. Your credits have been added to
              your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/generate">Start Creating</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
