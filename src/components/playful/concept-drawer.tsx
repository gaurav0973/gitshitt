"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LightbulbIcon, ArrowRightIcon } from "./icons";
import { PillTab } from "./buttons";
import type { GitContext } from "@/lib/validators/chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ConceptIntuitionFabProps {
  gitContext: GitContext;
  isSignedIn: boolean;
  chatLimit?: number;
  chatUsed?: number;
  onChatSent?: () => void;
}

function ConceptIntuitionDrawer({
  open,
  onClose,
  gitContext,
  chatLimit,
  chatUsed,
  onChatSent,
}: {
  open: boolean;
  onClose: () => void;
  gitContext: GitContext;
  chatLimit?: number;
  chatUsed?: number;
  onChatSent?: () => void;
}) {
  const [mode, setMode] = useState<"git" | "general">("git");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!open) {
    return null;
  }

  const atChatLimit =
    chatLimit !== undefined &&
    chatUsed !== undefined &&
    chatUsed >= chatLimit;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || atChatLimit) {
      return;
    }

    setLoading(true);
    setError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);

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

      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        setMessages((prev) => prev.slice(0, -1));
        if (response.status === 401) {
          throw new Error("Please sign in to use chat");
        }
        if (contentType.includes("application/json")) {
          const data = (await response.json()) as {
            error?: string;
            code?: string;
          };
          if (response.status === 429 || data.code === "daily_limit_reached") {
            throw new Error("Daily chat limit reached. Try again tomorrow.");
          }
          throw new Error(data.error ?? "Chat failed");
        }
        throw new Error("Chat failed");
      }

      if (!response.body) {
        throw new Error("No response stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data: ")) {
            continue;
          }

          type StreamEvent =
            | { type: "conversation"; conversationId?: string }
            | { type: "delta"; text?: string }
            | { type: "done"; reply?: string }
            | { type: "error"; error?: string };

          const data = JSON.parse(line.slice(6)) as StreamEvent;

          switch (data.type) {
            case "conversation":
              if (data.conversationId) {
                setConversationId(data.conversationId);
              }
              break;
            case "delta":
              if (data.text) {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last?.role === "assistant") {
                    next[next.length - 1] = {
                      ...last,
                      content: last.content + data.text,
                    };
                  }
                  return next;
                });
              }
              break;
            case "done":
              if (data.reply) {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last?.role === "assistant") {
                    next[next.length - 1] = { ...last, content: data.reply ?? "" };
                  }
                  return next;
                });
              }
              break;
            case "error":
              throw new Error(data.error ?? "Chat stream failed");
            default: {
              const unknownType: never = data;
              void unknownType;
            }
          }
        }
      }

      onChatSent?.();
    } catch (err) {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content.length === 0) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setError(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20">
      <button
        type="button"
        aria-label="Close drawer"
        className="flex-1"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-md flex-col border-l-2 border-foreground bg-card shadow-pop-lg">
        <div className="flex items-center justify-between border-b-2 border-border px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold">Concept Intuition</h2>
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
              Ask about Git commands, merge shapes, or what to try next in the
              sandbox.
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
              {message.content ||
                (loading && message.role === "assistant" ? (
                  <span className="text-muted-foreground">Thinking…</span>
                ) : (
                  ""
                ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
          {error ? (
            <p className="text-xs font-semibold text-red-600">{error}</p>
          ) : null}
        </div>

        <div className="border-t-2 border-border p-4">
          {atChatLimit ? (
            <p className="mb-3 text-xs font-semibold text-red-600">
              Daily chat limit reached. Upgrade to Pro for more messages.
            </p>
          ) : null}
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
                atChatLimit
                  ? "Daily limit reached"
                  : "Ask about what just happened…"
              }
              disabled={atChatLimit}
              className="input-field flex-1 text-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim() || atChatLimit}
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

export function ConceptIntuitionFab({
  gitContext,
  isSignedIn,
  chatLimit,
  chatUsed,
  onChatSent,
}: ConceptIntuitionFabProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!isSignedIn) {
            window.location.href = "/sign-in";
            return;
          }
          setOpen(true);
        }}
        aria-label="Open Concept Intuition — ask a first-principles question"
        title="Concept Intuition — First Principles"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border-2 border-foreground bg-card py-1.5 pl-1.5 pr-4 shadow-pop transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1E293B] active:translate-y-0.5 active:shadow-[2px_2px_0_0_#1E293B]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-tertiary text-foreground">
          <LightbulbIcon />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="font-heading text-sm font-bold text-foreground">
            Ask
          </span>
          <span className="hidden text-[10px] font-medium text-muted-foreground sm:inline">
            Concept intuition
          </span>
        </span>
        <ArrowRightIcon size={14} className="ml-1 hidden text-foreground sm:inline" />
      </button>

      <ConceptIntuitionDrawer
        open={open}
        onClose={() => setOpen(false)}
        gitContext={gitContext}
        chatLimit={chatLimit}
        chatUsed={chatUsed}
        onChatSent={onChatSent}
      />
    </>
  );
}

/** @deprecated Use ConceptIntuitionFab */
export const ConceptIntuitionBanner = ConceptIntuitionFab;
