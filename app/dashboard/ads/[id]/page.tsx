"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import AdStatusBadge from "../../../../components/dashboard/ads/AdStatusBadge";
import AdPreviewCard from "../../../../components/dashboard/ads/AdPreviewCard";
import { getAdById, deleteAd, updateAdStatus } from "../../../../lib/ads";
import { VALID_STATUS_TRANSITIONS } from "../../../../src/types/reach_ads.types";
import type { AdStatus } from "../../../../src/types/reach_ads.types";
import type { ReachAd, ReachAdPlacementRule } from "../../../../generated/prisma/client";
import { format } from "date-fns";

type AdWithRules = ReachAd & { placementRules?: ReachAdPlacementRule[] };

const placementLabels: Record<string, string> = {
  welcome: "Welcome",
  mid_conversation: "Mid Conversation",
  post_response: "Post Response",
  fallback: "Fallback",
};

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ad, setAd] = useState<AdWithRules | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getAdById(params.id as string);
      if (res.success && res.data) setAd(res.data as AdWithRules);
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    const res = await deleteAd(params.id as string);
    if (res.success) router.push("/dashboard/ads");
  };

  const handleStatusChange = async (status: AdStatus) => {
    const res = await updateAdStatus(params.id as string, status);
    if (res.success && res.data) setAd(res.data as AdWithRules);
    else alert(res.error || "Failed to update status");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900">Ad not found</h2>
        <Link href="/dashboard/ads" className="text-blue-600 text-sm mt-2 inline-block">
          Back to ads
        </Link>
      </div>
    );
  }

  const transitions = VALID_STATUS_TRANSITIONS[ad.status as AdStatus] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ads"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
              <AdStatusBadge status={ad.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Created {format(new Date(ad.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/ads/${ad.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Details</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500">Type</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize mt-0.5">
                  {ad.adType}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Timezone</dt>
                <dd className="text-sm font-medium text-gray-900 mt-0.5">
                  {ad.timezone}
                </dd>
              </div>
              {ad.ctaText && (
                <div>
                  <dt className="text-xs text-gray-500">CTA Text</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-0.5">
                    {ad.ctaText}
                  </dd>
                </div>
              )}
              {ad.ctaUrl && (
                <div>
                  <dt className="text-xs text-gray-500">CTA URL</dt>
                  <dd className="text-sm font-medium text-blue-600 mt-0.5 truncate">
                    <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer">
                      {ad.ctaUrl}
                    </a>
                  </dd>
                </div>
              )}
              {ad.description && (
                <div className="col-span-2">
                  <dt className="text-xs text-gray-500">Description</dt>
                  <dd className="text-sm text-gray-700 mt-0.5">
                    {ad.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Schedule</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500">Start</dt>
                <dd className="text-sm font-medium text-gray-900 mt-0.5">
                  {ad.startAt
                    ? format(new Date(ad.startAt), "MMM d, yyyy h:mm a")
                    : "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">End</dt>
                <dd className="text-sm font-medium text-gray-900 mt-0.5">
                  {ad.endAt
                    ? format(new Date(ad.endAt), "MMM d, yyyy h:mm a")
                    : "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Prime Time</dt>
                <dd className="text-sm font-medium text-gray-900 mt-0.5">
                  {ad.isPrimeTimeEnabled ? "Enabled" : "Disabled"}
                </dd>
              </div>
            </dl>
          </div>

          {ad.placementRules && ad.placementRules.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Placement Rules
              </h3>
              <div className="space-y-3">
                {ad.placementRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center justify-between"
                  >
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {placementLabels[rule.placementType] || rule.placementType}
                      </span>
                      <span className="text-gray-400 mx-2">&middot;</span>
                      <span className="text-gray-600">
                        Priority {rule.priority}
                      </span>
                      {rule.maxImpressionsPerSession && (
                        <>
                          <span className="text-gray-400 mx-2">&middot;</span>
                          <span className="text-gray-600">
                            Max {rule.maxImpressionsPerSession}/session
                          </span>
                        </>
                      )}
                      {rule.cooldownMinutes && (
                        <>
                          <span className="text-gray-400 mx-2">&middot;</span>
                          <span className="text-gray-600">
                            {rule.cooldownMinutes}min cooldown
                          </span>
                        </>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${rule.enabled ? "text-green-600" : "text-gray-400"}`}
                    >
                      {rule.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {transitions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Status Actions
              </h3>
              <div className="flex gap-2">
                {transitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === "active"
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : status === "paused"
                          ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                          : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AdPreviewCard
              title={ad.title}
              description={ad.description || ""}
              ctaText={ad.ctaText || ""}
              ctaUrl={ad.ctaUrl || ""}
              imageUrl={ad.imageUrl}
              videoUrl={ad.videoUrl}
              adType={ad.adType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
