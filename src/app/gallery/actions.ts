"use server";

import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generation } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";

export async function getGalleryItems() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "unauthorized" as const };
  }

  const items = await db
    .select()
    .from(generation)
    .where(eq(generation.userId, session.user.id))
    .orderBy(desc(generation.createdAt));

  return { items };
}

export async function deleteGalleryItem(generationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "unauthorized" as const };
  }

  const [record] = await db
    .select()
    .from(generation)
    .where(
      and(
        eq(generation.id, generationId),
        eq(generation.userId, session.user.id)
      )
    );

  if (!record) {
    return { error: "not_found" as const };
  }

  // Delete DB record first to avoid orphaned records if storage cleanup fails
  await db
    .delete(generation)
    .where(eq(generation.id, generationId));

  // Best-effort storage cleanup — don't fail the request if files are already gone
  await Promise.allSettled([
    deleteFile(record.originalImageUrl),
    deleteFile(record.generatedImageUrl),
  ]);

  return { success: true as const };
}
