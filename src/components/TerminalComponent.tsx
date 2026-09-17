"use client";

import React, { useRef, useEffect } from "react";
import { PrimaryButton } from "@/components/playful/buttons";

export interface TerminalOutput {
  type: "command" | "success" | "error" | "info";
  text: string;
  timestamp: number;
}

export interface TerminalProps {
  onCommand: (command: string) => Promise<TerminalOutput>;
  placeholder?: string;
  helpText?: string;
  fontSize?: number;
  refocusOnEnter?: boolean;
}

const TERMINAL_COLORS = {
  command: "#34D399",
  error: "#F87171",
  info: "#FBBF24",
  branch: "#A78BFA",
  hash: "#FBBF24",
  message: "#F472B6",
  muted: "#CBD5E1",
  body: "#E2E8F0",
  merge: "#67E8F9",
} as const;

function colorizeOutputLine(
  text: string,
  type: TerminalOutput["type"],
): React.ReactNode {
  switch (type) {
    case "command":
      return <span style={{ color: TERMINAL_COLORS.command }}>{text}</span>;
    case "error":
      return <span style={{ color: TERMINAL_COLORS.error }}>{text}</span>;
    case "info":
      return <span style={{ color: TERMINAL_COLORS.info }}>{text}</span>;
    case "success":
      break;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }

  const commitMatch = text.match(/^\[([^\s\]]+)\s+([A-Fa-f0-9]+)\]\s+(.*)$/);
  if (commitMatch) {
    const [, branch, hash, message] = commitMatch;
    return (
      <>
        <span style={{ color: TERMINAL_COLORS.muted }}>[</span>
        <span style={{ color: TERMINAL_COLORS.branch }}>{branch}</span>
        <span style={{ color: TERMINAL_COLORS.muted }}> </span>
        <span style={{ color: TERMINAL_COLORS.hash }}>{hash}</span>
        <span style={{ color: TERMINAL_COLORS.muted }}>] </span>
        <span style={{ color: TERMINAL_COLORS.message }}>{message}</span>
      </>
    );
  }

  if (text.startsWith("Merge ") || text.startsWith("Merged ")) {
    return <span style={{ color: TERMINAL_COLORS.merge }}>{highlightQuoted(text)}</span>;
  }

  if (text.startsWith("Fast-forward merged ")) {
    return (
      <span style={{ color: TERMINAL_COLORS.merge }}>
        {highlightQuoted(text)}
      </span>
    );
  }

  return <span style={{ color: TERMINAL_COLORS.body }}>{highlightQuoted(text)}</span>;
}

function highlightQuoted(text: string): React.ReactNode {
  const parts = text.split(/('[^']*')/g);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    part.startsWith("'") && part.endsWith("'") ? (
      <span key={`${part}-${index}`} style={{ color: TERMINAL_COLORS.branch }}>
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function renderOutputText(text: string, type: TerminalOutput["type"]) {
  const lines = text.split("\n");
  if (lines.length === 1) {
    return colorizeOutputLine(text, type);
  }

  return lines.map((line, index) => (
    <div key={`${line}-${index}`}>{colorizeOutputLine(line, type)}</div>
  ));
}

export const TerminalComponent = React.forwardRef<
  TerminalHandle,
  TerminalProps
>(
  (
    {
      onCommand,
      placeholder = "git status",
      helpText = "Type real git commands in this sandbox.",
      fontSize = 14,
      refocusOnEnter = true,
    },
    ref,
  ) => {
    const [history, setHistory] = React.useState<TerminalOutput[]>([]);
    const [currentCommand, setCurrentCommand] = React.useState("");
    const [commandHistory, setCommandHistory] = React.useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = React.useState<number>(-1);
    const [isLoading, setIsLoading] = React.useState(false);
    const historyEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    React.useImperativeHandle(ref, () => ({
      clearHistory: () => setHistory([]),
      addOutput: (output: TerminalOutput) => {
        setHistory((prev) => [...prev, output]);
      },
      focus: () => inputRef.current?.focus(),
      setInput: (value: string) => setCurrentCommand(value),
      executeCurrentInput: () => {
        if (currentCommand.trim() && !isLoading) {
          handleCommandSubmit(new Event("submit") as unknown as React.FormEvent);
        }
      },
    }));

    const handleCommandSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentCommand.trim() || isLoading) return;

      const command = currentCommand.trim();

      setHistory((prev) => [
        ...prev,
        { type: "command", text: `$ ${command}`, timestamp: Date.now() },
      ]);

      setCommandHistory((prev) => [...prev, command]);
      setHistoryIndex(-1);
      setCurrentCommand("");

      setIsLoading(true);
      try {
        const output = await onCommand(command);
        setHistory((prev) => [...prev, output]);
      } catch (err) {
        setHistory((prev) => [
          ...prev,
          {
            type: "error",
            text: err instanceof Error ? err.message : "Unknown error",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
        if (refocusOnEnter) {
          requestAnimationFrame(() => inputRef.current?.focus());
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex =
          historyIndex === -1 ? commandHistory.length - 1 : historyIndex - 1;
        if (newIndex >= 0) {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
      }
    };

    return (
      <div className="terminal-sticker">
        <div className="terminal-sticker-header">
          <span className="size-2.5 rounded-full bg-[#EF4444]" />
          <span className="size-2.5 rounded-full bg-[#FBBF24]" />
          <span className="size-2.5 rounded-full bg-[#34D399]" />
        </div>

        <div className="terminal-sticker-body flex flex-col text-slate-200">
          <div className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3">
            {helpText && history.length === 0 && (
              <p className="text-sm leading-relaxed text-slate-300">{helpText}</p>
            )}
            {history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="font-mono leading-relaxed"
                style={{ fontSize }}
              >
                {renderOutputText(item.text, item.type)}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>

          <form
            onSubmit={handleCommandSubmit}
            className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5"
          >
            <span className="font-mono text-sm font-bold text-[#34D399]">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#172033] px-3 py-2 font-mono text-sm text-white placeholder:text-slate-400 outline-none focus:border-accent disabled:opacity-50"
              style={{ fontSize }}
              // biome-ignore lint/a11y/noAutofocus: terminal should focus on load
              autoFocus
            />
            <PrimaryButton
              type="submit"
              disabled={isLoading || !currentCommand.trim()}
              className="px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? "..." : "Enter"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    );
  },
);

TerminalComponent.displayName = "TerminalComponent";

export interface TerminalHandle {
  clearHistory: () => void;
  addOutput: (output: TerminalOutput) => void;
  focus: () => void;
  setInput?: (value: string) => void;
  executeCurrentInput?: () => void;
}
