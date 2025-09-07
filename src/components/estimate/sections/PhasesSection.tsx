"use client";

import { Fragment } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  convertComplexityToLabel,
  getComplexityInfo,
  truncateLabel,
} from "@/lib/utils";
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
                    aria-expanded={!!expandedSteps[phase.id || ""]}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center gap-2">
                        {phase.subSteps ? (
                          expandedSteps[phase.id || ""] ? (
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
                  {expandedSteps[phase.id || ""] && phase.subSteps && (
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
                                {phase.subSteps.map((s: Step, i: number) => (
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
                                        {convertComplexityToLabel(s.complexity)}
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={computedSteps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tickFormatter={(value) => truncateLabel(value)}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hoursMin" name="Heures min" fill="#93C5FD" />
              <Bar dataKey="hoursMax" name="Heures max" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Répartition des coûts par étape
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={computedSteps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tickFormatter={(value) => truncateLabel(value)}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="costMin" name="Coût min" fill="#86EFAC" />
              <Bar dataKey="costMax" name="Coût max" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
