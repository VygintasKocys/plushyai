import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generation } from "@/lib/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [record] = await db
    .select({
      status: generation.status,
      generatedImageUrl: generation.generatedImageUrl,
      originalImageUrl: generation.originalImageUrl,
      errorMessage: generation.errorMessage,
    })
    .from(generation)
    .where(
      and(eq(generation.id, id), eq(generation.userId, session.user.id))
    );

  if (!record) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json(record);
}
