"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Crown, Calendar, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MOCK_USER, CREDIT_HISTORY } from "@/lib/mock-data";

export default function ProfilePage() {
  const router = useRouter();

  const memberDate = new Date(MOCK_USER.memberSince).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <div className="grid gap-6">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {MOCK_USER.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{MOCK_USER.name}</h2>
                  <Badge variant="secondary">
                    <Crown className="h-3 w-3 mr-1" />
                    {MOCK_USER.plan}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{MOCK_USER.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {memberDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current plan and credit usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{MOCK_USER.plan} Plan</p>
                <p className="text-sm text-muted-foreground">$19/month</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next renewal</p>
                <p className="font-medium">April 1, 2026</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credits remaining</span>
                <span className="font-medium">{MOCK_USER.credits} / 100</span>
              </div>
              <Progress value={MOCK_USER.credits} />
            </div>
          </CardContent>
        </Card>

        {/* Credit History */}
        <Card>
          <CardHeader>
            <CardTitle>Credit History</CardTitle>
            <CardDescription>Recent credit activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Description</th>
                    <th className="text-right py-2 font-medium">Credits</th>
                    <th className="text-right py-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {CREDIT_HISTORY.map((entry, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="py-2">{entry.description}</td>
                      <td className={`py-2 text-right font-medium ${entry.credits > 0 ? "text-green-600 dark:text-green-400" : ""}`}>
                        {entry.credits > 0 ? `+${entry.credits}` : entry.credits}
                      </td>
                      <td className="py-2 text-right">{entry.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Display Name
                </label>
                <div className="p-3 border rounded-md bg-muted/10">
                  {MOCK_USER.name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <div className="p-3 border rounded-md bg-muted/10">
                  {MOCK_USER.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => toast.info("Account deletion requires backend implementation")}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
