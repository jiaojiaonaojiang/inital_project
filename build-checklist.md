# Build Checklist — Ads Management Domain

> Auto-generated from `masterplan.md`. Each item is marked as **done** or **not done** based on the current codebase.

---

## Stage 1: Core Ads Management MVP

| # | Task | Status | File / Directory |
|---|------|--------|------------------|
| 1 | Ad listing page | ✅ Done | `app/dashboard/ads/page.tsx` |
| 2 | Create ad form | ✅ Done | `app/dashboard/ads/create/page.tsx` |
| 3 | Edit ad form | ✅ Done | `app/dashboard/ads/[id]/edit/page.tsx` |
| 4 | Activate / deactivate ads | ✅ Done | `app/api/reach-ads/[id]/status/route.ts` |
| 5 | Upload image | ✅ Done | `app/api/reach-ads/[id]/upload-image/route.ts` |
| 6 | Save placement rules | ✅ Done | Embedded in ad create/update payload |
| 7 | Save schedule | ✅ Done | Embedded in ad create/update payload |
| 8 | Store in DB (Prisma) | ✅ Done | `prisma/schema.prisma`, `src/lib/prisma.ts` |
| 9 | Store image in S3 | ✅ Done | `src/utils/s3Upload.ts`, `src/services/reach_ads_media.services.ts` |
| 10 | Basic filtering by status | ✅ Done | `app/dashboard/ads/page.tsx` (status dropdown) |

**Stage 1 Result: 10/10 complete**

---

## Stage 2: Advanced Ad Operations

| # | Task | Status | File / Directory |
|---|------|--------|------------------|
| 1 | Preview ad | ✅ Done | `components/dashboard/ads/AdPreviewCard.tsx` |
| 2 | Schedule validation (conflict detection) | ❌ Not done | — |
| 3 | Audit fields (created_by, updated_by populated) | ⚠️ Partial | Fields exist in schema but not populated by auth |
| 4 | Soft delete / archive | ✅ Done | Status transition to `archived` via PATCH |
| 5 | Targeting rules (ReachAdTargetingRule model) | ❌ Not done | — |
| 6 | Prime-time configuration UI | ✅ Done | `components/dashboard/ads/ScheduleForm.tsx` (toggle) |
| 7 | Pagination | ✅ Done | `app/dashboard/ads/page.tsx`, `src/services/reach_ads.services.ts` |
| 8 | Search | ✅ Done | `app/dashboard/ads/page.tsx` (search input) |
| 9 | Filters (status) | ✅ Done | `app/dashboard/ads/page.tsx` (dropdown) |
| 10 | Deployment readiness endpoints | ❌ Not done | — |
| 11 | Analytics hooks | ❌ Not done | — |

**Stage 2 Result: 7/11 complete (4 remaining)**

---

## Database Models (Prisma)

| # | Model | Status | File |
|---|-------|--------|------|
| 1 | `ReachAd` | ✅ Done | `prisma/schema.prisma` |
| 2 | `ReachAdPlacementRule` | ✅ Done | `prisma/schema.prisma` |
| 3 | `ReachAdTargetingRule` | ❌ Not done | — |
| 4 | `ReachAdScheduleWindow` | ❌ Not done | — |
| 5 | `ReachAdAuditLog` | ❌ Not done | — |

### ReachAd Fields

| Field | Status |
|-------|--------|
| id | ✅ |
| business_id | ✅ |
| title | ✅ |
| description | ✅ |
| cta_text | ✅ |
| cta_url | ✅ |
| status (draft, active, paused, archived) | ✅ |
| ad_type (image, text, carousel, video) | ✅ |
| image_url | ✅ |
| image_key | ✅ |
| start_at | ✅ |
| end_at | ✅ |
| timezone | ✅ |
| is_prime_time_enabled | ✅ |
| created_by | ✅ |
| updated_by | ✅ |
| created_at | ✅ |
| updated_at | ✅ |

### ReachAdPlacementRule Fields

| Field | Status |
|-------|--------|
| id | ✅ |
| reach_ad_id | ✅ |
| placement_type | ✅ |
| priority | ✅ |
| max_impressions_per_session | ✅ |
| cooldown_minutes | ✅ |
| enabled | ✅ |

---

## Backend — File Inventory

### Services

| # | File | Status | Methods Implemented |
|---|------|--------|---------------------|
| 1 | `src/services/reach_ads.services.ts` | ✅ Done | createAd, listAds, findAdById, updateAd, changeAdStatus, deleteAd |
| 2 | `src/services/reach_ads_media.services.ts` | ✅ Done | uploadAdImage, deleteAdImage |
| 3 | `src/services/reach_ads_deployment.services.ts` | ❌ Not done | — |

