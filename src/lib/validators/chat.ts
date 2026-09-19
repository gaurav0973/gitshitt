export type ChatMode = "git" | "general";

export interface GitContext {
  currentBranch: string;
  commitCount: number;
  lastCommand?: string;
  lastOutput?: string;
  branches: string[];
}

export interface ChatRequestBody {
  mode: ChatMode;
  message: string;
  conversationId?: string;
  gitContext?: GitContext;
}

export function parseChatRequestBody(body: unknown): ChatRequestBody {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const data = body as Record<string, unknown>;
  const mode = data.mode;
  const message = data.message;

  if (mode !== "git" && mode !== "general") {
    throw new Error('mode must be "git" or "general"');
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    throw new Error("message is required");
  }

  if (message.length > 4000) {
    throw new Error("message is too long");
  }

  const result: ChatRequestBody = {
    mode,
    message: message.trim(),
  };

  if (typeof data.conversationId === "string" && data.conversationId.length > 0) {
    result.conversationId = data.conversationId;
  }

  if (data.gitContext && typeof data.gitContext === "object") {
    const ctx = data.gitContext as Record<string, unknown>;
    result.gitContext = {
      currentBranch:
        typeof ctx.currentBranch === "string" ? ctx.currentBranch : "main",
      commitCount:
        typeof ctx.commitCount === "number" ? ctx.commitCount : 0,
      lastCommand:
        typeof ctx.lastCommand === "string" ? ctx.lastCommand : undefined,
      lastOutput:
        typeof ctx.lastOutput === "string" ? ctx.lastOutput : undefined,
      branches: Array.isArray(ctx.branches)
        ? ctx.branches.filter((b): b is string => typeof b === "string")
        : [],
    };
  }

  return result;
}
