import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userStats } from "@/db/schema";
import { ApiError } from "@/lib/apiError";
import {
  commandDailyLimit,
  demoDailyLimit,
} from "@/lib/entitlements";

function startOfDayUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round(
    (startOfDayUtc(b).getTime() - startOfDayUtc(a).getTime()) / msPerDay,
  );
}

function isSameUtcDay(a: Date | null | undefined, b: Date): boolean {
  if (!a) {
    return false;
  }
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export async function recordStatsEvent(
  userId: string,
  type: "command" | "session" | "demo",
  isPro: boolean,
): Promise<void> {
  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  if (!stats) {
    return;
  }

  const now = new Date();
  const today = startOfDayUtc(now);
  const resetToday = isSameUtcDay(stats.usageResetDate, today);

  const dailyCommandCount = resetToday ? stats.dailyCommandCount : 0;
  const dailyDemoCount = resetToday ? stats.dailyDemoCount : 0;

  if (type === "command" && !isPro) {
    const limit = commandDailyLimit(isPro);
    if (dailyCommandCount >= limit) {
      throw new ApiError(
        429,
        "Daily git command limit reached",
        "daily_command_limit_reached",
      );
    }
  }

  if (type === "demo" && !isPro) {
    const limit = demoDailyLimit(isPro);
    if (dailyDemoCount >= limit) {
      throw new ApiError(
        429,
        "Daily demo limit reached",
        "daily_demo_limit_reached",
      );
    }
  }

  let streakDays = stats.streakDays;

  if (stats.lastActiveDate) {
    const gap = daysBetween(stats.lastActiveDate, now);
    if (gap === 0) {
      // same day, keep streak
    } else if (gap === 1) {
      streakDays += 1;
    } else {
      streakDays = 1;
    }
  } else {
    streakDays = 1;
  }

  await db
    .update(userStats)
    .set({
      commandCount:
        type === "command" ? stats.commandCount + 1 : stats.commandCount,
      sessionCount:
        type === "session" ? stats.sessionCount + 1 : stats.sessionCount,
      dailyCommandCount:
        type === "command" ? dailyCommandCount + 1 : dailyCommandCount,
      dailyDemoCount: type === "demo" ? dailyDemoCount + 1 : dailyDemoCount,
      usageResetDate: today,
      streakDays,
      lastActiveDate: now,
    })
    .where(eq(userStats.userId, userId));
}
