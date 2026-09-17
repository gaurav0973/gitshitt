"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LightbulbIcon, ArrowRightIcon } from "./icons";
import { PillTab } from "./buttons";

const SAMPLE_SECTIONS = [
  {
    title: "Definition",
    color: "bg-accent",
    body: "A merge commit has two parents. It records that two histories were combined at one point.",
  },
  {
    title: "Why it happens",
    color: "bg-secondary",
    body: "You ran git merge to bring changes from another branch into your current branch.",
  },
  {
    title: "Mental model",
    color: "bg-tertiary",
    body: "Picture two train tracks joining at a switch. The merge node is the junction.",
  },
  {
    title: "Try it",
    color: "bg-quaternary",
    body: "git checkout main && git merge feature/login",
  },
];

function ConceptIntuitionDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

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
          <h2 className="font-heading text-lg font-bold">Concept Intuition</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-foreground px-3 py-1 text-sm font-bold"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="ml-auto max-w-[85%] rounded-2xl border-2 border-border bg-muted px-4 py-3 text-sm">
            Why did my merge create that commit shape?
          </div>

          {SAMPLE_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", section.color)} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {section.title}
                </h3>
              </div>
              {section.title === "Try it" ? (
                <code className="block rounded-xl border-2 border-border bg-muted px-3 py-2 font-mono text-xs">
                  {section.body}
                </code>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="border-t-2 border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about what just happened…"
              className="input-field flex-1 text-sm"
            />
            <PillTab active className="px-4">
              Send
            </PillTab>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function ConceptIntuitionFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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

      <ConceptIntuitionDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** @deprecated Use ConceptIntuitionFab */
export const ConceptIntuitionBanner = ConceptIntuitionFab;
