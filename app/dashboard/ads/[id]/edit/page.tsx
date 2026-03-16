"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdForm from "../../../../../components/dashboard/ads/AdForm";
import { getAdById } from "../../../../../lib/ads";
import type { ReachAd, ReachAdPlacementRule } from "../../../../../generated/prisma/client";

type AdWithRules = ReachAd & { placementRules?: ReachAdPlacementRule[] };

export default function EditAdPage() {
  const params = useParams();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/ads/${ad.id}`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Ad</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Update &ldquo;{ad.title}&rdquo;
          </p>
        </div>
      </div>
      <AdForm mode="edit" initialData={ad} />
    </div>
  );
}
