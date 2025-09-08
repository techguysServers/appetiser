"use client";

import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { convertComplexityToLabel, getComplexityInfo } from "@/lib/utils";
import { Complexity, Step } from "@/schemas/step";

type OptionsSectionProps = {
  computedOptions: (Step & {
    id?: string;
    hoursMin: number;
    hoursMax: number;
    costMin: number;
    costMax: number;
    complexity: number;
  })[];
  expandedOptions: Record<string, boolean>;
  toggleOption: (id?: string) => void;
};

export default function OptionsSection({
  computedOptions,
  expandedOptions,
  toggleOption,
}: OptionsSectionProps) {
  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Options additionnelles
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Option
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
              {computedOptions.map((opt, index) => (
                <Fragment key={index}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => opt.subSteps && toggleOption(opt.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (opt.subSteps) toggleOption(opt.id);
                      }
                    }}
                    aria-expanded={!!expandedOptions[opt.id ?? ""]}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center gap-2">
                        {opt.subSteps ? (
                          expandedOptions[opt.id ?? ""] ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )
                        ) : null}
                        {opt.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {opt.disableRate
                        ? `${opt.hoursMin}h`
                        : `${opt.hoursMin}h - ${opt.hoursMax}h`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {opt.disableRate
                        ? `$${opt.costMin.toLocaleString()}`
                        : `$${opt.costMin.toLocaleString()} - $${opt.costMax.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const info = getComplexityInfo(opt.complexity);
                        const percent = Math.min(
                          100,
                          Math.max(0, Math.round((opt.complexity / 6) * 100))
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
                  {expandedOptions[opt.id ?? ""] && opt.subSteps && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 pb-6">
                        <div className="mt-2 rounded-md border border-gray-200 bg-white">
                          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-md">
                            <h4 className="text-sm font-semibold text-gray-800">
                              Détails
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
                                {opt.subSteps.map((s: Step, i: number) => (
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
    </div>
  );
}
