import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";
import { getChatUsageToday } from "@/lib/chatLimits";
import { getDailyUsageFromStats } from "@/lib/commandLimits";

export async function GET() {
  try {
    const user = await requireUser();
    const chatUsage = await getChatUsageToday(user.id, user.isPro);
    const dailyUsage = getDailyUsageFromStats(user.stats, user.isPro);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isPro: user.isPro,
      stats: {
        sessionCount: user.stats?.sessionCount ?? 0,
        commandCount: user.stats?.commandCount ?? 0,
        streakDays: user.stats?.streakDays ?? 0,
      },
      limits: {
        chatMessagesToday: chatUsage.used,
        chatDailyLimit: chatUsage.limit,
        commandsUsedToday: dailyUsage.commandsUsedToday,
        commandDailyLimit: dailyUsage.commandDailyLimit,
        demosUsedToday: dailyUsage.demosUsedToday,
        demoDailyLimit: dailyUsage.demoDailyLimit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { name?: unknown };

    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      throw new ApiError(400, "name is required");
    }

    const name = body.name.trim().slice(0, 120);
    const [updated] = await db
      .update(users)
      .set({ name, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      isPro: updated.isPro,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
