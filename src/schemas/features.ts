import z from "zod";

export type SupabaseFeature = {
  id: string;
  label: string;
  icon: string;
  color: string;
  user_id: string;
  estimate_id: string;
};

export const CreateFeatureSchema = z.object({
  label: z.string({ message: "Name is required" }),
  icon: z.string().default("brain"),
  color: z.string().default("#000000"),
});

export type Feature = z.infer<typeof CreateFeatureSchema>;
