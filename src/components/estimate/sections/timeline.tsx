"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Schedule } from "@/schemas/schedule";
import { TIMELINE_DATA } from "@/config";

type StepForAllocation = {
  id?: string;
  name: string;
  color: string;
  hoursMin: number;
};

type TimelineSectionProps = {
  schedules: Schedule[];
  totalCostMin: number;
  totalCostMax: number;
  totalHoursMin: number;
  computedSteps: StepForAllocation[];
};

export default function TimelineSection({
  schedules,
  totalCostMin,
  totalCostMax,
  totalHoursMin,
  computedSteps,
}: TimelineSectionProps) {
  const [variant, setVariant] = useState<number>(0);

  const schedule = useMemo(() => schedules[variant], [schedules, variant]);

  const monthlyCostData = useMemo(() => {
    let runningMin = 0;
    let runningMax = 0;
    return schedule.repartition.map((m) => {
      const min = Math.round(totalCostMin * (m.percent / 100));
      const max = Math.round(totalCostMax * (m.percent / 100));
      runningMin += min;
      runningMax += max;
      return {
        month: `Mois ${m.month}`,
        min,
        max,
        cumMin: runningMin,
        cumMax: runningMax,
      };
    });
  }, [schedule, totalCostMin, totalCostMax]);

  const monthSteps = useMemo(() => {
    const stepsQueue = computedSteps.map((s) => ({
      id: s.id,
      remaining: s.hoursMin,
    }));
    const allocations: { month: string; stepIds: string[] }[] =
      schedule.repartition.map((m) => ({
        month: `Mois ${m.month}`,
        stepIds: [],
      }));
    let stepIdx = 0;
    for (let mIdx = 0; mIdx < allocations.length; mIdx++) {
      let capacity = Math.max(
        0,
        Math.round(
          totalHoursMin * ((schedule.repartition[mIdx]?.percent ?? 0) / 100)
        )
      );
      while (capacity > 0 && stepIdx < stepsQueue.length) {
        const cur = stepsQueue[stepIdx];
        if (cur.remaining <= 0) {
          stepIdx++;
          continue;
        }
        if (!allocations[mIdx].stepIds.includes(cur.id ?? "")) {
          allocations[mIdx].stepIds.push(cur.id ?? "");
        }
        const consume = Math.min(capacity, cur.remaining);
        capacity -= consume;
        cur.remaining -= consume;
        if (cur.remaining === 0) {
          stepIdx++;
        }
      }
    }
    const idToStep = new Map(computedSteps.map((s) => [s.id, s] as const));
    return allocations.map((m) => ({
      month: m.month,
      steps: m.stepIds.map((id) => {
        const s = idToStep.get(id)!;
        return { id, name: s.name, color: s.color };
      }),
    }));
  }, [schedule, totalHoursMin, computedSteps]);

  const timelineData = TIMELINE_DATA;
  const hasRange = monthlyCostData.some((d) => d.min !== d.max);

  const monthlyChartConfig: ChartConfig = hasRange
    ? {
        min: { label: "Min", color: "#93C5FD" },
        max: { label: "Max", color: "#2563EB" },
      }
    : {
        min: { label: "Coût", color: "#2563EB" },
      };

  const timelineChartConfig: ChartConfig = {
    planning: { label: "Planification", color: "#3B82F6" },
    development: { label: "Développement", color: "#10B981" },
    testing: { label: "Tests", color: "#F59E0B" },
    deployment: { label: "Déploiement", color: "#EF4444" },
  };

  const cumulativeChartConfig: ChartConfig = hasRange
    ? {
        cumMin: { label: "Cumulé Min", color: "#10B981" },
        cumMax: { label: "Cumulé Max", color: "#EF4444" },
      }
    : {
        cumMin: { label: "Cumulé", color: "#10B981" },
      };
  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Calendrier et coûts
        </h2>
        <div className="inline-flex rounded-md shadow-sm overflow-hidden border">
          {schedules.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setVariant(idx)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                variant === idx
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${idx === 0 ? "" : "border-l"}`}
              aria-pressed={variant === idx}
            >
              {opt.duration} mois
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Répartition des coûts par mois
        </h3>
        <div className="space-y-3">
          {monthlyCostData.map((m, i) => {
            const ms = monthSteps.find((x) => x.month === m.month);
            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">{m.month}</span>
                  {ms && ms.steps.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {ms.steps.map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                          style={{ borderColor: s.color }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {hasRange ? (
                    <>
                      Min:{" "}
                      <span className="font-semibold text-gray-900">
                        ${m.min.toLocaleString()}
                      </span>{" "}
                      · Max:{" "}
                      <span className="font-semibold text-gray-900">
                        ${m.max.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <>
                      Coût:{" "}
                      <span className="font-semibold text-gray-900">
                        ${m.min.toLocaleString()}
                      </span>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Coût mensuel</h3>
        <ChartContainer config={monthlyChartConfig} className="h-80 w-full">
          <BarChart data={monthlyCostData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="min"
              name={hasRange ? "Min" : "Coût"}
              fill={hasRange ? "#93C5FD" : "#2563EB"}
              radius={4}
            />
            {hasRange && (
              <Bar dataKey="max" name="Max" fill="#2563EB" radius={4} />
            )}
          </BarChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Calendrier du projet
          </h2>
          <ChartContainer
            config={timelineChartConfig}
            className="h-[400px] w-full"
          >
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="planning"
                stroke="#3B82F6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="development"
                stroke="#10B981"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="testing"
                stroke="#F59E0B"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="deployment"
                stroke="#EF4444"
                strokeWidth={3}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Cumul des dépenses
          </h3>
          <ChartContainer
            config={cumulativeChartConfig}
            className="h-[400px] w-full"
          >
            <LineChart data={monthlyCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="cumMin"
                name={hasRange ? "Cumulé Min" : "Cumulé"}
                stroke="#10B981"
                strokeWidth={3}
              />
              {hasRange && (
                <Line
                  type="monotone"
                  dataKey="cumMax"
                  name="Cumulé Max"
                  stroke="#EF4444"
                  strokeWidth={3}
                />
              )}
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
