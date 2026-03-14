"use client";

import Link from "next/link";
import {
  Sparkles,
  ImageIcon,
  CalendarDays,
  Crown,
  Plus,
} from "lucide-react";
import { GradientPlaceholder } from "@/components/gradient-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_USER, MOCK_GALLERY } from "@/lib/mock-data";

const stats = [
  {
    label: "Credits Remaining",
    value: `${MOCK_USER.credits}/100`,
    icon: Sparkles,
  },
  {
    label: "Total Generations",
    value: MOCK_USER.totalGenerations.toString(),
    icon: ImageIcon,
  },
  {
    label: "This Month",
    value: "8",
    icon: CalendarDays,
  },
  {
    label: "Plan",
    value: MOCK_USER.plan,
    icon: Crown,
  },
];

const recentItems = MOCK_GALLERY.slice(0, 4);

export default function DashboardPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {MOCK_USER.name.split(" ")[0]}!
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="font-medium">
              <Crown className="h-3 w-3 mr-1" />
              {MOCK_USER.plan} Plan
            </Badge>
          </div>
        </div>
        <Button asChild size="lg">
          <Link href="/generate">
            <Plus className="h-5 w-5 mr-2" />
            Create New Plushie
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {MOCK_USER.credits} of 100 credits remaining
              </span>
              <span className="font-medium">{MOCK_USER.credits}%</span>
            </div>
            <Progress value={MOCK_USER.credits} />
          </div>
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
