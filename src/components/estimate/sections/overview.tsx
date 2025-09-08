"use client";

import { Brain, Users, Clock, DollarSign, Code } from "lucide-react";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import Image from "next/image";
import { ICONS } from "@/config";
import { NextLogo } from "@/components/next-logo";
import MastraLogo from "@/components/mastra-logo";
import { Feature } from "@/schemas/features";

type OverviewSectionProps = {
  totalHoursMin: number;
  totalHoursMax: number;
  totalCostMin: number;
  totalCostMax: number;
  stepsCount: number;
  features: Feature[];
  conceptSummary: {
    name: string;
    description?: string;
  };
};

export default function OverviewSection({
  totalHoursMin,
  totalHoursMax,
  totalCostMin,
  totalCostMax,
  stepsCount,
  features,
  conceptSummary,
}: OverviewSectionProps) {
  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aperçu du projet</h2>
          {conceptSummary.description && (
            <p className="text-gray-600 mb-6">{conceptSummary.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-primary/10 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <Clock className="md:hidden h-4 w-4 text-primary" />
                  <span>Total d&apos;heures</span>
                </p>
                {totalHoursMin === totalHoursMax ? (
                  <p className="text-2xl font-bold text-primary">
                    {totalHoursMin}h
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {totalHoursMin}h - {totalHoursMax}h
                  </p>
                )}
              </div>
              <Clock className="hidden md:block h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <DollarSign className="md:hidden h-4 w-4 text-green-600" />
                  <span>Coût total</span>
                </p>
                {totalCostMin === totalCostMax ? (
                  <p className="text-2xl font-bold text-green-900">
                    ${totalCostMin.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-green-900">
                    ${totalCostMin.toLocaleString()} - $
                    {totalCostMax.toLocaleString()}
                  </p>
                )}
              </div>
              <DollarSign className="hidden md:block h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 flex items-center gap-2">
                  <Code className="md:hidden h-4 w-4 text-purple-600" />
                  <span>Étapes du projet</span>
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {stepsCount}
                </p>
              </div>
              <Code className="hidden md:block h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-fit bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Fonctionnalités de l&apos;application
          </h3>
          <div className="space-y-4">
            {features.map((f, idx) => {
              const Icon = ICONS[f.icon as keyof typeof ICONS];
              return (
                <div key={idx} className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${f.color}20`, color: f.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Pile technologique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative flex size-[250px] flex-col items-center justify-center overflow-hidden">
              <OrbitingCircles radius={100} iconSize={36}>
                <NextLogo />
                <MastraLogo />
              </OrbitingCircles>
              <OrbitingCircles radius={50} iconSize={36} reverse>
                <Image src="react.svg" alt="React" width={30} height={30} />
              </OrbitingCircles>
            </div>
            <div className="w-full space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-sm text-gray-500">Front-end</p>
                <p className="font-medium text-gray-900">Next.js</p>
                <p className="text-sm text-gray-600">
                  React framework pour le front-end
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500">Agents IA & Workflows</p>
                <p className="font-medium text-gray-900">Mastra</p>
                <p className="text-sm text-gray-600">
                  Framework d&apos;agents IA et de workflows
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Users className="w-4 h-4" />
                CRM
              </p>
              <p className="font-medium text-gray-900">ACT</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Réunions
              </p>
              <p className="font-medium text-gray-900">
                Microsoft Teams / Google Meet
              </p>
            </div>
            <div className="border rounded-lg p-3 col-span-2">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Agents IA & Workflows
              </p>
              <p className="font-medium text-gray-900">Mastra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
