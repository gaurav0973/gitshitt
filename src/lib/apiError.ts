import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status },
    );
  }

  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
