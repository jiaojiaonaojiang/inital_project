"use client";

import { Upload, X, Video as VideoIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface VideoUploadCardProps {
  videoUrl: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const MAX_SIZE_MB = 50;

export default function VideoUploadCard({
  videoUrl,
  onUpload,
  onRemove,
  disabled,
}: VideoUploadCardProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Invalid file type. Use MP4, WebM, or OGG.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onRemove();
  };

  const displayUrl = preview || videoUrl;

  if (displayUrl) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <VideoIcon className="w-4 h-4" />
          Ad Video
        </h3>
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <video
            src={displayUrl}
            controls
            className="w-full h-48 object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-600 hover:text-red-600 hover:bg-white shadow-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <VideoIcon className="w-4 h-4" />
        Ad Video
      </h3>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => {
          if (disabled) return;
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ACCEPTED_TYPES.join(",");
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 font-medium">
          Drop a video here or click to upload
        </p>
        <p className="text-xs text-gray-400 mt-1">
          MP4, WebM, OGG up to {MAX_SIZE_MB}MB
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}