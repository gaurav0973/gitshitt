import OpenAI from "openai";
import { buildGitTutorSystemPrompt } from "@/lib/prompts/gitTutor";
import { GENERAL_ASSISTANT_PROMPT } from "@/lib/prompts/general";
import type { ChatMode, GitContext } from "@/lib/validators/chat";

function getOpenAIClient(): OpenAI {
  const apiKey =
    process.env.OPENAI_API_KEY ?? process.env.OPENA_AI_SECRET ?? "";
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChatReply(
  mode: ChatMode,
  history: ChatMessage[],
  gitContext?: GitContext,
): Promise<string> {
  const systemPrompt =
    mode === "git"
      ? buildGitTutorSystemPrompt(gitContext)
      : GENERAL_ASSISTANT_PROMPT;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
    max_tokens: 600,
  });

  const reply = response.choices[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error("Empty response from OpenAI");
  }

  return reply;
}
