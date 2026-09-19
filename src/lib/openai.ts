import OpenAI from "openai";
import { buildGitTutorSystemPrompt } from "@/lib/prompts/gitTutor";
import { GENERAL_ASSISTANT_PROMPT } from "@/lib/prompts/general";
import type { ChatMode, GitContext } from "@/lib/validators/chat";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildChatInput(
  mode: ChatMode,
  history: ChatMessage[],
  gitContext?: GitContext,
) {
  const systemPrompt =
    mode === "git"
      ? buildGitTutorSystemPrompt(gitContext)
      : GENERAL_ASSISTANT_PROMPT;

  return [
    { role: "system" as const, content: systemPrompt },
    ...history.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

export async function* streamChatReply(
  mode: ChatMode,
  history: ChatMessage[],
  gitContext?: GitContext,
): AsyncGenerator<string> {
  const client = getOpenAIClient();
  const stream = await client.responses.create({
    model: "gpt-4o-mini",
    input: buildChatInput(mode, history, gitContext),
    max_output_tokens: 600,
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      yield event.delta;
    }
  }
}