### Controllers / API Routes

> The masterplan describes Express-style controllers. We used Next.js API routes instead, which serve the same purpose (receive request → validate → call service → respond).

| # | File | Status | Handles |
|---|------|--------|---------|
| 1 | `app/api/reach-ads/route.ts` | ✅ Done | `GET /reach-ads` (list), `POST /reach-ads` (create) |
| 2 | `app/api/reach-ads/[id]/route.ts` | ✅ Done | `GET` (by id), `PUT` (update), `DELETE` |
| 3 | `app/api/reach-ads/[id]/status/route.ts` | ✅ Done | `PATCH` (status change) |
| 4 | `app/api/reach-ads/[id]/upload-image/route.ts` | ✅ Done | `POST` (upload), `DELETE` (remove image) |
| 5 | Deployment routes (`/reach-ads-deployment/*`) | ❌ Not done | — |
| 6 | Separate placement-rules endpoints | ❌ Not done | Embedded in ad payload (acceptable for MVP) |
| 7 | Separate schedule endpoints | ❌ Not done | Embedded in ad payload (acceptable for MVP) |

### Utilities

| # | File | Status |
|---|------|--------|
| 1 | `src/utils/s3Upload.ts` | ✅ Done |
| 2 | `src/utils/errorHandler.ts` | ✅ Done |
| 3 | `src/utils/structureBackendResponse.ts` | ✅ Done |
| 4 | `src/utils/awsSecretsManager.ts` | ❌ Not done |

### Validators & Types

| # | File | Status |
|---|------|--------|
| 1 | `src/validators/reach_ads.validators.ts` | ✅ Done |
| 2 | `src/types/reach_ads.types.ts` | ✅ Done |

### Prisma / DB

| # | File | Status |
|---|------|--------|
| 1 | `prisma/schema.prisma` | ✅ Done |
| 2 | `prisma.config.ts` | ✅ Done |
| 3 | `prisma/migrations/` | ✅ Done |
| 4 | `src/lib/prisma.ts` | ✅ Done |

### Middleware

| # | File | Status |
|---|------|--------|
| 1 | `src/middlewares/auth.middleware.ts` | ❌ Not done |

---

## Backend — API Endpoints

| Method | Endpoint | Status | File |
|--------|----------|--------|------|
| GET | `/reach-ads` | ✅ Done | `app/api/reach-ads/route.ts` |
| GET | `/reach-ads/:id` | ✅ Done | `app/api/reach-ads/[id]/route.ts` |
| POST | `/reach-ads` | ✅ Done | `app/api/reach-ads/route.ts` |
| PUT | `/reach-ads/:id` | ✅ Done | `app/api/reach-ads/[id]/route.ts` |
| PATCH | `/reach-ads/:id/status` | ✅ Done | `app/api/reach-ads/[id]/status/route.ts` |
| DELETE | `/reach-ads/:id` | ✅ Done | `app/api/reach-ads/[id]/route.ts` |
| POST | `/reach-ads/:id/upload-image` | ✅ Done | `app/api/reach-ads/[id]/upload-image/route.ts` |
| DELETE | `/reach-ads/:id/image` | ✅ Done | `app/api/reach-ads/[id]/upload-image/route.ts` |
| GET | `/reach-ads-deployment/eligible` | ❌ Not done | — |
| POST | `/reach-ads-deployment/:id/validate` | ❌ Not done | — |

---

## Backend — Validation Rules

| # | Rule | Status | Where |
|---|------|--------|-------|
| 1 | Title required | ✅ Done | `src/validators/reach_ads.validators.ts` |
| 2 | CTA URL must be valid | ✅ Done | `src/validators/reach_ads.validators.ts` |
| 3 | Start date before end date | ✅ Done | `src/validators/reach_ads.validators.ts` |
| 4 | Image required before activation | ✅ Done | `src/services/reach_ads.services.ts` → `changeAdStatus()` |
| 5 | Priority must be numeric | ✅ Done | `src/validators/reach_ads.validators.ts` |
| 6 | Cooldown cannot be negative | ✅ Done | `src/validators/reach_ads.validators.ts` |
| 7 | Status transitions must be valid | ✅ Done | `src/types/reach_ads.types.ts` → `VALID_STATUS_TRANSITIONS` |

---

## Backend — Service Methods

