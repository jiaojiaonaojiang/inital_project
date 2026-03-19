import { NextRequest, NextResponse } from "next/server";
import { changeAdStatus } from "../../../../../src/services/reach_ads.services";
import { updateStatusSchema } from "../../../../../src/validators/reach_ads.validators";
import { successResponse } from "../../../../../src/utils/structureBackendResponse";
import { handleApiError } from "../../../../../src/utils/errorHandler";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);
    const ad = await changeAdStatus(id, status);
    return NextResponse.json(
      successResponse(ad, `Ad status changed to ${status}`)
    );
  } catch (error) {
    return handleApiError(error);
  }
}
