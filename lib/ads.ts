import type {
  ApiResponse,
  CreateAdPayload,
  UpdateAdPayload,
  AdStatus,
  PaginatedResponse,
  AdFilters,
} from "../src/types/reach_ads.types";
import type { ReachAd } from "../generated/prisma/client";

const BASE_URL = "/api/reach-ads";

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}

export async function getAds(
  filters?: AdFilters
): Promise<ApiResponse<PaginatedResponse<ReachAd>>> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.businessId) params.set("businessId", filters.businessId);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return request(`${BASE_URL}${query ? `?${query}` : ""}`);
}

export async function getAdById(id: string): Promise<ApiResponse<ReachAd>> {
  return request(`${BASE_URL}/${id}`);
}

export async function createAd(
  payload: CreateAdPayload
): Promise<ApiResponse<ReachAd>> {
  return request(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAd(
  id: string,
  payload: UpdateAdPayload
): Promise<ApiResponse<ReachAd>> {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateAdStatus(
  id: string,
  status: AdStatus
): Promise<ApiResponse<ReachAd>> {
  return request(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAd(id: string): Promise<ApiResponse<null>> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}

export async function uploadAdImage(
  id: string,
  file: File
): Promise<ApiResponse<ReachAd>> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/${id}/upload-image`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function deleteAdImage(id: string): Promise<ApiResponse<ReachAd>> {
  const res = await fetch(`${BASE_URL}/${id}/upload-image`, {
    method: "DELETE",
  });
  return res.json();
}
