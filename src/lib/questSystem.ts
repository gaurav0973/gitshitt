import type { GitState } from "./gitState";

export interface Quest {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  description: string;
  hintCommand: string;
  xp: number;
  badge: string;
  color: "peach" | "yellow" | "mint" | "teal";
  checkCompleted: (state: GitState, previousState?: GitState) => boolean;
}

export const QUESTS: Quest[] = [
  {
    id: "first-commit",
    level: 1,
    title: "First commit",
    subtitle: "Start your repo history",
    description: "Create your first commit and watch it appear on the graph.",
    hintCommand: 'git commit -m "initial commit"',
    xp: 100,
    badge: "Start",
    color: "mint",
    checkCompleted: (state: GitState) => {
      return state.commits.size >= 1;
    },
  },
  {
    id: "branch-out",
    level: 2,
    title: "Create a branch",
    subtitle: "Work on a side timeline",
    description: "Create a branch named feature to practice parallel work.",
    hintCommand: "git branch feature",
    xp: 150,
    badge: "Branch",
    color: "yellow",
    checkCompleted: (state: GitState) => {
      return state.branches.size > 1;
    },
  },
  {
    id: "branch-switch",
    level: 3,
    title: "Switch branches",
    subtitle: "Move HEAD to another branch",
    description: "Check out your feature branch and confirm HEAD moved.",
    hintCommand: "git checkout feature",
    xp: 150,
    badge: "Switch",
    color: "peach",
    checkCompleted: (state: GitState) => {
      return state.currentBranch !== "main" && state.branches.size > 1;
    },
  },
  {
    id: "branch-commit",
    level: 4,
    title: "Commit on a branch",
    subtitle: "Diverge from main",
    description: "Add a commit while on feature so histories split visibly.",
    hintCommand: 'git commit -m "feature work"',
    xp: 200,
    badge: "Diverge",
    color: "teal",
    checkCompleted: (state: GitState) => {
      if (state.commits.size < 2) return false;
      for (const commit of state.commits.values()) {
        if (commit.branch && commit.branch !== "main") {
          return true;
        }
      }
      return false;
    },
  },
  {
    id: "the-merge",
    level: 5,
    title: "Merge branches",
    subtitle: "Combine two histories",
    description: "Return to main and merge feature into it.",
    hintCommand: "git checkout main && git merge feature",
    xp: 300,
    badge: "Merge",
    color: "peach",
    checkCompleted: (state: GitState) => {
      for (const commit of state.commits.values()) {
        if (
          commit.mergeType === "merge" ||
          (commit.parentIds && commit.parentIds.length > 1)
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    id: "tag-release",
    level: 6,
    title: "Tag a release",
    subtitle: "Mark a stable point",
    description: "Tag the latest commit with something like v1.0.0.",
    hintCommand: "git tag v1.0.0",
    xp: 200,
    badge: "Tag",
    color: "yellow",
    checkCompleted: (state: GitState) => {
      return state.tags.size >= 1;
    },
  },
];

const COMPLETED_QUESTS_KEY = "gitshitt-completed-quests";

export function getCompletedQuestIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPLETED_QUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCompletedQuestId(id: string): string[] {
  const current = getCompletedQuestIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    try {
      localStorage.setItem(COMPLETED_QUESTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }
  return current;
}

export function calculateTotalXP(completedIds: string[]): number {
  return QUESTS.reduce((sum, q) => {
    return completedIds.includes(q.id) ? sum + q.xp : sum;
  }, 0);
}

export function getPlayerRank(xp: number): {
  rank: string;
  level: number;
  nextXp: number;
  currentLevelProgress: number;
} {
  const ranks = [
    { threshold: 0, rank: "Getting started", level: 1 },
    { threshold: 100, rank: "Branching basics", level: 2 },
    { threshold: 250, rank: "History builder", level: 3 },
    { threshold: 450, rank: "Merge ready", level: 4 },
    { threshold: 750, rank: "Workflow confident", level: 5 },
    { threshold: 1100, rank: "Git fluent", level: 6 },
  ];

  let currentRank = ranks[0];
  let nextThreshold = 100;

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (xp >= ranks[i].threshold) {
      currentRank = ranks[i];
      nextThreshold = ranks[i + 1]?.threshold ?? 1500;
      break;
    }
  }

  const prevThreshold = currentRank.threshold;
  const range = nextThreshold - prevThreshold;
  const progress =
    range > 0
      ? Math.min(100, Math.round(((xp - prevThreshold) / range) * 100))
      : 100;

  return {
    rank: currentRank.rank,
    level: currentRank.level,
    nextXp: nextThreshold,
    currentLevelProgress: progress,
  };
}
