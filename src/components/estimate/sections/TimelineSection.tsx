"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type TimelineSectionProps = {
  monthlyCostData: {
    month: string;
    min: number;
    max: number;
    cumMin: number;
    cumMax: number;
  }[];
  timelineData: {
    month: string;
    planning: number;
    development: number;
    testing: number;
    deployment: number;
  }[];
  monthSteps?: {
    month: string;
    steps: { id: string; name: string; color: string }[];
  }[];
};

export default function TimelineSection({
  monthlyCostData,
  timelineData,
  monthSteps = [],
}: TimelineSectionProps) {
  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
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
                  Min:{" "}
                  <span className="font-semibold text-gray-900">
                    ${m.min.toLocaleString()}
                  </span>{" "}
                  · Max:{" "}
                  <span className="font-semibold text-gray-900">
                    ${m.max.toLocaleString()}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Calendrier du projet
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
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
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Coût mensuel</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min" name="Min" fill="#93C5FD" />
              <Bar dataKey="max" name="Max" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Cumul des dépenses
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumMin"
                name="Cumulé Min"
                stroke="#10B981"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="cumMax"
                name="Cumulé Max"
                stroke="#EF4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
