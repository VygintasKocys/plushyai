import { eq, count } from "drizzle-orm";
import { ProfileContent } from "@/components/profile-content";
import { db } from "@/lib/db";
import { user, generation } from "@/lib/schema";
import { requireAuth } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Plushify",
};

export default async function ProfilePage() {
  const session = await requireAuth();

  const [[userData], [genCount]] = await Promise.all([
    db
      .select({ credits: user.credits })
      .from(user)
      .where(eq(user.id, session.user.id)),
    db
      .select({ count: count() })
      .from(generation)
      .where(eq(generation.userId, session.user.id)),
  ]);

  return (
    <ProfileContent
      user={{
        name: session.user.name || "User",
        email: session.user.email,
        image: session.user.image,
        createdAt: session.user.createdAt.toISOString(),
      }}
      credits={userData?.credits ?? 0}
      totalGenerations={genCount?.count ?? 0}
    />
  );
}
