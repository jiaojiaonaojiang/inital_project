"use client";

import Link from "next/link";
import { Pencil, Eye, Trash2, Play, Pause, Archive } from "lucide-react";
import AdStatusBadge from "./AdStatusBadge";
import type { ReachAd } from "../../../generated/prisma/client";
import type { AdStatus } from "../../../src/types/reach_ads.types";
import { VALID_STATUS_TRANSITIONS } from "../../../src/types/reach_ads.types";
import { format } from "date-fns";

interface AdsTableProps {
  ads: ReachAd[];
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

export default function AdsTable({ ads, onStatusChange, onDelete }: AdsTableProps) {
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
                  <AdStatusBadge status={ad.status} />
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
                    <Link
                      href={`/dashboard/ads/${ad.id}`}
                      className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      title="View"
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
                          onClick={() => onStatusChange(ad.id, action.status)}
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
  );
}
