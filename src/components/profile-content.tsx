"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Crown, Calendar, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

interface ProfileContentProps {
  user: {
    name: string;
    email: string;
    image: string | null | undefined;
    createdAt: string;
  };
  credits: number;
  totalGenerations: number;
}

export function ProfileContent({ user, credits, totalGenerations }: ProfileContentProps) {
  const router = useRouter();

  const memberDate = new Date(user.createdAt).toLocaleDateString("en-US", {
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
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {(user.name?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <Badge variant="secondary">
                    <Crown className="h-3 w-3 mr-1" />
                    Free
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
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
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">No active subscription</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credits remaining</span>
                <span className="font-medium">{credits}</span>
              </div>
              <Progress value={credits > 0 ? Math.min(100, (credits / 3) * 100) : 0} />
            </div>
            <div className="flex justify-between text-sm">
              <span>Total generations</span>
              <span className="font-medium">{totalGenerations}</span>
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
                  {user.name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <div className="p-3 border rounded-md bg-muted/10">
                  {user.email}
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
