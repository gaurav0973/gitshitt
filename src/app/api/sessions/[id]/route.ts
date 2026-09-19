import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { savedSessions } from "@/db/schema";
import { requireProUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireProUser();
    const { id } = await params;

    const [session] = await db
      .select()
      .from(savedSessions)
      .where(and(eq(savedSessions.id, id), eq(savedSessions.userId, user.id)))
      .limit(1);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    return NextResponse.json({ session });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireProUser();
    const { id } = await params;

    const [deleted] = await db
      .delete(savedSessions)
      .where(and(eq(savedSessions.id, id), eq(savedSessions.userId, user.id)))
      .returning({ id: savedSessions.id });

    if (!deleted) {
      throw new ApiError(404, "Session not found");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
