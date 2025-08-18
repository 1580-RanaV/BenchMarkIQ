// lib/insightSchema.js
import { z } from "zod";

export const Insight = z.object({
  kpi: z.string().min(1),
  type: z.enum(["strength", "weakness", "opportunity", "risk"]),
  priority: z.enum(["high", "medium", "low"]),
  impact: z.enum(["High", "Medium", "Low"]),
  message: z.string().min(1).max(280),
  recommendations: z.array(z.string().min(1)).max(5),
});

export const InsightPayload = z.object({
  insights: z.array(Insight),
});
