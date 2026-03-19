"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import AdsTable from "../../../components/dashboard/ads/AdsTable";
import type { ReachAd } from "../../../generated/prisma/client";
import type { AdStatus } from "../../../src/types/reach_ads.types";
import { AD_STATUSES } from "../../../src/types/reach_ads.types";
import { getAds, updateAdStatus, deleteAd } from "../../../lib/ads";

export default function AdsListPage() {
  const [ads, setAds] = useState<ReachAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AdStatus | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    const res = await getAds({
      status: (statusFilter as AdStatus) || undefined,
      search: search || undefined,
      page,
      limit: 10,
    });
    if (res.success && res.data) {
      setAds(res.data.data);
      setTotalPages(res.data.totalPages);
    }
    setLoading(false);
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleStatusChange = async (id: string, status: AdStatus) => {
    const res = await updateAdStatus(id, status);
    if (res.success) fetchAds();
    else alert(res.error || "Failed to update status");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    const res = await deleteAd(id);
    if (res.success) fetchAds();
    else alert(res.error || "Failed to delete ad");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-glow">Advertisement</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage ads for the live conversational agent.
        </p>
      </div>

      <hr className="border-gray-200" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as AdStatus | "");
              setPage(1);
            }}
            className="pl-9 pr-8 py-2 rounded-lg border border-gray-300 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 appearance-none bg-white"
          >
            <option value="">All Statuses</option>
            {AD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/dashboard/ads/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-800 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Ad
        </Link>
      </div>


      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-800 rounded-full animate-spin" />
        </div>
      ) : (
        <AdsTable
          ads={ads}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
