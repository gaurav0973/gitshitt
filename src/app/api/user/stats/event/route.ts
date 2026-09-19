import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";
import { recordStatsEvent } from "@/lib/stats";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { type?: unknown };

    if (body.type !== "command" && body.type !== "session") {
      throw new ApiError(400, 'type must be "command" or "session"');
    }

    await recordStatsEvent(user.id, body.type);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
