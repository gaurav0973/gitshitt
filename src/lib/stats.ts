import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userStats } from "@/db/schema";

function startOfDayUtc(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDayUtc(b).getTime() - startOfDayUtc(a).getTime()) / msPerDay);
}

export async function recordStatsEvent(
  userId: string,
  type: "command" | "session",
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
      streakDays,
      lastActiveDate: now,
    })
    .where(eq(userStats.userId, userId));
}
