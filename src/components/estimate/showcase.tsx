"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Clock, DollarSign, Code, Target } from "lucide-react";
import { TIMELINE_DATA, PROJECT_SCHEDULE } from "@/config";
import { getStepComplexity, getStepHoursMin } from "@/lib/utils";
import OverviewSection from "@/components/estimate/sections/OverviewSection";
import PhasesSection from "@/components/estimate/sections/PhasesSection";
import CostsSection from "@/components/estimate/sections/CostsSection";
import TimelineSection from "@/components/estimate/sections/TimelineSection";
import { SignButton } from "@/components/SignButton";
import { Estimate } from "@/schemas/estimate";

export default function EstimateShowcase({ estimate }: { estimate: Estimate }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    {},
  );
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [thumbStyle, setThumbStyle] = useState<{
    left: number;
    width: number;
    visible: boolean;
  }>({ left: 0, width: 0, visible: false });

  const toggleStep = (id?: string) => {
    if (!id) return;
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Animate thumb under active tab
  useEffect(() => {
    const updateThumb = () => {
      const container = tabsContainerRef.current;
      if (!container) return;
      const tabEl = container.querySelector(
        `[data-section-id="${activeSection}"]`,
      ) as HTMLElement | null;
      if (!tabEl) return;
      const left = tabEl.offsetLeft - container.scrollLeft;
      const width = tabEl.offsetWidth;
      setThumbStyle({ left, width, visible: true });
    };

    updateThumb();
    window.addEventListener("resize", updateThumb);
    const container = tabsContainerRef.current;
    container?.addEventListener("scroll", updateThumb, { passive: true });
    return () => {
      window.removeEventListener("resize", updateThumb);
      container?.removeEventListener("scroll", updateThumb);
    };
  }, [activeSection]);

  const computedSteps = estimate.steps.map((s) => {
    const hoursMin = getStepHoursMin(s);
    const hoursMax = s.disableRate
      ? hoursMin
      : Math.round(hoursMin * estimate.hourMaxMultiplier);
    const costMin = hoursMin * estimate.hourlyRate;
    const costMax = s.disableRate ? costMin : hoursMax * estimate.hourlyRate;
    return {
      ...s,
      hoursMin,
      hoursMax,
      costMin,
      costMax,
      complexity: getStepComplexity(s),
    };
  });

  const totalCostMin = computedSteps.reduce((sum, s) => sum + s.costMin, 0);
  const totalCostMax = computedSteps.reduce((sum, s) => sum + s.costMax, 0);
  const totalHoursMin = computedSteps.reduce((sum, s) => sum + s.hoursMin, 0);
  const totalHoursMax = computedSteps.reduce((sum, s) => sum + s.hoursMax, 0);
  // const totalWeeks = steps.reduce((sum, s) => sum + s.weeks, 0);

  // Monthly cost distribution based on PROJECT_SCHEDULE config
  let runningMin = 0;
  let runningMax = 0;
  const monthlyCostData = estimate.schedule.map((m) => {
    const min = Math.round(totalCostMin * m.percent);
    const max = Math.round(totalCostMax * m.percent);
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

  // Steps allocation per month based on HOURS_PER_MONTH capacity
  const stepsQueue = computedSteps.map((s) => ({
    id: s.id,
    remaining: s.hoursMin,
  }));
  const monthStepAllocations: { month: string; stepIds: string[] }[] =
    estimate.schedule.map((m) => ({ month: `Mois ${m.month}`, stepIds: [] }));
  let stepIdx = 0;
  for (let mIdx = 0; mIdx < monthStepAllocations.length; mIdx++) {
    let capacity = Math.max(
      0,
      Math.round(totalHoursMin * (estimate.schedule[mIdx]?.percent ?? 0)),
    );
    while (capacity > 0 && stepIdx < stepsQueue.length) {
      const cur = stepsQueue[stepIdx];
      if (cur.remaining <= 0) {
        stepIdx++;
        continue;
      }
      if (!monthStepAllocations[mIdx].stepIds.includes(cur?.id || "")) {
        monthStepAllocations[mIdx].stepIds.push(cur?.id || "");
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
  const monthSteps = monthStepAllocations.map((m) => ({
    month: m.month,
    steps: m.stepIds.map((id) => {
      const s = idToStep.get(id)!;
      return { id, name: s.name, color: s.color };
    }),
  }));

  // Complexity derived directly from steps

  const sections = useMemo(
    () => [
      { id: "overview", name: "Aperçu du projet", icon: Target },
      { id: "phases", name: "Étapes du projet", icon: Code },
      { id: "timeline", name: "Calendrier", icon: Clock },
      { id: "costs", name: "Analyse des coûts", icon: DollarSign },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-6">
            <div className="flex items-start md:items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {estimate.name}
                </h1>
                <p className="hidden md:block text-gray-600 text-sm md:text-base"></p>
              </div>
            </div>
            <div className="flex gap-4 items-end md:text-right">
              <div>
                <div className="text-start text-sm text-gray-500">
                  Coût total estimé
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalCostMin.toLocaleString()} - $
                    {totalCostMax.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between">
            <div
              ref={tabsContainerRef}
              className="flex space-x-8 overflow-x-auto"
            >
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    data-section-id={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 py-5 px-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeSection === section.id
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </div>
            {thumbStyle.visible && (
              <div
                className="pointer-events-none absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-out"
                style={{ left: thumbStyle.left, width: thumbStyle.width }}
              />
            )}
            {estimate.signLink && (
              <div className="hidden md:block space-x-2">
                {/* <RainbowButton variant="outline">Signer</RainbowButton> */}
                <SignButton link={estimate.signLink} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {activeSection === "overview" && (
          <OverviewSection
            totalHoursMin={totalHoursMin}
            totalHoursMax={totalHoursMax}
            totalCostMin={totalCostMin}
            totalCostMax={totalCostMax}
            stepsCount={estimate.steps.length}
          />
        )}

        {activeSection === "phases" && (
          <PhasesSection
            computedSteps={computedSteps}
            expandedSteps={expandedSteps}
            toggleStep={toggleStep}
          />
        )}

        {activeSection === "costs" && (
          <CostsSection computedSteps={computedSteps} />
        )}

        {activeSection === "timeline" && (
          <TimelineSection
            monthlyCostData={monthlyCostData}
            timelineData={TIMELINE_DATA}
            monthSteps={monthSteps}
          />
        )}

        {estimate.signLink && (
          <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2">
            <SignButton
              className="px-10 py-6 rounded-xl"
              link={estimate.signLink}
            />
          </div>
        )}
      </main>
    </div>
  );
}
