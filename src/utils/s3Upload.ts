import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "reach-ads-media";
const REGION = process.env.AWS_REGION || "ap-southeast-2";

function getS3Client(): S3Client {
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function validateImageFile(file: File): string | null {
  if (!IMAGE_MIME_TYPES.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: ${IMAGE_MIME_TYPES.join(", ")}`;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB`;
  }
  return null;
}

export function validateVideoFile(file: File): string | null {
  if (!VIDEO_MIME_TYPES.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: ${VIDEO_MIME_TYPES.join(", ")}`;
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 50MB`;
  }
  return null;
}

export function generateS3Key(businessId: string, originalFilename: string): string {
  const ext = originalFilename.split(".").pop() || "jpg";
  return `ads/${businessId}/${uuidv4()}.${ext}`;
}

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
