import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { ApiError, handleApiError } from "@/lib/apiError";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, user.id)))
      .limit(1);

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    const thread = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        mode: conversation.mode,
        title: conversation.title,
      },
      messages: thread,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
