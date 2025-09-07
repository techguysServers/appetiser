import z from "zod";

export type SupabaseSchedule = {
  id: string;
  month: number;
  percent: number;
  estimate_id: string;
  user_id: string;
  created_at: Date;
};

export const CreateScheduleSchema = z.array(
  z.object({
    month: z.number().min(1),
    percent: z.number().min(0).max(100),
  }),
);
