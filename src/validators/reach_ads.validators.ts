import { z } from "zod";

const placementRuleSchema = z.object({
  placementType: z.enum(["welcome", "mid_conversation", "post_response", "fallback"]),
  position: z.enum(["top_left", "bottom_left", "top_right", "bottom_right"]).optional(),
  priority: z.number().int().min(0).default(0),
  maxImpressionsPerSession: z.number().int().min(1).optional(),
  cooldownMinutes: z.number().int().min(0).optional(),
  enabled: z.boolean().default(true),
});

export const createAdSchema = z
  .object({
    businessId: z.string().min(1, "Business ID is required"),
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(1000).optional(),
    ctaText: z.string().max(100).optional(),
    ctaUrl: z.string().url("CTA URL must be a valid URL").optional().or(z.literal("")),
    status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
    adType: z.enum(["image", "text", "carousel", "video"]).default("image"),
    startAt: z.string().datetime({ offset: true }).optional(),
    endAt: z.string().datetime({ offset: true }).optional(),
    timezone: z.string().default("UTC"),
    isPrimeTimeEnabled: z.boolean().default(false),
    placementRules: z.array(placementRuleSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return new Date(data.endAt) > new Date(data.startAt);
      }
      return true;
    },
    { message: "End date must be after start date", path: ["endAt"] }
  );

export const updateAdSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    ctaText: z.string().max(100).optional(),
    ctaUrl: z.string().url("CTA URL must be a valid URL").optional().or(z.literal("")),
    adType: z.enum(["image", "text", "carousel", "video"]).optional(),
    startAt: z.string().datetime({ offset: true }).optional().nullable(),
    endAt: z.string().datetime({ offset: true }).optional().nullable(),
    timezone: z.string().optional(),
    isPrimeTimeEnabled: z.boolean().optional(),
    placementRules: z.array(placementRuleSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return new Date(data.endAt) > new Date(data.startAt);
      }
      return true;
    },
    { message: "End date must be after start date", path: ["endAt"] }
  );

export const updateStatusSchema = z.object({
  status: z.enum(["draft", "active", "paused", "archived"]),
});

export type CreateAdInput = z.infer<typeof createAdSchema>;
export type UpdateAdInput = z.infer<typeof updateAdSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
