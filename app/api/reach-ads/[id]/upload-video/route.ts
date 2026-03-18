import { NextRequest, NextResponse } from "next/server";
import {
  uploadAdVideo,
  deleteAdVideo,
} from "../../../../../src/services/reach_ads_media.services";
import { successResponse } from "../../../../../src/utils/structureBackendResponse";
import { handleApiError } from "../../../../../src/utils/errorHandler";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
        { status: 400 }
      );
    }

    const ad = await uploadAdVideo(id, file);
    return NextResponse.json(
      successResponse(ad, "Video uploaded successfully")
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ad = await deleteAdVideo(id);
    return NextResponse.json(
      successResponse(ad, "Video deleted successfully")
    );
  } catch (error) {
    return handleApiError(error);
  }
}