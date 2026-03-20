"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Eye, Trash2, Play, Pause, Archive, LayoutTemplate, X } from "lucide-react";
import AdStatusBadge from "./AdStatusBadge";
import AdPreviewCard from "./AdPreviewCard";
import type { ReachAd } from "../../../generated/prisma/client";
import type { AdStatus } from "../../../src/types/reach_ads.types";
import { VALID_STATUS_TRANSITIONS } from "../../../src/types/reach_ads.types";
import { format } from "date-fns";

// Assuming image.png is in the same folder
import bgImage from "./image.png"; 

interface AdsTableProps {
  // Using 'any' as a fallback to ensure we can access nested placementRules 
  // depending on how your Prisma includes are set up.
  ads: (ReachAd & { placementRules?: any[] })[]; 
  onStatusChange: (id: string, status: AdStatus) => void;
  onDelete: (id: string) => void;
}

function getStatusActions(currentStatus: string) {
  const transitions = VALID_STATUS_TRANSITIONS[currentStatus as AdStatus] || [];
  return transitions.map((status) => {
    switch (status) {
      case "active":
        return { status, icon: Play, label: "Activate", className: "text-green-600 hover:text-green-800" };
      case "paused":
        return { status, icon: Pause, label: "Pause", className: "text-yellow-600 hover:text-yellow-800" };
      case "archived":
        return { status, icon: Archive, label: "Archive", className: "text-red-600 hover:text-red-800" };
      default:
        return null;
    }
  }).filter(Boolean);
}

// Helper to convert the position string to Tailwind absolute classes
function getPositionClasses(position?: string) {
  switch (position) {
    case "top_left":
      return "top-4 left-4";
    case "bottom_left":
      return "bottom-4 left-4";
    case "top_right":
      return "top-4 right-4";
    case "bottom_right":
    default:
      return "bottom-4 right-4";
  }
}

export default function AdsTable({ ads, onStatusChange, onDelete }: AdsTableProps) {
  // State to track which ad is currently being previewed
  const [previewAd, setPreviewAd] = useState<AdsTableProps["ads"][0] | null>(null);

  if (ads.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <Trash2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No ads yet</h3>
        <p className="text-gray-500 mb-6">Create your first ad to get started.</p>
        <Link
          href="/dashboard/ads/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition-colors"
        >
          Create Ad
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ad
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Prime Time
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{ad.title}</p>
                      {ad.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                          {ad.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AdStatusBadge status={ad.status as AdStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">
                      {ad.adType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {ad.startAt ? (
                        <>
                          <span>{format(new Date(ad.startAt), "MMM d, yyyy")}</span>
                          {ad.endAt && (
                            <span className="text-gray-400">
                              {" "}
                              — {format(new Date(ad.endAt), "MMM d, yyyy")}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">Not scheduled</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${ad.isPrimeTimeEnabled ? "text-purple-600 font-medium" : "text-gray-400"}`}
                    >
                      {ad.isPrimeTimeEnabled ? "Enabled" : "Off"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* NEW: Layout Preview Button */}
                      <button
                        onClick={() => setPreviewAd(ad)}
                        className={`p-2 rounded-lg transition-colors ${
                          previewAd?.id === ad.id 
                            ? "text-purple-600 bg-purple-50" 
                            : "text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                        title="View Position Preview"
                      >
                        <LayoutTemplate className="w-4 h-4" />
                      </button>
                      
                      <Link
                        href={`/dashboard/ads/${ad.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/ads/${ad.id}/edit`}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {getStatusActions(ad.status).map((action) => {
                        if (!action) return null;
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.status}
                            onClick={() => onStatusChange(ad.id, action.status as AdStatus)}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${action.className}`}
                            title={action.label}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                      <button
                        onClick={() => onDelete(ad.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW: Dynamic Placement Preview Section */}
      {previewAd && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Position Preview: {previewAd.title}
              </h3>
              <p className="text-sm text-gray-500">
                Showing layout based on Rule 1 positioning.
              </p>
            </div>
            <button
              onClick={() => setPreviewAd(null)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {/* Base Background Image */}
            <Image 
              src={bgImage} 
              alt="Website Layout Reference" 
              fill 
              className="object-cover opacity-80"
              priority
            />
            
            {/* The Ad Card dynamically positioned */}
            {/* Note: We pull position from placementRules array. Adjust path if your Prisma structure differs */}
            <div 
              className={`absolute w-72 shadow-2xl transition-all duration-500 ease-in-out ${getPositionClasses(previewAd.placementRules?.[0]?.position)}`}
            >
              <AdPreviewCard
                title={previewAd.title}
                description={previewAd.description || ""}
                ctaText={previewAd.ctaText || ""}
                ctaUrl={previewAd.ctaUrl || ""}
                imageUrl={(previewAd as any).imageUrl || null} // Update these depending on exact Prisma schema keys
                videoUrl={(previewAd as any).videoUrl || null} 
                adType={previewAd.adType}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}