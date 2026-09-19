import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/apiError";

export async function GET() {
  try {
    const user = await requireUser();
    const items = await db
      .select({
        id: conversations.id,
        mode: conversations.mode,
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(eq(conversations.userId, user.id))
      .orderBy(desc(conversations.updatedAt))
      .limit(20);

    return NextResponse.json({ conversations: items });
  } catch (error) {
    return handleApiError(error);
  }
}
