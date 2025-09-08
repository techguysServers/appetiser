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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { truncateLabel } from "@/lib/utils";
import { Step } from "@/schemas/step";

type CostsSectionProps = {
  computedSteps: (Step & {
    hoursMin: number;
    hoursMax: number;
    costMin: number;
    costMax: number;
    complexity: number;
  })[];
};

export default function CostsSection({ computedSteps }: CostsSectionProps) {
  const pieData = computedSteps.map((s) => ({
    name: s.name,
    value: Math.round((s.costMin + s.costMax) / 2),
    color: s.color,
  }));
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Analyse des coûts
        </h2>
        <div className="gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Répartition du budget
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | string, _name: string, entry) => {
                    const v = typeof value === "number" ? value : Number(value);
                    const pct =
                      pieTotal > 0 ? Math.round((v / pieTotal) * 100) : 0;
                    const label = entry?.payload?.name ?? "";
                    return [`${pct}%`, label];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Détail des coûts (min-max)
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {computedSteps.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 p-2 md:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="font-medium text-gray-900">{item.name}</p>
                  </div>
                  <p className="text-lg md:text-end font-bold text-gray-900">
                    {item.disableRate
                      ? `$${item.costMin.toLocaleString()}`
                      : `$${item.costMin.toLocaleString()} - $${item.costMax.toLocaleString()}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Coût min vs max par étape
        </h3>
        <ResponsiveContainer width="100%" height={400}>
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
            <Bar dataKey="costMin" name="Min" fill="#93C5FD" />
            <Bar dataKey="costMax" name="Max" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
