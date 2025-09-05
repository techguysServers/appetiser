import { COMPLEXITY_SCORE, Step } from "./config";

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
  return step.hours ?? 0;
};

export const getStepComplexity = (step: Step): number => {
  if (step.subSteps && step.subSteps.length > 0) {
    const sum = step.subSteps.reduce(
      (acc, s) => acc + COMPLEXITY_SCORE[s.complexity],
      0,
    );
    return sum / step.subSteps.length;
  }
  return step?.complexity ?? 0;
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
