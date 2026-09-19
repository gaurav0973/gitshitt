import type { GitContext } from "@/lib/validators/chat";

export function buildGitTutorSystemPrompt(gitContext?: GitContext): string {
  const base =
    "You are a Git tutor for gitshitt, a sandbox Git learning app. Explain concepts simply and practically. Reference the user's current repo state when provided. Never suggest destructive real-world commands without a clear warning. Keep answers concise.";

  if (!gitContext) {
    return base;
  }

  const parts = [
    base,
    "",
    "Current sandbox state:",
    `- Branch: ${gitContext.currentBranch}`,
    `- Commits: ${gitContext.commitCount}`,
    `- Branches: ${gitContext.branches.join(", ") || "none"}`,
  ];

  if (gitContext.lastCommand) {
    parts.push(`- Last command: ${gitContext.lastCommand}`);
  }
  if (gitContext.lastOutput) {
    parts.push(`- Last output: ${gitContext.lastOutput}`);
  }

  return parts.join("\n");
}
