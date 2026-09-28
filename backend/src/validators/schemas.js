import { z } from "zod";

export const nearbyWellsQuerySchema = z.object({
  radius_km: z.coerce.number().min(0.5).max(100).default(10.0),
  min_score: z.coerce.number().min(0.0).max(1.0).default(0.35),
  formation: z.string().optional()
});

export const wellsFilterSchema = z.object({
  field: z.string().optional(),
  status: z.string().optional(),
  well_type: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

export const eventsFilterSchema = z.object({
  well_id: z.string().optional(),
  type: z.string().optional(),
  formation: z.string().optional(),
  severity: z.string().optional(),
  md_from: z.coerce.number().optional(),
  md_to: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});
