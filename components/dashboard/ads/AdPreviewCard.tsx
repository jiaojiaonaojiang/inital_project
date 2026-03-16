"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface AdPreviewCardProps {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string | null;
}

export default function AdPreviewCard({
  title,
  description,
  ctaText,
  ctaUrl,
  imageUrl,
}: AdPreviewCardProps) {
  const hasContent = title || description || ctaText || imageUrl;

  if (!hasContent) {
    return (
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 text-center">
        <p className="text-sm text-gray-400">
          Fill in the form to see a live preview of your ad.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Ad preview"
            width={400}
            height={200}
            className="w-full h-40 object-cover"
          />
        )}
        <div className="p-4 space-y-2">
          {title && (
            <h4 className="font-semibold text-gray-900 text-base">{title}</h4>
          )}
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
          {ctaText && (
            <button className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
              {ctaText}
              {ctaUrl && <ExternalLink className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
