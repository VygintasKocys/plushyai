import { ProfileContent } from "@/components/profile-content";
import { requireAuth } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Plushify",
};

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <ProfileContent
      user={{
        name: session.user.name || "User",
        email: session.user.email,
        image: session.user.image,
        createdAt: session.user.createdAt.toISOString(),
      }}
    />
  );
}
