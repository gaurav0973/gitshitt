import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";
import { getChatUsageToday } from "@/lib/chatLimits";
import { generateChatReply } from "@/lib/openai";
import { parseChatRequestBody } from "@/lib/validators/chat";

function truncateTitle(message: string): string {
  return message.length > 40 ? `${message.slice(0, 40)}…` : message;
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();

    let parsed;
    try {
      parsed = parseChatRequestBody(body);
    } catch (error) {
      throw new ApiError(
        400,
        error instanceof Error ? error.message : "Invalid body",
      );
    }

    const usage = await getChatUsageToday(user.id, user.isPro);
    if (usage.used >= usage.limit) {
      throw new ApiError(429, "Daily chat limit reached", "daily_limit_reached");
    }

    let conversationId = parsed.conversationId;

    if (conversationId) {
      const [existing] = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(
          and(
            eq(conversations.id, conversationId),
            eq(conversations.userId, user.id),
          ),
        )
        .limit(1);
      if (!existing) {
        throw new ApiError(404, "Conversation not found");
      }
    } else {
      const [created] = await db
        .insert(conversations)
        .values({
          userId: user.id,
          mode: parsed.mode,
          title: truncateTitle(parsed.message),
        })
        .returning({ id: conversations.id });
      conversationId = created.id;
    }

    const history = await db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
      .limit(10);

    const chatHistory = history.map((item) => ({
      role: item.role as "user" | "assistant",
      content: item.content,
    }));

    chatHistory.push({ role: "user", content: parsed.message });

    const reply = await generateChatReply(
      parsed.mode,
      chatHistory,
      parsed.mode === "git" ? parsed.gitContext : undefined,
    );

    await db.insert(messages).values([
      {
        conversationId,
        role: "user",
        content: parsed.message,
      },
      {
        conversationId,
        role: "assistant",
        content: reply,
      },
    ]);

    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({
      conversationId,
      reply,
      role: "assistant",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
