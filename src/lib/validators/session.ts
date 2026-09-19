export interface SaveSessionBody {
  name: string;
  gitState: unknown;
}

export function parseSaveSessionBody(body: unknown): SaveSessionBody {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const data = body as Record<string, unknown>;
  const name = data.name;
  const gitState = data.gitState;

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error("name is required");
  }

  if (name.length > 120) {
    throw new Error("name is too long");
  }

  if (gitState === undefined || gitState === null) {
    throw new Error("gitState is required");
  }

  return {
    name: name.trim(),
    gitState,
  };
}
