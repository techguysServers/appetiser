import { Brain, Users, Trophy, TrendingUp, ArrowUp } from "lucide-react";
import { Step } from "./schemas/step";

export type OverviewFeature = {
  label: string;
  icon: "Brain" | "Users" | "Trophy" | "TrendingUp" | "ArrowRight";
  color: string; // hex color like #0EA5E9
};

export type OfferConfig = {
  id: string;
  name: string;
  conceptSummary: { name: string; description: string };
  steps: Step[];
  overviewFeatures: OverviewFeature[];
};

export type ProjectMonth = {
  name: string;
  percent: number; // 0..1 portion of the total budget
};

export const ICONS = {
  brain: Brain,
  users: Users,
  trophy: Trophy,
  "trending-up": TrendingUp,
  "arrow-right": ArrowUp,
};

// Configure project duration and monthly budget allocation
export const PROJECT_SCHEDULE: ProjectMonth[] = [
  { name: "Mois 1", percent: 0.1 },
  { name: "Mois 2", percent: 0.2 },
  { name: "Mois 3", percent: 0.2 },
  { name: "Mois 4", percent: 0.2 },
  { name: "Mois 5", percent: 0.3 },
];

export const TIMELINE_DATA = [
  {
    month: "Mois 1",
    planning: 30,
    development: 0,
    testing: 0,
    deployment: 0,
  },
  {
    month: "Mois 2",
    planning: 60,
    development: 20,
    testing: 0,
    deployment: 0,
  },
  {
    month: "Mois 3",
    planning: 100,
    development: 50,
    testing: 10,
    deployment: 0,
  },
  {
    month: "Mois 4",
    planning: 100,
    development: 80,
    testing: 40,
    deployment: 10,
  },
  {
    month: "Mois 5",
    planning: 100,
    development: 100,
    testing: 100,
    deployment: 100,
  },
];
