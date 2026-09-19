import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { savedSessions } from "@/db/schema";
import { requireProUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";
import { parseSaveSessionBody } from "@/lib/validators/session";

export async function GET() {
  try {
    const user = await requireProUser();
    const sessions = await db
      .select({
        id: savedSessions.id,
        name: savedSessions.name,
        createdAt: savedSessions.createdAt,
        updatedAt: savedSessions.updatedAt,
      })
      .from(savedSessions)
      .where(eq(savedSessions.userId, user.id))
      .orderBy(desc(savedSessions.updatedAt));

    return NextResponse.json({ sessions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireProUser();
    const body = await request.json();

    let parsed;
    try {
      parsed = parseSaveSessionBody(body);
    } catch (error) {
      throw new ApiError(
        400,
        error instanceof Error ? error.message : "Invalid body",
      );
    }

    const [session] = await db
      .insert(savedSessions)
      .values({
        userId: user.id,
        name: parsed.name,
        gitState: parsed.gitState,
      })
      .returning({
        id: savedSessions.id,
        name: savedSessions.name,
        createdAt: savedSessions.createdAt,
        updatedAt: savedSessions.updatedAt,
      });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
