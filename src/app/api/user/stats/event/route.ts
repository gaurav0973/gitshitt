import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";
import { recordStatsEvent } from "@/lib/stats";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { type?: unknown };

    if (
      body.type !== "command" &&
      body.type !== "session" &&
      body.type !== "demo"
    ) {
      throw new ApiError(
        400,
        'type must be "command", "session", or "demo"',
      );
    }

    await recordStatsEvent(user.id, body.type, user.isPro);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
