// ==================== GIT GRAPH CONFIGURATION ====================
// All customizable settings for the git graph visualization
class GitGraphConfig {
  // Commit node appearance
  readonly COMMIT_RADIUS = 16; // Size of commit circles

  // Spacing between elements
  readonly NODE_SPACING_X = 150; // Horizontal spacing between branches
  readonly NODE_SPACING_Y = 100; // Vertical spacing between commits

  // Layout settings
  readonly OFFSET_LEFT = 40; // Left offset (horizontal padding)
  readonly OFFSET_TOP = 40; // Top offset (vertical padding)
  readonly GRAPH_LEFT_OFFSET = -1; // Use -1 to auto-center based on container width
  readonly GRAPH_CENTER_MODE: "auto" | "fixed" = "auto"; // Auto-center or force fixed offset
  readonly FOCUS_NODE_TOP_OFFSET = 40; // Top offset for focus node bounds
  readonly FOCUS_NODE_BOTTOM_OFFSET = 40; // Bottom offset for focus node bounds
  readonly ARC_CURVATURE = 0.4; // Arc height as fraction of distance (0 = straight, 1 = very curved)

  // Curve behavior - controls how edges are drawn between commits
  readonly LONG_DISTANCE_THRESHOLD = 1; // Vertical levels to trigger cubic curve (vs quadratic)
  readonly CUBIC_CURVE_CONTROL_POINT = 1; // Control point position for cubic curves (0-1, closer to 0 = tighter curve)
  readonly INVERT_CUBIC_CURVES = true; // Flip cubic curve direction (swaps control points)

  // Text rendering
  readonly MESSAGE_OFFSET = 5; // Offset of message from commit node
  readonly MESSAGE_WRAP_LENGTH = 20; // Max characters per line in wrapped message
  readonly SHOW_TEXT_LABELS = true; // Show commit messages, hashes, and branch labels
  readonly COMMIT_HASH_FONT_SIZE = 11; // Font size for commit hash
  readonly COMMIT_MESSAGE_FONT_SIZE = 10; // Font size for commit message
  readonly BRANCH_LABEL_FONT_SIZE = 9; // Font size for branch labels
  readonly TAG_LABEL_FONT_SIZE = 9; // Font size for tag labels

  // Branch direction
  readonly FIRST_BRANCH_DIRECTION: "left" | "right" = "left"; // Direction of first branch

  // Branch colors - cycling palette for different branches
  readonly BRANCH_COLORS = [
    "#8B5CF6",
    "#F472B6",
    "#34D399",
    "#FBBF24",
    "#64748B",
    "#6366F1",
  ];

  readonly ACTIVE_BRANCH_COLOR = "#8B5CF6";
  readonly TAG_COLOR = "#FBBF24";
  readonly TEXT_BG_COLOR = "#FFFDF5";
  readonly TEXT_BG_OPACITY = 1;
  readonly EDGE_COLOR = "#CBD5E1";
  readonly EDGE_WIDTH = 4;

  readonly COMMIT_HEAD_COLOR = "#FBBF24";
  readonly COMMIT_HEAD_STROKE = "#1E293B";
  readonly COMMIT_MAIN_BRANCH_COLOR = "#8B5CF6";
  readonly COMMIT_MAIN_BRANCH_STROKE = "#1E293B";
  readonly COMMIT_FEATURE_BRANCH_COLOR = "#F472B6";
  readonly COMMIT_FEATURE_BRANCH_STROKE = "#1E293B";

  // Main branch name
  readonly MAIN_BRANCH_NAME = "main"; // Name of the main branch

  // Merge type indicators
  readonly MERGE_TYPE: "merge" | "rebase" = "merge"; // Type of merge to create (squash merges do not create labeled commits)
  readonly SHOW_MERGE_TYPE_LABELS = true; // Show labels for merge/rebase commits
  readonly MERGE_TYPE_LABEL_COLOR = "#F472B6";
  readonly REBASE_TYPE_LABEL_COLOR = "#8B5CF6";

  readonly TYPING_DELAY = 0; // ms per character
  readonly COMMAND_DELAY = 250; // ms before executing command after typing
  readonly ACTION_ANIMATION_DELAY = 250; // ms to let the graph animate before next command
  readonly GRAPH_ANIMATION_DURATION = 500; // ms for graph animations (edges, nodes, HEAD)
  readonly GRAPH_ROTATION = 0; // Degrees to rotate the graph (for better fitting certain layouts)
}

// Create a singleton instance
export const gitConfig = new GitGraphConfig();
