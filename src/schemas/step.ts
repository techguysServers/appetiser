import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export enum Complexity {
  LOW = 1,
  MEDIUM = 3,
  HIGH = 5,
}

export type SupabaseStep = {
  id: string;
  name: string;
  description?: string;
  complexity: number;
  color: string;
  disable_max_multiplier?: boolean;
  is_additional: boolean;
  notes?: string;
  hours?: number;
  parent_id: string | null;
  estimate_id: string;
  user_id: string;
};

export const CreateSubStepSchema = z.object({
  id: z.uuidv4().optional().default(uuidv4()),
  name: z.string({ message: "Name is required" }),
  description: z.string().optional(),
  complexity: z.enum(Complexity).default(Complexity.LOW),
  order: z.number().min(0, "Order must be a non-negative integer").default(0),
  hours: z.number().min(0, "Hours must be a non-negative number").default(0),
});

export const CreateSubStepWithParentIdSchema = CreateSubStepSchema.extend({
  parent_id: z.uuidv4(),
});

export const EditSubStepSchema = z.object({
  id: z.uuidv4(),
  name: z.string().optional(),
  description: z.string().optional(),
  complexity: z.enum(Complexity).optional(),
  order: z.number().optional(),
  hours: z.number().optional(),
});

export const EditSubStepWithParentIdSchema = EditSubStepSchema.extend({
  parent_id: z.uuidv4(),
});

export const CreateStepSchema = z.object({
  id: z.uuidv4().default(uuidv4()),
  name: z.string({ message: "Name is required" }),
  description: z.string().optional(),
  order: z.number().min(0, "Order must be a non-negative integer").default(0),
  disableRate: z.boolean().default(false),
  isAdditional: z.boolean().default(false),
  notes: z.string().optional(),
  color: z.string().default("#000000"),
  subSteps: z.array(CreateSubStepSchema).default([]),
});

export const EditStepSchema = z.object({
  id: z.uuidv4(),
  name: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  disableRate: z.boolean().optional(),
  isAdditional: z.boolean().optional(),
  notes: z.string().optional(),
  color: z.string().optional(),
  subSteps: z.array(EditSubStepSchema).optional(),
}); // Used for AI tool

export type Step = z.infer<typeof CreateStepSchema> & { id?: string };

export type SubStep = z.infer<typeof CreateSubStepSchema> & { id?: string };

export const AICreateStepsSchema = z.object({
  steps: z.array(
    CreateStepSchema.omit({ id: true }).extend({
      subSteps: z.array(CreateSubStepSchema.omit({ id: true })).min(1),
    })
  ),
});
