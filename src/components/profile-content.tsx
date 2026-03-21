"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Mail, AlertTriangle, Receipt, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PlanBadge, usePlanState } from "@/components/plan-badge";
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
import { authClient } from "@/lib/auth-client";

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

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  currency: string;
  billingReason: string;
  product: { name: string } | null;
}

export function ProfileContent({ user, credits, totalGenerations }: ProfileContentProps) {
  const router = useRouter();
  const { planName, planCredits, isLoading, subscription } = usePlanState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    authClient.customer.orders
      .list({ query: { page: 1, limit: 20 } })
      .then((response: any) => {
        const data = response?.data;
        let items: Order[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data?.result?.items) {
          items = data.result.items;
        } else if (data?.items) {
          items = data.items;
        }
        setOrders(items);
      })
      .catch(() => {
        // Polar may not be configured
      })
      .finally(() => setOrdersLoading(false));
  }, []);

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
                  <PlanBadge planName={planName} isLoading={isLoading} />
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
                <p className="font-medium">{planName} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {subscription ? "Active" : "No active subscription"}
                </p>
              </div>
              {subscription ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => authClient.customer.portal()}
                >
                  Manage Subscription
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/pricing">Upgrade Plan</Link>
                </Button>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credits remaining</span>
                <span className="font-medium">{credits} / {planCredits}</span>
              </div>
              <Progress value={planCredits > 0 ? Math.min(100, (credits / planCredits) * 100) : 0} />
            </div>
            <div className="flex justify-between text-sm">
              <span>Total generations</span>
              <span className="font-medium">{totalGenerations}</span>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>Your purchases and subscription payments</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => authClient.customer.portal()}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Billing Portal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading transactions...
              </div>
            ) : !Array.isArray(orders) || orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Your purchases will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {order.product?.name ?? "Purchase"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {order.billingReason === "subscription_cycle"
                          ? "Renewal"
                          : order.billingReason === "subscription_create"
                            ? "Subscription"
                            : "Purchase"}
                      </Badge>
                      <span className="font-medium text-sm">
                        {(order.totalAmount / 100).toLocaleString("en-US", {
                          style: "currency",
                          currency: order.currency || "USD",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
