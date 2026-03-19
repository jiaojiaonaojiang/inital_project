import { NextRequest, NextResponse } from "next/server";
import {
  findAdById,
  updateAd,
  deleteAd,
} from "../../../../src/services/reach_ads.services";
import { updateAdSchema } from "../../../../src/validators/reach_ads.validators";
import { successResponse } from "../../../../src/utils/structureBackendResponse";
import { handleApiError } from "../../../../src/utils/errorHandler";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ad = await findAdById(id);
    return NextResponse.json(successResponse(ad));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateAdSchema.parse(body);
    const ad = await updateAd(id, validated);
    return NextResponse.json(successResponse(ad, "Ad updated successfully"));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteAd(id);
    return NextResponse.json(successResponse(null, "Ad deleted successfully"));
  } catch (error) {
    return handleApiError(error);
  }
}
