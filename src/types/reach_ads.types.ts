export type AdStatus = "draft" | "active" | "paused" | "archived";
export type AdType = "image" | "text" | "carousel" | "video";
export type PlacementType = "welcome" | "mid_conversation" | "post_response" | "fallback";

export interface CreateAdPayload {
  businessId: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  status?: AdStatus;
  adType?: AdType;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  isPrimeTimeEnabled?: boolean;
  placementRules?: CreatePlacementRulePayload[];
}

export interface UpdateAdPayload {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  adType?: AdType;
  startAt?: string | null;
  endAt?: string | null;
  timezone?: string;
  isPrimeTimeEnabled?: boolean;
  placementRules?: CreatePlacementRulePayload[];
}

export interface CreatePlacementRulePayload {
  placementType: PlacementType;
  priority?: number;
  maxImpressionsPerSession?: number;
  cooldownMinutes?: number;
  enabled?: boolean;
}

export interface AdFilters {
  status?: AdStatus;
  businessId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const AD_STATUSES: AdStatus[] = ["draft", "active", "paused", "archived"];
export const AD_TYPES: AdType[] = ["image", "text", "carousel", "video"];
export const PLACEMENT_TYPES: PlacementType[] = ["welcome", "mid_conversation", "post_response", "fallback"];

export const VALID_STATUS_TRANSITIONS: Record<AdStatus, AdStatus[]> = {
  draft: ["active", "archived"],
  active: ["paused", "archived"],
  paused: ["active", "archived"],
  archived: [],
};
