import { Estimate, SupabaseEstimate } from "@/schemas/estimate";
import { SupabaseFeature } from "@/schemas/features";
import { SupabaseSchedule } from "@/schemas/schedule";
import { Complexity, Step, SubStep, SupabaseStep } from "@/schemas/step";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const navItems = [
  {
    name: "Features",
    link: "#features",
  },
  {
    name: "Pricing",
    link: "#pricing",
  },
  {
    name: "Playground",
    link: "#playground",
  },
];

export const getStepHoursMin = (step: Step): number => {
  if (step.subSteps && step.subSteps.length > 0) {
    return step.subSteps.reduce((acc, s) => acc + s.hours, 0);
  }
  return 0;
};

export const getStepComplexity = (step: Step): number => {
  if (step.subSteps && step.subSteps.length > 0) {
    const sum = step.subSteps.reduce((acc, s) => acc + s.complexity, 0);
    return sum / step.subSteps.length;
  }
  return Complexity.LOW;
};

export const truncateLabel = (label: string, maxLength: number = 15) => {
  return label.length > maxLength
    ? `${label.substring(0, maxLength)}...`
    : label;
};

export const getComplexityInfo = (level: number) => {
  if (level <= 2) return { label: "Faible", color: "bg-green-400" };
  if (level <= 4) return { label: "Moyenne", color: "bg-amber-500" };
  return { label: "Élevée", color: "bg-red-400" };
};

export const convertComplexityToLabel = (complexity: Complexity) => {
  switch (complexity) {
    case Complexity.LOW:
      return "Faible";
    case Complexity.MEDIUM:
      return "Moyenne";
    case Complexity.HIGH:
      return "Élevée";
    default:
      return "Inconnue";
  }
};

export const supabaseEstimateToEstimate = (
  estimate: SupabaseEstimate & { features: SupabaseFeature[] } & {
    steps: SupabaseStep[];
  } & {
    schedule: SupabaseSchedule[];
  }
): Estimate => {
  console.log(estimate);
  const mainSteps: SupabaseStep[] = estimate.steps.filter(
    (s: SupabaseStep) => s.parent_id === null
  );

  const mapSubSteps = (parentId: string): SubStep[] => {
    const subSteps: SupabaseStep[] = estimate.steps.filter(
      (s: SupabaseStep) => s.parent_id === parentId
    );
    return subSteps.map(
      (s: SupabaseStep, i: number): SubStep => ({
        id: s.id,
        name: s.name,
        description: s.description,
        complexity: s.complexity,
        hours: s.hours ?? 0,
        order: i,
      })
    );
  };

  const schedule = estimate.schedule.map((s) => ({
    duration: s.duration,
    repartition: s.repartition,
  }));

  return {
    id: estimate.id,
    name: estimate.name,
    description: estimate.description,
    primaryColor: estimate.primary_color,
    secondaryColor: estimate.secondary_color,
    hourlyRate: estimate.hourly_rate,
    signLink: estimate.sign_link || undefined,
    hourMaxMultiplier: estimate.hours_max_multiplier || 1,
    features: estimate.features.map((f) => ({
      label: f.label,
      icon: f.icon,
      color: f.color,
    })),
    steps: mainSteps.map((s: SupabaseStep) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      order: 0,
      color: s.color,
      disableRate: s.disable_max_multiplier || false,
      isAdditional: s.is_additional || false,
      notes: s.notes || undefined,
      subSteps: mapSubSteps(s.id),
    })),
    schedule: schedule,
  };
};

export async function convertFilesToDataURLs(
  files: FileList
): Promise<
  { type: "file"; filename: string; mediaType: string; url: string }[]
> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<{
          type: "file";
          filename: string;
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: "file",
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string, // Data URL
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
}
