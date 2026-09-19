/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  TerminalComponent,
  type TerminalHandle,
  type TerminalOutput,
} from "@/components/TerminalComponent";
import { GitGraphComponent } from "@/components/GitGraphComponent";
import { type GitState, createEmptyGitState } from "@/lib/gitState";
import { parseGitCommand } from "@/lib/gitParser";
import { executeCommand } from "@/lib/gitExecutor";
import { DEMOS, type DemoType } from "@/lib/demoCommands";
import { gitConfig } from "@/lib/gitGraphConfig";
import { cn } from "@/lib/utils";
import { type GraphSettings, SETTINGS_PRESETS } from "./presetSettings";
import {
  GroupedSelect,
  type GroupedSelectOption,
} from "@/components/ui/grouped-select";
import {
  QUESTS,
  type Quest,
  getCompletedQuestIds,
  saveCompletedQuestId,
} from "@/lib/questSystem";
import {
  playPop,
  playCommit,
  playBranch,
  playMerge,
  playBoing,
  playSuccess,
} from "@/lib/audioFx";
import { VisualizerHeader } from "@/components/playful/nav";
import { ConceptIntuitionFab } from "@/components/playful/concept-drawer";
import { PillTab, SecondaryButton } from "@/components/playful/buttons";
import { deepCloneGitState } from "@/lib/gitExecutor/deepCloneGitState";
import { deserializeGitState, serializeGitState } from "@/lib/gitStateSerialize";
import { useAppUser } from "@/hooks/useAppUser";
import type { GitContext } from "@/lib/validators/chat";
import { RotateCcw, Sliders, Save, FolderOpen } from "lucide-react";
import confetti from "canvas-confetti";

const SETTINGS_STORAGE_KEY = "git-graph-settings";

