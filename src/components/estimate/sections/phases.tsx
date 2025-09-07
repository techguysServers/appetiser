"use client";

import { Fragment } from "react";
import {
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarGrid,
  PieChart,
  Pie,
} from "recharts";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getComplexityInfo, truncateLabel } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Complexity, Step } from "@/schemas/step";

type PhasesSectionProps = {
  computedSteps: (Step & {
    hoursMin: number;
    hoursMax: number;
    costMin: number;
    costMax: number;
    complexity: number;
  })[];
  expandedSteps: Record<string, boolean>;
  toggleStep: (id?: string) => void;
};

export default function PhasesSection({
  computedSteps,
  expandedSteps,
  toggleStep,
}: PhasesSectionProps) {
  const hoursChartConfig = {
    hoursMin: { label: "Heures min", color: "oklch(43.2% 0.095 166.913)" },
    hoursMax: { label: "Heures max", color: "oklch(43.2% 0.095 166.913)" },
  } satisfies ChartConfig;
  const pieOpacities = [1, 0.85, 0.7, 0.55, 0.4, 0.3, 0.2];

  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Détail des étapes du projet
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée (heures)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complexité
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {computedSteps.map((phase, index) => (
                <Fragment key={index}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => phase.subSteps && toggleStep(phase.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (phase.subSteps) toggleStep(phase.id);
                      }
                    }}
                    aria-expanded={!!expandedSteps[phase.id ?? ""]}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center gap-2">
                        {phase.subSteps ? (
                          expandedSteps[phase.id ?? ""] ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )
                        ) : null}
                        {phase.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {phase.disableRate
                        ? `${phase.hoursMin}h`
                        : `${phase.hoursMin}h - ${phase.hoursMax}h`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {phase.disableRate
                        ? `$${phase.costMin.toLocaleString()}`
                        : `$${phase.costMin.toLocaleString()} - $${phase.costMax.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const info = getComplexityInfo(phase.complexity);
                        const percent = Math.min(
                          100,
                          Math.max(0, Math.round((phase.complexity / 6) * 100)),
                        );
                        return (
                          <div className="min-w-[100px]">
                            <div className="flex items-center justify-between gap-2 mb-1 text-xs text-gray-600">
                              <span>Complexité</span>
                              <span className="font-medium text-gray-800">
                                {info.label}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className={`h-2 ${info.color} transition-all duration-300`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                  {expandedSteps[phase.id ?? ""] && phase.subSteps && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 pb-6">
                        <div className="mt-2 rounded-md border border-gray-200 bg-white">
                          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-md">
                            <h4 className="text-sm font-semibold text-gray-800">
                              Sous-étapes
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="text-xs uppercase text-gray-500">
                                  <th className="px-4 py-2 text-left">
                                    Vue/Écran
                                  </th>
                                  <th className="px-4 py-2 text-left">
                                    Heures
                                  </th>
                                  <th className="px-4 py-2 text-left">
                                    Complexité
                                  </th>
                                  <th className="px-4 py-2 text-left">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {phase.subSteps.map((s, i) => (
                                  <tr key={i} className="border-t text-sm">
                                    <td className="px-4 py-2 font-medium text-gray-900">
                                      {s.name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                      {s.hours}h
                                    </td>
                                    <td className="px-4 py-2">
                                      <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                          s.complexity === Complexity.HIGH
                                            ? "bg-red-100 text-red-800"
                                            : s.complexity === Complexity.MEDIUM
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {s.complexity}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                      {s.description}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {phase.notes && phase.notes.length > 0 && (
                          <div className="mt-4 rounded-md border border-gray-200 bg-white">
                            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-md">
                              <h4 className="text-sm font-semibold text-gray-800">
                                Intégrations & Enjeux
                              </h4>
                            </div>
                            <ul className="px-6 py-4 list-disc text-sm text-gray-700 space-y-1">
                              {/*{phase.notes.map((note, i) => (
                                <li key={i}>{note}</li>
                              ))}*/}
                              {phase.notes}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Répartition de la durée par étape (heures)
          </h3>
          <ChartContainer
            config={hoursChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <RadarChart
              data={computedSteps.map((s) => ({
                name: truncateLabel(s.name, 14),
                hoursMin: s.hoursMin,
                hoursMax: s.hoursMax,
              }))}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
              <PolarGrid />
              <Radar
                dataKey="hoursMin"
                fill="var(--color-hoursMin)"
                fillOpacity={0.6}
                dot={{ r: 3, fillOpacity: 1 }}
              />
              <Radar
                dataKey="hoursMax"
                fill="var(--color-hoursMax)"
                fillOpacity={0.4}
                dot={{ r: 3, fillOpacity: 1 }}
              />
              <ChartLegend
                verticalAlign="top"
                content={<ChartLegendContent payload={[]} />}
              />
            </RadarChart>
          </ChartContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Répartition des coûts par étape
          </h3>
          <ChartContainer
            config={{ cost: { label: "Coût" } }}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={computedSteps.map((s, i) => ({
                  name: truncateLabel(s.name, 16),
                  value: s.costMax,
                  fill: `oklch(43.2% 0.095 166.913 / ${pieOpacities[i % pieOpacities.length]})`,
                }))}
                dataKey="value"
                nameKey="name"
                stroke="hsl(var(--border))"
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
