import z from "zod";

export type SupabaseSchedule = {
  id: string;
  duration: number;
  repartition: { month: number; percent: number }[];
  estimate_id: string;
  user_id: string;
  created_at: Date;
};

export const CreateScheduleSchema = z.array(
  z.object({
    duration: z
      .number()
      .min(1, "Duration must be a non-negative number")
      .default(1),
    repartition: z.array(
      z.object({
        month: z.number().min(1),
        percent: z.number().min(0).max(100),
      }),
    ),
  }),
);

export type Schedule = z.infer<typeof CreateScheduleSchema>[number];