### reach_ads.services.ts

| Method | Status |
|--------|--------|
| createAd | ✅ |
| listAds | ✅ |
| findAdById | ✅ |
| updateAd | ✅ |
| changeAdStatus | ✅ |
| deleteAd | ✅ |
| validateAdPayload | ✅ (via Zod in validators) |
| validateScheduling | ✅ (via Zod refine) |
| validatePlacementRules | ✅ (via Zod in validators) |

### reach_ads_media.services.ts

| Method | Status |
|--------|--------|
| uploadAdImage | ✅ |
| deleteAdImage | ✅ |
| validateImageFile | ✅ (in `src/utils/s3Upload.ts`) |
| generateS3Key | ✅ (in `src/utils/s3Upload.ts`) |

---

## Frontend — Pages

| # | Route | Status | File |
|---|-------|--------|------|
| 1 | `/dashboard/ads` — Ads list | ✅ Done | `app/dashboard/ads/page.tsx` |
| 2 | `/dashboard/ads/create` — Create ad | ✅ Done | `app/dashboard/ads/create/page.tsx` |
| 3 | `/dashboard/ads/[id]` — Ad detail/preview | ✅ Done | `app/dashboard/ads/[id]/page.tsx` |
| 4 | `/dashboard/ads/[id]/edit` — Edit ad | ✅ Done | `app/dashboard/ads/[id]/edit/page.tsx` |
| 5 | Dashboard layout (sidebar, header) | ✅ Done | `app/dashboard/layout.tsx` |

---

## Frontend — Components

| # | Component | Status | File |
|---|-----------|--------|------|
| 1 | AdsTable | ✅ Done | `components/dashboard/ads/AdsTable.tsx` |
| 2 | AdForm | ✅ Done | `components/dashboard/ads/AdForm.tsx` |
| 3 | AdStatusBadge | ✅ Done | `components/dashboard/ads/AdStatusBadge.tsx` |
| 4 | PlacementRulesForm | ✅ Done | `components/dashboard/ads/PlacementRulesForm.tsx` |
| 5 | ScheduleForm | ✅ Done | `components/dashboard/ads/ScheduleForm.tsx` |
| 6 | ImageUploadCard | ✅ Done | `components/dashboard/ads/ImageUploadCard.tsx` |
| 7 | AdPreviewCard | ✅ Done | `components/dashboard/ads/AdPreviewCard.tsx` |

---

## Frontend — Ads List Page Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Table/grid of ads | ✅ |
| 2 | Status badges | ✅ |
| 3 | Filters: active, draft, paused | ✅ |
| 4 | Button: create ad | ✅ |
| 5 | Row action: edit | ✅ |
| 6 | Row action: activate/pause | ✅ |

## Frontend — Create Ad Page Sections

| # | Section | Status |
|---|---------|--------|
| 1 | Basic information | ✅ |
| 2 | Image upload | ✅ |
| 3 | Placement rules | ✅ |
| 4 | Scheduling | ✅ |
| 5 | Prime-time toggle | ✅ |
| 6 | Preview | ✅ |
| 7 | Save as draft / publish | ✅ |

## Frontend — Ad Detail Page Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Metadata view | ✅ |
| 2 | Status display | ✅ |
| 3 | Scheduling summary | ✅ |
| 4 | Placement summary | ✅ |
| 5 | Image preview | ✅ |
| 6 | History / audit log | ❌ Not done |

---

## Frontend — API Integration (lib/ads.ts)

| # | Function | Status | File |
|---|----------|--------|------|
| 1 | getAds() | ✅ Done | `lib/ads.ts` |
| 2 | getAdById(id) | ✅ Done | `lib/ads.ts` |
| 3 | createAd(payload) | ✅ Done | `lib/ads.ts` |
| 4 | updateAd(id, payload) | ✅ Done | `lib/ads.ts` |
| 5 | uploadAdImage(id, file) | ✅ Done | `lib/ads.ts` |
| 6 | updateAdStatus(id, status) | ✅ Done | `lib/ads.ts` |
| 7 | deleteAd(id) | ✅ Done | `lib/ads.ts` |
| 8 | deleteAdImage(id) | ✅ Done | `lib/ads.ts` |

---

## Frontend — Validation (Client-Side)

