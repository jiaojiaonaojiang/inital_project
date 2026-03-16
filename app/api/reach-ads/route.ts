import { NextRequest, NextResponse } from "next/server";
import { createAd, listAds } from "../../../src/services/reach_ads.services";
import { createAdSchema } from "../../../src/validators/reach_ads.validators";
import { successResponse } from "../../../src/utils/structureBackendResponse";
import { handleApiError } from "../../../src/utils/errorHandler";
import type { AdStatus } from "../../../src/types/reach_ads.types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      status: (searchParams.get("status") as AdStatus) || undefined,
      businessId: searchParams.get("businessId") || undefined,
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    const result = await listAds(filters);
    return NextResponse.json(successResponse(result));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createAdSchema.parse(body);
    const ad = await createAd(validated);
    return NextResponse.json(successResponse(ad, "Ad created successfully"), {
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