export default function GitVisualizerPage() {
  const [gitState, setGitState] = useState<GitState>(createEmptyGitState());
  const terminalRef = useRef<TerminalHandle>(null);
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [isStacked, setIsStacked] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>("merge");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [graphLayout, setGraphLayout] = useState<"presentation" | "compact">(
    "presentation",
  );
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [newlyUnlockedQuest, setNewlyUnlockedQuest] = useState<Quest | null>(
    null,
  );
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState("");
  const [lastOutput, setLastOutput] = useState("");
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);

  const { user, isSignedIn } = useAppUser();
  const sessionTrackedRef = useRef(false);

  const demoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const demoModeRef = useRef(demoMode);
  const spaceResolveRef = useRef<null | (() => void)>(null);
  const exportStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const presentationPresetSettings =
    SETTINGS_PRESETS.find((preset) => preset.key === "presentation")
      ?.settings ?? {};

  const defaultSettings: GraphSettings = {
    COMMIT_RADIUS: gitConfig.COMMIT_RADIUS,
    NODE_SPACING_X: gitConfig.NODE_SPACING_X,
    NODE_SPACING_Y: gitConfig.NODE_SPACING_Y,
    OFFSET_LEFT: gitConfig.OFFSET_LEFT,
    OFFSET_TOP: gitConfig.OFFSET_TOP,
    ARC_CURVATURE: gitConfig.ARC_CURVATURE,
    LONG_DISTANCE_THRESHOLD: gitConfig.LONG_DISTANCE_THRESHOLD,
    CUBIC_CURVE_CONTROL_POINT: gitConfig.CUBIC_CURVE_CONTROL_POINT,
    INVERT_CUBIC_CURVES: gitConfig.INVERT_CUBIC_CURVES,
    MESSAGE_OFFSET: gitConfig.MESSAGE_OFFSET,
    MESSAGE_WRAP_LENGTH: gitConfig.MESSAGE_WRAP_LENGTH,
    SHOW_TEXT_LABELS: gitConfig.SHOW_TEXT_LABELS,
    COMMIT_HASH_FONT_SIZE: gitConfig.COMMIT_HASH_FONT_SIZE,
    COMMIT_MESSAGE_FONT_SIZE: gitConfig.COMMIT_MESSAGE_FONT_SIZE,
    BRANCH_LABEL_FONT_SIZE: gitConfig.BRANCH_LABEL_FONT_SIZE,
    TAG_LABEL_FONT_SIZE: gitConfig.TAG_LABEL_FONT_SIZE,
    EDGE_WIDTH: gitConfig.EDGE_WIDTH,
    SHOW_MERGE_TYPE_LABELS: gitConfig.SHOW_MERGE_TYPE_LABELS,
    INITIAL_DEMO_DELAY: 0,
    DEMO_STEP_ON_SPACE: false,
    TERMINAL_FONT_SIZE: 14,
    TYPING_DELAY: gitConfig.TYPING_DELAY,
    COMMAND_DELAY: gitConfig.COMMAND_DELAY,
    ACTION_ANIMATION_DELAY: gitConfig.ACTION_ANIMATION_DELAY,
    GRAPH_ANIMATION_DURATION: gitConfig.GRAPH_ANIMATION_DURATION,
    ALLOW_FAST_FORWARD_MERGES: false,
    FOCUS_NODE_TOP_OFFSET: 40,
    FOCUS_NODE_BOTTOM_OFFSET: 40,
    GRAPH_ROTATION: 0,
    ...presentationPresetSettings,
  };

  const [settings, setSettings] = useState<GraphSettings>(defaultSettings);
  const graphConfig = useMemo(
    () => ({ ...gitConfig, ...settings }),
    [settings],
  );

  const currentDemoCommands = useMemo(
    () => DEMOS[selectedDemo as DemoType] || [],
    [selectedDemo],
  );

  const demoProgress = useMemo(() => {
    if (!demoMode || currentDemoCommands.length === 0) return undefined;
    return Math.min(1, demoIndex / Math.max(1, currentDemoCommands.length));
  }, [demoMode, demoIndex, currentDemoCommands.length]);

  useEffect(() => {
    setCompletedQuestIds(getCompletedQuestIds());
  }, []);

  useEffect(() => {
    if (!isSignedIn || sessionTrackedRef.current) {
      return;
    }
    sessionTrackedRef.current = true;
    void fetch("/api/user/stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "session" }),
    });
  }, [isSignedIn]);

  const gitContext: GitContext = useMemo(
    () => ({
      currentBranch: gitState.currentBranch,
      commitCount: gitState.commits.size,
      lastCommand: lastCommand || undefined,
      lastOutput: lastOutput || undefined,
      branches: Array.from(gitState.branches.keys()),
    }),
    [gitState, lastCommand, lastOutput],
  );

  const saveSession = async () => {
    if (!user?.isPro) {
      setSessionStatus("Pro required to save sessions");
      return;
    }

    const name = window.prompt("Name this session");
    if (!name?.trim()) {
      return;
    }

    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        gitState: serializeGitState(deepCloneGitState(gitState)),
      }),
    });

    if (response.ok) {
      setSessionStatus("Session saved");
    } else {
      setSessionStatus("Could not save session");
    }
  };

  const loadLatestSession = async () => {
    if (!user?.isPro) {
      setSessionStatus("Pro required to load sessions");
      return;
    }

    const listResponse = await fetch("/api/sessions");
    const listData = (await listResponse.json()) as {
      sessions?: Array<{ id: string; name: string }>;
    };

    const latest = listData.sessions?.[0];
    if (!latest) {
      setSessionStatus("No saved sessions yet");
      return;
    }

    const detailResponse = await fetch(`/api/sessions/${latest.id}`);
    const detailData = (await detailResponse.json()) as {
      session?: { gitState: unknown; name: string };
    };

    if (!detailResponse.ok || !detailData.session) {
      setSessionStatus("Could not load session");
      return;
    }

    setGitState(deserializeGitState(detailData.session.gitState));
    setSessionStatus(`Loaded "${detailData.session.name}"`);
    terminalRef.current?.clearHistory?.();
  };

  const checkQuests = useCallback((newState: GitState) => {
    const currentDone = getCompletedQuestIds();
    for (const quest of QUESTS) {
      if (!currentDone.includes(quest.id)) {
        if (quest.checkCompleted(newState)) {
          const updated = saveCompletedQuestId(quest.id);
          setCompletedQuestIds(updated);
          setNewlyUnlockedQuest(quest);
          playSuccess();
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.4 },
          });
          setTimeout(() => {
            setNewlyUnlockedQuest(null);
          }, 4500);
          break;
        }
      }
    }
  }, []);

  const sliderSettings = [
    {
      key: "INITIAL_DEMO_DELAY",
      label: "Initial demo delay",
      min: 0,
      max: 5000,
      step: 100,
    },
    {
      key: "TYPING_DELAY",
      label: "Typing delay",
      min: 0,
      max: 200,
      step: 5,
    },
    {
      key: "COMMAND_DELAY",
      label: "Command delay",
      min: 0,
      max: 2000,
      step: 50,
    },
    {
      key: "ACTION_ANIMATION_DELAY",
      label: "Action delay",
      min: 0,
      max: 3000,
      step: 50,
    },
    {
      key: "GRAPH_ANIMATION_DURATION",
      label: "Graph anim duration",
      min: 0,
      max: 2000,
      step: 50,
    },
    {
      key: "TERMINAL_FONT_SIZE",
      label: "Terminal font size",
      min: 10,
      max: 24,
      step: 1,
    },
    {
      key: "COMMIT_RADIUS",
      label: "Commit radius",
      min: 8,
      max: 28,
      step: 1,
    },
    {
      key: "NODE_SPACING_X",
      label: "Node spacing X",
      min: 30,
      max: 120,
      step: 2,
    },
    {
      key: "NODE_SPACING_Y",
      label: "Node spacing Y",
      min: 30,
      max: 120,
      step: 2,
    },
    {
      key: "EDGE_WIDTH",
      label: "Edge width",
      min: 1,
      max: 8,
      step: 0.5,
    },
  ] as const;

  const toggleSettings = () => {
    playPop();
    setIsSettingsOpen((prev) => !prev);
  };

  const updateSetting = <K extends keyof GraphSettings>(
    key: K,
    value: GraphSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const exportSettings = async () => {
    playPop();
    const settingsText = JSON.stringify(settings, null, 4);
    try {
      await navigator.clipboard.writeText(settingsText);
      setExportStatus("Copied to clipboard!");
    } catch {
      window.prompt("Copy settings preset:", settingsText);
      setExportStatus("Prompted");
    }

    if (exportStatusTimeoutRef.current) {
      clearTimeout(exportStatusTimeoutRef.current);
    }
    exportStatusTimeoutRef.current = setTimeout(() => {
      setExportStatus(null);
    }, 2000);
  };

  const applyPreset = (presetKey: string) => {
    playPop();
    const preset = SETTINGS_PRESETS.find((item) => item.key === presetKey);
    if (!preset) return;
    setSettings((prev) => ({ ...prev, ...preset.settings }));
  };

  const DEMO_OPTIONS: GroupedSelectOption[] = [
    { key: "merges-title", label: "Basic Merges", isGroupTitle: true },
    { key: "merge", label: "Simple Merge" },
    { key: "fast_forward_merge", label: "Fast-Forward Merge" },
    { key: "regular_merge", label: "Regular Merge Commit" },
    { key: "squash_merge", label: "Squash Merge (--squash)" },
    { key: "sep-1", label: "", isSeparator: true },
    {
      key: "complex-merges-title",
      label: "Complex Merges",
      isGroupTitle: true,
    },
    { key: "merge_2", label: "Multiple Merges" },
    { key: "merge_flow", label: "Merge Flow" },
    { key: "merge_flow_6", label: "Merge Flow (6 Branches)" },
    { key: "merge_flow_7", label: "Merge Flow (Varied)" },
    { key: "sep-2", label: "", isSeparator: true },
    { key: "other-title", label: "Other Operations", isGroupTitle: true },
    { key: "branching_2", label: "Simple Branching" },
    { key: "rebasing", label: "Rebase" },
    { key: "tagging", label: "Tagging" },
    { key: "resetting", label: "Reset" },
  ];

  const handleCommand = async (command: string): Promise<TerminalOutput> => {
    const trimmed = command.trim();
    setLastCommand(trimmed);
    const parsed = parseGitCommand(trimmed);

    if ("error" in parsed && parsed.error) {
      playBoing();
      setLastOutput(parsed.message);
      return {
        type: "error",
        text: parsed.message,
        timestamp: Date.now(),
      };
    }

    // @ts-ignore
    const result = executeCommand(parsed, gitState, {
      allowFastForwardMerges: settings.ALLOW_FAST_FORWARD_MERGES,
    });

    if (!result.success) {
      playBoing();
      setLastOutput(result.message);
      return {
        type: "error",
        text: result.message,
        timestamp: Date.now(),
      };
    }

    // Sound feedback based on command intent
    if (trimmed.startsWith("git commit")) {
      playCommit();
    } else if (
      trimmed.startsWith("git branch") ||
      trimmed.includes("checkout -b")
    ) {
      playBranch();
    } else if (trimmed.startsWith("git merge")) {
      playMerge();
    } else if (trimmed.startsWith("git reset")) {
      playBoing();
    } else {
      playPop();
    }

    setLastOutput(result.message);

    if (isSignedIn) {
      void fetch("/api/user/stats/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "command" }),
      });
    }

    // Update git state if command succeeded
    if (result.newState) {
      setGitState(result.newState);
      checkQuests(result.newState);
    }

    return {
      type: "success",
      text: result.message,
      timestamp: Date.now(),
    };
  };

  useEffect(() => {
    demoModeRef.current = demoMode;
  }, [demoMode]);

  const waitForSpace = (): Promise<void> => {
    return new Promise((resolve) => {
      spaceResolveRef.current = resolve;
    });
  };

  useEffect(() => {
    if (!demoMode || !settings.DEMO_STEP_ON_SPACE) {
      spaceResolveRef.current = null;
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        const resolver = spaceResolveRef.current;
        if (resolver) {
          spaceResolveRef.current = null;
          resolver();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [demoMode, settings.DEMO_STEP_ON_SPACE]);

  const typeCommand = async (command: string): Promise<void> => {
    return new Promise((resolve) => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index <= command.length) {
          terminalRef.current?.setInput?.(command.substring(0, index));
          index++;
        } else {
          clearInterval(typeInterval);
          resolve();
        }
      }, graphConfig.TYPING_DELAY);
    });
  };

  const runDemoCommand = async (
    commandIndex: number,
    demoCommands: string[],
  ) => {
    if (!demoCommands || commandIndex >= demoCommands.length) {
      setDemoMode(false);
      return;
    }

    if (commandIndex === 0 && settings.INITIAL_DEMO_DELAY > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, settings.INITIAL_DEMO_DELAY),
      );
    }

    const command = demoCommands[commandIndex];

    if (settings.DEMO_STEP_ON_SPACE) {
      await waitForSpace();
      if (!demoModeRef.current) return;
    }

    await typeCommand(command);

    if (settings.DEMO_STEP_ON_SPACE) {
      await waitForSpace();
      if (!demoModeRef.current) return;
    } else {
      await new Promise((resolve) =>
        setTimeout(resolve, graphConfig.COMMAND_DELAY),
      );
      if (!demoModeRef.current) return;
    }

    terminalRef.current?.executeCurrentInput?.();

    demoTimeoutRef.current = setTimeout(() => {
      setDemoIndex(commandIndex + 1);
    }, graphConfig.ACTION_ANIMATION_DELAY);
  };

  useEffect(() => {
    if (demoMode && currentDemoCommands.length > 0) {
      runDemoCommand(demoIndex, currentDemoCommands);
    }

    return () => {
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
      }
    };
  }, [demoMode, demoIndex, selectedDemo]);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Partial<GraphSettings>;
      setSettings((prev) => ({
        ...prev,
        ...parsed,
        ALLOW_FAST_FORWARD_MERGES: false,
      }));
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const startDemo = () => {
    playPop();
    const cmds = DEMOS[selectedDemo as DemoType] || [];
    if (!cmds || cmds.length === 0) return;
    setDemoIndex(0);
    setDemoMode(true);
  };

  const stopDemo = () => {
    playPop();
    setDemoMode(false);
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
    }
  };

  const resetGit = () => {
    playBoing();
    stopDemo();
    setGitState(createEmptyGitState());
    setDemoIndex(0);
    setSelectedCommitId(null);
    terminalRef.current?.clearHistory?.();
  };

  const applyGraphLayout = (layout: "presentation" | "compact") => {
    playPop();
    setGraphLayout(layout);
    applyPreset(layout === "presentation" ? "presentation" : "speedy");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <VisualizerHeader isPro={user?.isPro ?? false} />

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2 md:p-3">
        {newlyUnlockedQuest && (
          <div className="flex shrink-0 items-center justify-between rounded-xl border-2 border-foreground bg-tertiary px-3 py-2 shadow-pop">
            <div>
              <p className="text-sm font-bold">
                Goal complete: {newlyUnlockedQuest.title}
              </p>
              <p className="text-xs text-muted-foreground">
                +{newlyUnlockedQuest.xp} XP · {newlyUnlockedQuest.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewlyUnlockedQuest(null)}
              className="rounded-full border-2 border-foreground px-2.5 py-1 text-xs font-bold"
            >
              Close
            </button>
          </div>
        )}

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <div className="w-44 sm:w-52">
            <GroupedSelect
              value={selectedDemo}
              onChange={(value) => {
                setSelectedDemo(value);
                stopDemo();
                resetGit();
              }}
              options={DEMO_OPTIONS}
              className="w-full text-xs"
            />
          </div>
          {(DEMOS[selectedDemo as DemoType]?.length ?? 0) > 0 &&
            (!demoMode ? (
              <SecondaryButton onClick={startDemo} className="px-3 py-1.5 text-xs">
                Play demo
              </SecondaryButton>
            ) : (
              <SecondaryButton onClick={stopDemo} className="px-3 py-1.5 text-xs">
                Stop demo
              </SecondaryButton>
            ))}
          <SecondaryButton onClick={resetGit} className="px-3 py-1.5 text-xs">
            <RotateCcw size={14} />
            Reset
          </SecondaryButton>
          <SecondaryButton onClick={toggleSettings} className="px-3 py-1.5 text-xs">
            <Sliders size={14} />
            Settings
          </SecondaryButton>
          {user?.isPro ? (
            <>
              <SecondaryButton onClick={() => void saveSession()} className="px-3 py-1.5 text-xs">
                <Save size={14} />
                Save
              </SecondaryButton>
              <SecondaryButton
                onClick={() => void loadLatestSession()}
                className="px-3 py-1.5 text-xs"
              >
                <FolderOpen size={14} />
                Load
              </SecondaryButton>
            </>
          ) : null}
          <span className="ml-auto hidden text-xs font-semibold text-muted-foreground sm:inline">
            Branch: {gitState.currentBranch}
          </span>
          {sessionStatus ? (
            <span className="text-xs font-semibold text-accent">{sessionStatus}</span>
          ) : null}
        </div>

        <div
          className={cn(
            "grid min-h-0 flex-1 gap-2 pb-16 sm:pb-4",
            isStacked ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2",
          )}
        >
          <div className={cn("min-h-0", isStacked ? "h-1/2" : "h-full")}>
            <TerminalComponent
              ref={terminalRef}
              onCommand={handleCommand}
              placeholder="git status"
              helpText="Type real git commands. Watch the graph update on the right."
              fontSize={settings.TERMINAL_FONT_SIZE}
              refocusOnEnter={!settings.DEMO_STEP_ON_SPACE}
            />
          </div>

          <div className={cn("graph-sticker min-h-0", isStacked ? "h-1/2" : "h-full")}>
            <div className="graph-sticker-header">
              <span className="text-xs font-bold">Commit graph</span>
              <div className="flex items-center gap-1">
                <PillTab
                  active={graphLayout === "presentation"}
                  onClick={() => applyGraphLayout("presentation")}
                  className="px-3 py-1"
                >
                  Presentation
                </PillTab>
                <PillTab
                  active={graphLayout === "compact"}
                  onClick={() => applyGraphLayout("compact")}
                  className="px-3 py-1"
                >
                  Compact
                </PillTab>
              </div>
            </div>
            <div className="dot-grid min-h-0 flex-1">
              <GitGraphComponent
                gitState={gitState}
                onCommitClick={setSelectedCommitId}
                config={graphConfig}
                demoProgress={demoProgress}
                reserveRightColumn={true}
                followMainHead={true}
              />
            </div>
            <div className="flex flex-wrap gap-3 border-t-2 border-border px-3 py-1.5 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-accent" /> main
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-secondary" /> feature
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-tertiary" /> HEAD
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConceptIntuitionFab
        gitContext={gitContext}
        isSignedIn={Boolean(isSignedIn)}
        chatLimit={user?.limits.chatDailyLimit}
        chatUsed={user?.limits.chatMessagesToday}
      />

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20">
          <div className="flex h-full w-96 flex-col overflow-y-auto border-l-2 border-foreground bg-card p-6 shadow-pop-lg">
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
              <h2 className="font-heading text-lg font-bold">Graph settings</h2>
              <button
                type="button"
                onClick={toggleSettings}
                className="rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-6 py-4">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider">Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {SETTINGS_PRESETS.map((preset) => (
                    <SecondaryButton
                      key={preset.key}
                      onClick={() => applyPreset(preset.key)}
                      className="w-full py-2 text-xs"
                    >
                      {preset.label}
                    </SecondaryButton>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider">
                  Dimensions & speeds
                </p>
                {sliderSettings.map((item) => {
                  const value =
                    (settings[item.key as keyof GraphSettings] as number) ??
                    (defaultSettings[
                      item.key as keyof GraphSettings
                    ] as number);
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{item.label}</span>
                        <span className="font-mono text-accent">{value}</span>
                      </div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={value}
                        onChange={(e) =>
                          updateSetting(
                            item.key as keyof GraphSettings,
                            Number(
                              e.target.value,
                            ) as GraphSettings[keyof GraphSettings],
                          )
                        }
                        className="w-full cursor-pointer accent-accent"
                      />
                    </div>
                  );
                })}
              </div>

              <SecondaryButton onClick={exportSettings} className="w-full text-xs">
                {exportStatus || "Copy settings JSON"}
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