| # | Rule | Status | Where |
|---|------|--------|-------|
| 1 | Inline errors on API failure | ✅ Done | `components/dashboard/ads/AdForm.tsx` |
| 2 | Disabled submit on missing title | ✅ Done | `components/dashboard/ads/AdForm.tsx` |
| 3 | Image type checks | ✅ Done | `components/dashboard/ads/ImageUploadCard.tsx` |
| 4 | Image file size checks | ✅ Done | `components/dashboard/ads/ImageUploadCard.tsx` |
| 5 | Shared Zod schema for frontend (form-validation.ts) | ❌ Not done | — |

---

## UI Design (Section 17)

| # | Feature | Status |
|---|---------|--------|
| 1 | Top header: Ads Management | ✅ |
| 2 | Secondary action bar: Create Ad, Filters, Search | ✅ |
| 3 | Main table | ✅ |
| 4 | Separate page for edit | ✅ |
| 5 | Preview card on right side in create/edit | ✅ |
| 6 | Form sections: Basic Details, Media, Placement, Scheduling, Preview, Actions | ✅ |

---

## Security & Access Control (Section 18)

| # | Task | Status |
|---|------|--------|
| 1 | Auth middleware for route protection | ❌ Not done |
| 2 | Scope ad records by business_id | ⚠️ Partial (field exists, no auth enforcement) |
| 3 | Prevent cross-business editing | ❌ Not done |
| 4 | Validate S3 upload ownership | ❌ Not done |
| 5 | Sanitize URLs and text input | ✅ Done (Zod validation) |
| 6 | Rate limit upload endpoints | ❌ Not done |

---

## Testing Strategy (Section 19)

| # | Test | Status |
|---|------|--------|
| 1 | Create valid ad | ❌ Not done |
| 2 | Reject invalid scheduling | ❌ Not done |
| 3 | Reject activation without image | ❌ Not done |
| 4 | Update status flow | ❌ Not done |
| 5 | Upload image success/failure | ❌ Not done |
| 6 | Frontend: form validation | ❌ Not done |
| 7 | Frontend: table load state | ❌ Not done |
| 8 | Frontend: create ad submission | ❌ Not done |
| 9 | Frontend: image upload preview | ❌ Not done |
| 10 | Frontend: edit existing ad | ❌ Not done |

---

## Implementation Phases (Section 14 & 20)

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Data design — Prisma models, migration | ✅ Done |
| 2 | Backend CRUD — create, get, update, status, delete | ✅ Done |
| 3 | Media upload — S3 helper, upload endpoint, save URL | ✅ Done |
| 4 | Frontend list & create — pages, API integration | ✅ Done |
| 5 | Edit & preview — edit page, preview card, status toggle | ✅ Done |
| 6 | Scheduling & prime-time — backend validation, UI component | ✅ Done |
| 7 | Deployment readiness — eligible endpoint, agent logic | ❌ Not done |

---

## Optional / Future Items (lib/)

| # | File | Status |
|---|------|--------|
| 1 | `lib/ads.ts` | ✅ Done |
| 2 | `lib/form-validation.ts` | ❌ Not done |
| 3 | `lib/zustandStore/useAdsStore.ts` | ❌ Not done (page-level state used instead) |

---

## Summary

| Category | Done | Total | % |
|----------|------|-------|---|
| **Stage 1 MVP Features** | 10 | 10 | 100% |
| **Stage 2 Advanced Features** | 7 | 11 | 64% |
| **Database Models** | 2 | 5 | 40% |
| **Backend Services** | 2 | 3 | 67% |
| **API Endpoints** | 8 | 10 | 80% |
| **Backend Validation Rules** | 7 | 7 | 100% |
| **Frontend Pages** | 5 | 5 | 100% |
| **Frontend Components** | 7 | 7 | 100% |
| **API Integration Functions** | 8 | 8 | 100% |
| **Security & Access Control** | 1 | 6 | 17% |
| **Testing** | 0 | 10 | 0% |
| **Implementation Phases** | 6 | 7 | 86% |

### What remains to build

1. **Deployment readiness** — `reach_ads_deployment` service, controller, routes
2. **Targeting rules** — `ReachAdTargetingRule` Prisma model + UI
3. **Schedule windows** — `ReachAdScheduleWindow` Prisma model + day/time UI
4. **Audit log** — `ReachAdAuditLog` Prisma model + history view
5. **Auth middleware** — route protection, business_id scoping
6. **Schedule conflict detection** — backend logic
7. **AWS Secrets Manager util** — `src/utils/awsSecretsManager.ts`
8. **Frontend form-validation.ts** — shared Zod schemas for client-side
9. **Zustand store** — if state management grows beyond page-level
10. **Analytics hooks** — tracking/reporting
11. **Tests** — full backend + frontend test suite
