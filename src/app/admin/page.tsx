import { Shield, Users, Activity, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Plushify",
};

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-lg bg-primary/10 p-2">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Signed in as {session.user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Generations</p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System</p>
                <p className="text-2xl font-bold">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the admin panel. You have access because your account has the
            admin role. More admin features can be added here as needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
