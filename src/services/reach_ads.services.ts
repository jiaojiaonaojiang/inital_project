import { prisma } from "../lib/prisma";
import {
  AdFilters,
  AdStatus,
  CreateAdPayload,
  PaginatedResponse,
  UpdateAdPayload,
  VALID_STATUS_TRANSITIONS,
} from "../types/reach_ads.types";
import type { ReachAd } from "../../generated/prisma/client";

export async function createAd(payload: CreateAdPayload): Promise<ReachAd> {
  const { placementRules, startAt, endAt, ...adData } = payload;

  return prisma.reachAd.create({
    data: {
      ...adData,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
      placementRules: placementRules?.length
        ? { create: placementRules }
        : undefined,
    },
    include: { placementRules: true },
  });
}

export async function listAds(
  filters: AdFilters
): Promise<PaginatedResponse<ReachAd>> {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.businessId) {
    where.businessId = filters.businessId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.reachAd.findMany({
      where,
      include: { placementRules: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.reachAd.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function findAdById(id: string): Promise<ReachAd> {
  const ad = await prisma.reachAd.findUnique({
    where: { id },
    include: { placementRules: true },
  });

  if (!ad) {
    throw new Error(`Ad not found with id: ${id}`);
  }

  return ad;
}

export async function updateAd(
  id: string,
  payload: UpdateAdPayload
): Promise<ReachAd> {
  await findAdById(id);

  const { placementRules, startAt, endAt, ...adData } = payload;

  const updateData: Record<string, unknown> = { ...adData };
  if (startAt !== undefined) {
    updateData.startAt = startAt ? new Date(startAt) : null;
  }
  if (endAt !== undefined) {
    updateData.endAt = endAt ? new Date(endAt) : null;
  }

  if (placementRules) {
    await prisma.reachAdPlacementRule.deleteMany({ where: { reachAdId: id } });
    updateData.placementRules = { create: placementRules };
  }

  return prisma.reachAd.update({
    where: { id },
    data: updateData,
    include: { placementRules: true },
  });
}

export async function changeAdStatus(
  id: string,
  newStatus: AdStatus
): Promise<ReachAd> {
  const ad = await findAdById(id);
  const currentStatus = ad.status as AdStatus;

  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
  if (!allowedTransitions?.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${currentStatus} → ${newStatus}. Allowed: ${allowedTransitions?.join(", ") || "none"}`
    );
  }

  if (newStatus === "active" && !ad.imageUrl && ad.adType === "image") {
    throw new Error("Cannot activate an image ad without an uploaded image");
  }

  return prisma.reachAd.update({
    where: { id },
    data: { status: newStatus },
    include: { placementRules: true },
  });
}

export async function deleteAd(id: string): Promise<void> {
  await findAdById(id);
  await prisma.reachAd.delete({ where: { id } });
}
