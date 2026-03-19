import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { errorResponse } from "./structureBackendResponse";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const issues = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
    return NextResponse.json(errorResponse("Validation failed", issues.join("; ")), {
      status: 400,
    });
  }

  if (error instanceof Error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(errorResponse(error.message), { status: 404 });
    }
    return NextResponse.json(errorResponse(error.message), { status: 500 });
  }

  return NextResponse.json(errorResponse("An unexpected error occurred"), { status: 500 });
}
