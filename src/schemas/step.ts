import { z } from "zod";

export enum Complexity {
  LOW = 1,
  MEDIUM = 3,
  HIGH = 5,
}

export type Step = {
  id?: string;
  name: string;
  description?: string;
  hours: number;
  disableRate: boolean;
  complexity: Complexity;
  color: string;
  subSteps?: Step[];
};

export type SupabaseStep = {
  id: string;
  name: string;
  description?: string;
  complexity: number;
  color: string;
  disable_max_multiplier?: boolean;
  hours?: number;
  parent_id: string | null;
  estimate_id: string;
  user_id: string;
};

export const CreateStepSchema: z.ZodType<Step> = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string().optional(),
  order: z.number().min(0, "Order must be a non-negative integer").default(0),
  hours: z.number().min(0, "Hours must be a non-negative number").default(0),
  disableRate: z.boolean().default(false),
  complexity: z.enum(Complexity).default(Complexity.LOW),
  color: z.string().default("#000000"),
  subSteps: z.array(z.lazy(() => CreateStepSchema)).default([]),
});
