# Reach Ads Management

An Ads Management Dashboard for business users to create, configure, and manage advertisements served by a live conversational agent.

## Architecture

```
Business User ──▶ Ads Management Frontend (Next.js App Router)
                        │
                        ▼
                  API Routes (Controller Layer)
                        │
                  ┌─────┴──────┐
                  ▼            ▼
            Ads Service    Media Service
                  │            │
                  ▼            ▼
            Prisma (DB)    AWS S3
```

- **Frontend** — Dashboard UI with ad listing, create/edit forms, image upload, placement rules, scheduling
- **Controller Layer** — Next.js API routes that validate input and route to services
- **Ads Service** — CRUD operations, status transitions, placement rules, scheduling logic
- **Media Service** — Image validation, S3 upload/delete
- **Prisma** — ORM for SQLite (dev) / PostgreSQL (prod)
- **S3** — Object storage for ad images

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Prisma ORM + SQLite (dev) |
| Storage | AWS S3 |
| Styling | Tailwind CSS |
| Validation | Zod |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000/dashboard/ads](http://localhost:3000/dashboard/ads) to access the dashboard.

### Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite connection string (`file:./dev.db`) |
| `AWS_S3_BUCKET` | S3 bucket name for media uploads |
| `AWS_REGION` | AWS region |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |

## Project Structure

```
├── app/
│   ├── api/reach-ads/           # API routes (controller layer)
│   │   ├── route.ts             #   GET (list) / POST (create)
│   │   └── [id]/
│   │       ├── route.ts         #   GET / PUT / DELETE
│   │       ├── status/route.ts  #   PATCH (status change)
│   │       └── upload-image/    #   POST / DELETE (image)
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard shell (sidebar + header)
│   │   └── ads/
│   │       ├── page.tsx         # Ads list page
│   │       ├── create/page.tsx  # Create ad page
│   │       └── [id]/
│   │           ├── page.tsx     # Ad detail page
│   │           └── edit/page.tsx# Edit ad page
│   └── layout.tsx               # Root layout
├── components/dashboard/ads/    # Reusable UI components
│   ├── AdsTable.tsx
│   ├── AdForm.tsx
│   ├── AdStatusBadge.tsx
│   ├── PlacementRulesForm.tsx
│   ├── ScheduleForm.tsx
│   ├── ImageUploadCard.tsx
│   └── AdPreviewCard.tsx
├── src/
│   ├── services/                # Business logic
│   │   ├── reach_ads.services.ts
│   │   └── reach_ads_media.services.ts
│   ├── validators/              # Zod schemas
│   │   └── reach_ads.validators.ts
│   ├── types/                   # TypeScript types
│   │   └── reach_ads.types.ts
│   ├── utils/                   # Shared utilities
│   │   ├── s3Upload.ts
│   │   ├── errorHandler.ts
│   │   └── structureBackendResponse.ts
│   └── lib/prisma.ts            # Prisma client singleton
├── lib/ads.ts                   # Frontend API client
├── prisma/
│   └── schema.prisma            # Database schema
└── build-checklist.md           # Full build progress tracker
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reach-ads` | List ads (supports `?status=`, `?search=`, `?page=`, `?limit=`) |
| `POST` | `/api/reach-ads` | Create a new ad |
| `GET` | `/api/reach-ads/:id` | Get ad by ID |
| `PUT` | `/api/reach-ads/:id` | Update an ad |
| `DELETE` | `/api/reach-ads/:id` | Delete an ad |
| `PATCH` | `/api/reach-ads/:id/status` | Change ad status (draft → active → paused → archived) |
| `POST` | `/api/reach-ads/:id/upload-image` | Upload ad image |
| `DELETE` | `/api/reach-ads/:id/upload-image` | Remove ad image |

## Database Models

**ReachAd** — Main advertisement record with title, description, CTA, status, scheduling, and prime-time config.

**ReachAdPlacementRule** — Defines where an ad appears (welcome, mid_conversation, post_response, fallback) with priority, impression limits, and cooldown.

## Features

### Implemented (Stage 1 MVP)
- Ad listing with search, status filtering, and pagination
- Create / edit / delete ads
- Status workflow: draft → active → paused → archived
- Image upload with drag-and-drop, type/size validation
- Placement rules configuration
- Scheduling with timezone and prime-time toggle
- Live ad preview in create/edit forms
- Responsive dashboard with sidebar navigation

### Planned (Stage 2)
- Targeting rules (location, device, business type)
- Schedule window model (day-of-week time slots)
- Audit log
- Auth middleware and business-scoped access control
- Deployment readiness endpoints for live agent consumption
- Analytics hooks
- Full test suite

See `build-checklist.md` for detailed progress tracking.
