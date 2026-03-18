import { prisma } from "../lib/prisma";
import {
  validateImageFile,
  validateVideoFile,
  generateS3Key,
  uploadToS3,
  deleteFromS3,
} from "../utils/s3Upload";
import type { ReachAd } from "../../generated/prisma/client";

export async function uploadAdImage(
  adId: string,
  file: File
): Promise<ReachAd> {
  const ad = await prisma.reachAd.findUnique({ where: { id: adId } });
  if (!ad) {
    throw new Error(`Ad not found with id: ${adId}`);
  }

  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (ad.imageKey) {
    try {
      await deleteFromS3(ad.imageKey);
    } catch {
      // Old image cleanup is best-effort
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = generateS3Key(ad.businessId, file.name);
  const imageUrl = await uploadToS3(buffer, key, file.type);

  return prisma.reachAd.update({
    where: { id: adId },
    data: { imageUrl, imageKey: key },
    include: { placementRules: true },
  });
}

export async function deleteAdImage(adId: string): Promise<ReachAd> {
  const ad = await prisma.reachAd.findUnique({ where: { id: adId } });
  if (!ad) {
    throw new Error(`Ad not found with id: ${adId}`);
  }

  if (ad.imageKey) {
    await deleteFromS3(ad.imageKey);
  }

  return prisma.reachAd.update({
    where: { id: adId },
    data: { imageUrl: null, imageKey: null },
    include: { placementRules: true },
  });
}

export async function uploadAdVideo(
  adId: string,
  file: File
): Promise<ReachAd> {
  const ad = await prisma.reachAd.findUnique({ where: { id: adId } });
  if (!ad) {
    throw new Error(`Ad not found with id: ${adId}`);
  }

  const validationError = validateVideoFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (ad.videoKey) {
    try {
      await deleteFromS3(ad.videoKey);
    } catch {
      // Old video cleanup is best-effort
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = generateS3Key(ad.businessId, file.name);
  const videoUrl = await uploadToS3(buffer, key, file.type);

  return prisma.reachAd.update({
    where: { id: adId },
    data: { videoUrl, videoKey: key },
    include: { placementRules: true },
  });
}

export async function deleteAdVideo(adId: string): Promise<ReachAd> {
  const ad = await prisma.reachAd.findUnique({ where: { id: adId } });
  if (!ad) {
    throw new Error(`Ad not found with id: ${adId}`);
  }

  if (ad.videoKey) {
    await deleteFromS3(ad.videoKey);
  }

  return prisma.reachAd.update({
    where: { id: adId },
    data: { videoUrl: null, videoKey: null },
    include: { placementRules: true },
  });
}
