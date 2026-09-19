"use client";

import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

const chatMarkdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h3 className="mb-2 font-heading text-base font-bold last:mb-0">
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h4 className="mb-2 font-heading text-sm font-bold last:mb-0">{children}</h4>
  ),
  h3: ({ children }) => (
    <h5 className="mb-2 font-heading text-sm font-bold last:mb-0">{children}</h5>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-4 border-accent pl-3 text-muted-foreground last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-accent underline underline-offset-2"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-xl border-2 border-border bg-muted p-3 font-mono text-xs leading-relaxed last:mb-0">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className);

    if (isBlock) {
      return (
        <code className={cn("font-mono text-foreground", className)} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
        {...props}
      >
        {children}
      </code>
    );
  },
};

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

export function ChatMarkdown({ content, className }: ChatMarkdownProps) {
  return (
    <div className={cn("chat-markdown break-words", className)}>
      <Markdown components={chatMarkdownComponents}>{content}</Markdown>
    </div>
  );
}
