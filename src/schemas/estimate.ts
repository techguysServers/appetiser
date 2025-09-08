import z from "zod";
import { CreateStepSchema } from "./step";
import { CreateScheduleSchema } from "./schedule";
import { CreateFeatureSchema } from "./features";

export type SupabaseEstimate = {
  id: string;
  name: string;
  description?: string;
  primary_color: string;
  hourly_rate: number;
  duration: number;
  user_id: string;
  created_at: Date;
  hours_max_multiplier?: number;
  sign_link?: string;
  secondary_color?: string;
};

export const CreateEstimateSchema = z.object({
  name: z.string({ message: "Name is required" }).min(1, "Name is required"),
  description: z.string().optional(),
  primaryColor: z.string().default("#000000"),
  secondaryColor: z.string().default("#FFFFFF").optional(),
  hourlyRate: z
    .number()
    .min(0, "Hourly rate must be a non-negative number")
    .default(135),
  signLink: z.url().optional(),
  hourMaxMultiplier: z.number().min(1).default(1.2),
  features: z.array(z.lazy(() => CreateFeatureSchema)).default([]),
  steps: z.array(z.lazy(() => CreateStepSchema)).default([]),
  schedule: CreateScheduleSchema.default([]),
});

export type Estimate = z.infer<typeof CreateEstimateSchema> & { id?: string };
