import Link from "next/link";
import { eq, count, and, gte } from "drizzle-orm";
import {
  Sparkles,
  ImageIcon,
  CalendarDays,
  Plus,
} from "lucide-react";
import { DashboardPlanBadge, DashboardCreditProgress } from "@/components/dashboard-plan-badge";
import { GradientPlaceholder } from "@/components/gradient-placeholder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { MOCK_GALLERY } from "@/lib/mock-data";
import { user, generation } from "@/lib/schema";
import { requireAuth } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Plushify",
};

const recentItems = MOCK_GALLERY.slice(0, 4);

export default async function DashboardPage() {
  const session = await requireAuth();
  const firstName = session.user.name?.split(" ")[0] || "there";

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [[userData], [totalGenCount], [monthlyGenCount]] = await Promise.all([
    db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id)),
    db
      .select({ count: count() })
      .from(generation)
      .where(eq(generation.userId, session.user.id)),
    db
      .select({ count: count() })
      .from(generation)
      .where(
        and(
          eq(generation.userId, session.user.id),
          gte(generation.createdAt, startOfMonth)
        )
      ),
  ]);

  const credits = userData?.credits ?? 0;
  const totalGenerations = totalGenCount?.count ?? 0;
  const monthlyGenerations = monthlyGenCount?.count ?? 0;

  const stats = [
    {
      label: "Credits Remaining",
      value: credits.toString(),
      icon: Sparkles,
    },
    {
      label: "Total Generations",
      value: totalGenerations.toString(),
      icon: ImageIcon,
    },
    {
      label: "This Month",
      value: monthlyGenerations.toString(),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {firstName}!
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <DashboardPlanBadge />
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/generate">
            <Plus className="h-5 w-5 mr-2" />
            Create New Plushie
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Credit Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCreditProgress credits={credits} />
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Generations</h2>
          <Button variant="ghost" asChild>
            <Link href="/gallery">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentItems.map((item) => (
            <Link key={item.id} href="/gallery">
              <Card className="overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all">
                <GradientPlaceholder
                  fromColor={item.afterFrom}
                  toColor={item.afterTo}
                  className="aspect-square"
                />
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.style}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
