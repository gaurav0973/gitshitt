import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";
import { getChatUsageToday } from "@/lib/chatLimits";
import { streamChatReply } from "@/lib/openai";
import { parseChatRequestBody } from "@/lib/validators/chat";

function truncateTitle(message: string): string {
  return message.length > 40 ? `${message.slice(0, 40)}…` : message;
}

function encodeSse(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
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

    await db.insert(messages).values({
      conversationId,
      role: "user",
      content: parsed.message,
    });

    const stream = new ReadableStream({
      async start(controller) {
        let fullReply = "";

        try {
          controller.enqueue(
            encodeSse({ type: "conversation", conversationId }),
          );

          for await (const delta of streamChatReply(
            parsed.mode,
            chatHistory,
            parsed.mode === "git" ? parsed.gitContext : undefined,
          )) {
            fullReply += delta;
            controller.enqueue(encodeSse({ type: "delta", text: delta }));
          }

          const reply = fullReply.trim();
          if (!reply) {
            throw new Error("Empty response from OpenAI");
          }

          await db.insert(messages).values({
            conversationId,
            role: "assistant",
            content: reply,
          });

          await db
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, conversationId));

          controller.enqueue(encodeSse({ type: "done", reply }));
          controller.close();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Chat stream failed";
          controller.enqueue(encodeSse({ type: "error", error: message }));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
