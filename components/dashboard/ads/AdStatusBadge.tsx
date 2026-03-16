"use client";

import type { AdStatus } from "../../../src/types/reach_ads.types";

const statusConfig: Record<AdStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  active: {
    label: "Active",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  paused: {
    label: "Paused",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  archived: {
    label: "Archived",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function AdStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as AdStatus] || statusConfig.draft;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
