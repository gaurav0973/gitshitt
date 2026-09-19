import type { Branch, Commit, GitState, PendingSquash, Tag } from "./gitState";

interface SerializedGitState {
  commits: Record<string, Commit>;
  branches: Record<string, Branch>;
  tags: Record<string, Tag>;
  currentBranch: string;
  HEAD: string;
  pendingSquash?: PendingSquash | null;
}

export function serializeGitState(state: GitState): SerializedGitState {
  return {
    commits: Object.fromEntries(state.commits),
    branches: Object.fromEntries(state.branches),
    tags: Object.fromEntries(state.tags),
    currentBranch: state.currentBranch,
    HEAD: state.HEAD,
    pendingSquash: state.pendingSquash ?? null,
  };
}

export function deserializeGitState(data: unknown): GitState {
  const obj = data as SerializedGitState;

  return {
    commits: new Map(Object.entries(obj.commits ?? {})),
    branches: new Map(Object.entries(obj.branches ?? {})),
    tags: new Map(Object.entries(obj.tags ?? {})),
    currentBranch: obj.currentBranch ?? "main",
    HEAD: obj.HEAD ?? "",
    pendingSquash: obj.pendingSquash ?? null,
  };
}
