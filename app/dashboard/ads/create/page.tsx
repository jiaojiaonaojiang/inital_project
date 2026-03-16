"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdForm from "../../../../components/dashboard/ads/AdForm";

export default function CreateAdPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/ads"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Ad</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure your ad details, placement rules, and scheduling.
          </p>
        </div>
      </div>
      <AdForm mode="create" />
    </div>
  );
}
