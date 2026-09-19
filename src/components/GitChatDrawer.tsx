"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PillTab } from "@/components/playful/buttons";
import type { GitContext } from "@/lib/validators/chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GitChatDrawerProps {
  open: boolean;
  onClose: () => void;
  gitContext: GitContext;
  chatLimit?: number;
  chatUsed?: number;
}

export function GitChatDrawer({
  open,
  onClose,
  gitContext,
  chatLimit,
  chatUsed,
}: GitChatDrawerProps) {
  const [mode, setMode] = useState<"git" | "general">("git");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          message: trimmed,
          conversationId,
          gitContext: mode === "git" ? gitContext : undefined,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        conversationId?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Chat failed");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply ?? "" },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20">
      <button
        type="button"
        aria-label="Close chat"
        className="flex-1"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-md flex-col border-l-2 border-foreground bg-card shadow-pop-lg">
        <div className="flex items-center justify-between border-b-2 border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold">Ask gitshitt</h2>
            {chatLimit !== undefined && chatUsed !== undefined ? (
              <p className="text-xs text-muted-foreground">
                {chatUsed}/{chatLimit} messages today
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-foreground px-3 py-1 text-sm font-bold"
          >
            Close
          </button>
        </div>

        <div className="flex gap-2 border-b-2 border-border px-5 py-3">
          <PillTab active={mode === "git"} onClick={() => setMode("git")}>
            Git tutor
          </PillTab>
          <PillTab
            active={mode === "general"}
            onClick={() => setMode("general")}
          >
            General
          </PillTab>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask about Git commands, errors, or what to try next in the sandbox.
            </p>
          ) : null}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "max-w-[85%] rounded-2xl border-2 border-border px-4 py-3 text-sm",
                message.role === "user" ? "ml-auto bg-muted" : "bg-card",
              )}
            >
              {message.content}
            </div>
          ))}
          {loading ? (
            <p className="text-xs text-muted-foreground">Thinking…</p>
          ) : null}
          {error ? (
            <p className="text-xs font-semibold text-red-600">{error}</p>
          ) : null}
        </div>

        <div className="border-t-2 border-border p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder={
                mode === "git"
                  ? "Why did my merge fail?"
                  : "Ask anything about gitshitt…"
              }
              className="flex-1 rounded-xl border-2 border-foreground bg-background px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              className="rounded-full border-2 border-foreground bg-accent px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
