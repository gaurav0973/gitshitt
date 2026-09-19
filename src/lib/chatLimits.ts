import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { chatDailyLimit } from "@/lib/entitlements";

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getChatUsageToday(
  userId: string,
  isPro: boolean,
): Promise<{ used: number; limit: number }> {
  const limit = chatDailyLimit(isPro);
  const start = startOfTodayUtc();

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .where(
      and(
        eq(conversations.userId, userId),
        eq(messages.role, "user"),
        gte(messages.createdAt, start),
      ),
    );

  return {
    used: result?.count ?? 0,
    limit,
  };
}
