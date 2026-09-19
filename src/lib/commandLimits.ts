import type { UserStats } from "@/db/schema";
import { commandDailyLimit, demoDailyLimit } from "@/lib/entitlements";

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
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

export function getDailyUsageFromStats(
  stats: UserStats | null,
  isPro: boolean,
): {
  commandsUsedToday: number;
  commandDailyLimit: number;
  demosUsedToday: number;
  demoDailyLimit: number;
} {
  const today = startOfTodayUtc();
  const resetToday = stats?.usageResetDate
    ? isSameUtcDay(stats.usageResetDate, today)
    : false;

  return {
    commandsUsedToday: resetToday ? (stats?.dailyCommandCount ?? 0) : 0,
    commandDailyLimit: commandDailyLimit(isPro),
    demosUsedToday: resetToday ? (stats?.dailyDemoCount ?? 0) : 0,
    demoDailyLimit: demoDailyLimit(isPro),
  };
}
