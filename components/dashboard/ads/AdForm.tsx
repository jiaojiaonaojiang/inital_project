"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlacementRulesForm from "./PlacementRulesForm";
import ScheduleForm from "./ScheduleForm";
import ImageUploadCard from "./ImageUploadCard";
import VideoUploadCard from "./VideoUploadCard";
import AdPreviewCard from "./AdPreviewCard";
import type {
  CreateAdPayload,
  UpdateAdPayload,
  CreatePlacementRulePayload,
  AdType,
} from "../../../src/types/reach_ads.types";
import { AD_TYPES } from "../../../src/types/reach_ads.types";
import type { ReachAd, ReachAdPlacementRule } from "../../../generated/prisma/client";
import {
  createAd,
  updateAd,
  uploadAdImage,
  deleteAdImage,
  uploadAdVideo,
  deleteAdVideo,
} from "../../../lib/ads";

interface AdFormProps {
  mode: "create" | "edit";
  initialData?: ReachAd & { placementRules?: ReachAdPlacementRule[] };
}

function toLocalDatetime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdForm({ mode, initialData }: AdFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [ctaText, setCtaText] = useState(initialData?.ctaText || "");
  const [ctaUrl, setCtaUrl] = useState(initialData?.ctaUrl || "");
  const [adType, setAdType] = useState<AdType>(
    (initialData?.adType as AdType) || "image"
  );
  const [startAt, setStartAt] = useState(
    toLocalDatetime(initialData?.startAt as string | null)
  );
  const [endAt, setEndAt] = useState(
    toLocalDatetime(initialData?.endAt as string | null)
  );
  const [timezone, setTimezone] = useState(initialData?.timezone || "UTC");
  const [isPrimeTimeEnabled, setIsPrimeTimeEnabled] = useState(
    initialData?.isPrimeTimeEnabled || false
  );
  const [placementRules, setPlacementRules] = useState<
    CreatePlacementRulePayload[]
  >(
    initialData?.placementRules?.map((r) => ({
      placementType: r.placementType as CreatePlacementRulePayload["placementType"],
      priority: r.priority,
      maxImpressionsPerSession: r.maxImpressionsPerSession ?? undefined,
      cooldownMinutes: r.cooldownMinutes ?? undefined,
      enabled: r.enabled,
    })) || []
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initialData?.videoUrl || null
  );
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);

  const handleScheduleChange = (field: string, value: string | boolean) => {
    if (field === "startAt") setStartAt(value as string);
    else if (field === "endAt") setEndAt(value as string);
    else if (field === "timezone") setTimezone(value as string);
    else if (field === "isPrimeTimeEnabled")
      setIsPrimeTimeEnabled(value as boolean);
  };

  const handleImageUpload = (file: File) => {
    setPendingImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setPendingImage(null);
    setImageUrl(null);
  };

  const handleVideoUpload = (file: File) => {
    setPendingVideo(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleVideoRemove = () => {
    setPendingVideo(null);
    setVideoUrl(null);
  };

  const handleSubmit = async (asDraft: boolean) => {
    setSaving(true);
    setError(null);

    try {
      let adId: string;

      if (mode === "create") {
        const createPayload: CreateAdPayload = {
          businessId: "default-business",
          title,
          description: description || undefined,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          adType,
          status: asDraft ? "draft" : "active",
          startAt: startAt ? new Date(startAt).toISOString() : undefined,
          endAt: endAt ? new Date(endAt).toISOString() : undefined,
          timezone,
          isPrimeTimeEnabled,
          placementRules: placementRules.length > 0 ? placementRules : undefined,
        };
        const res = await createAd(createPayload);
        if (!res.success || !res.data) {
          throw new Error(res.error || "Failed to create ad");
        }
        adId = res.data.id;
      } else {
        adId = initialData!.id;
        const updatePayload: UpdateAdPayload = {
          title,
          description: description || undefined,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          adType,
          startAt: startAt ? new Date(startAt).toISOString() : null,
          endAt: endAt ? new Date(endAt).toISOString() : null,
          timezone,
          isPrimeTimeEnabled,
          placementRules: placementRules.length > 0 ? placementRules : undefined,
        };
        const res = await updateAd(adId, updatePayload);
        if (!res.success) {
          throw new Error(res.error || "Failed to update ad");
        }
      }

      if (pendingImage) {
        const uploadRes = await uploadAdImage(adId, pendingImage);
        if (!uploadRes.success) {
          console.warn("Image upload failed:", uploadRes.error);
        }
      } else if (!imageUrl && initialData?.imageUrl) {
        await deleteAdImage(adId);
      }

      if (pendingVideo) {
        const uploadRes = await uploadAdVideo(adId, pendingVideo);
        if (!uploadRes.success) {
          console.warn("Video upload failed:", uploadRes.error);
        }
      } else if (!videoUrl && initialData?.videoUrl) {
        await deleteAdVideo(adId);
      }

      router.push("/dashboard/ads");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Basic Details</h3>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Promotion"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the ad..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                CTA Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Shop Now"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                CTA URL
              </label>
              <input
                type="url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ad Type
            </label>
            <select
              value={adType}
              onChange={(e) => setAdType(e.target.value as AdType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {AD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ImageUploadCard
            imageUrl={imageUrl}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />
        </div>

        {adType === "video" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <VideoUploadCard
              videoUrl={videoUrl}
              onUpload={handleVideoUpload}
              onRemove={handleVideoRemove}
            />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <PlacementRulesForm
            rules={placementRules}
            onChange={setPlacementRules}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ScheduleForm
            startAt={startAt}
            endAt={endAt}
            timezone={timezone}
            isPrimeTimeEnabled={isPrimeTimeEnabled}
            onChange={handleScheduleChange}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={saving || !title}
            onClick={() => handleSubmit(true)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            disabled={saving || !title}
            onClick={() => handleSubmit(false)}
            className="px-5 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Publishing..." : mode === "create" ? "Publish Ad" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <AdPreviewCard
            title={title}
            description={description}
            ctaText={ctaText}
            ctaUrl={ctaUrl}
            imageUrl={imageUrl}
            videoUrl={videoUrl}
            adType={adType}
          />
        </div>
      </div>
    </div>
  );
}
