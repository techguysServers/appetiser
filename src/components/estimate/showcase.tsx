"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  DollarSign,
  Code,
  Target,
  ListPlus,
  UsersRound,
} from "lucide-react";
import { TIMELINE_DATA, PROJECT_SCHEDULE, OverviewFeature } from "@/config";
import { getStepComplexity, getStepHoursMin } from "@/lib/utils";
import OverviewSection from "@/components/estimate/sections/overview";
import PhasesSection from "@/components/estimate/sections/phases";
import CostsSection from "@/components/estimate/sections/costs";
import TimelineSection from "@/components/estimate/sections/timeline";
import { SignButton } from "@/components/SignButton";
import { Estimate } from "@/schemas/estimate";
import OptionsSection from "./sections/options";

export default function EstimateShowcase({ estimate }: { estimate: Estimate }) {
  const [activeSection, setActiveSection] = useState("overview");
  // Single offer configuration
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedOptions, setExpandedOptions] = useState<
    Record<string, boolean>
  >({});
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [thumbStyle, setThumbStyle] = useState<{
    left: number;
    width: number;
    visible: boolean;
  }>({ left: 0, width: 0, visible: false });

  const selectedFeatures: OverviewFeature[] = []; //estimate.overviewFeatures;
  const selectedConceptSummary = { name: "name", description: "description" }; //estimate.conceptSummary;

  const toggleStep = (id?: string) => {
    if (!id) return;
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOption = (id?: string) => {
    if (!id) return;
    setExpandedOptions((prev) => ({ ...prev, [id]: !prev[id] }));
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

  const selectedSteps = estimate.steps;

  const computedSteps = selectedSteps.map((s) => {
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

  const computedOptions = useMemo(() => {
    const additionalOptions = estimate.steps.filter((s) => s.isAdditional);
    return additionalOptions.map((s) => {
      const hoursMin = getStepHoursMin(s);
      const hoursMax = Math.round(hoursMin * estimate.hourMaxMultiplier);
      const costMin = hoursMin * estimate.hourlyRate;
      const costMax = hoursMax * estimate.hourlyRate;
      return {
        ...s,
        hoursMin,
        hoursMax,
        costMin,
        costMax,
        complexity: getStepComplexity(s),
      };
    });
  }, [estimate]);

  const totalCostMin = computedSteps.reduce((sum, s) => sum + s.costMin, 0);
  const totalCostMax = computedSteps.reduce((sum, s) => sum + s.costMax, 0);
  const totalHoursMin = computedSteps.reduce((sum, s) => sum + s.hoursMin, 0);
  const totalHoursMax = computedSteps.reduce((sum, s) => sum + s.hoursMax, 0);
  // const totalWeeks = steps.reduce((sum, s) => sum + s.weeks, 0);

  const sections = useMemo(
    () => [
      { id: "overview", name: "Aperçu du projet", icon: Target },
      { id: "phases", name: "Étapes du projet", icon: Code },
      { id: "options", name: "Options additionnelles", icon: ListPlus },
      { id: "timeline", name: "Calendrier", icon: Clock },
      { id: "costs", name: "Analyse des coûts", icon: DollarSign },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-light/10">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-6">
            <div className="flex items-start md:items-center space-x-3">
              <div className="bg-emerald-200 p-2 rounded-lg">
                <UsersRound />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {estimate.name}
                </h1>
                <p className="hidden md:block text-gray-600 text-sm md:text-base">
                  Estimation de développement et plan de projet
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-end md:text-right md:items-center">
              <div>
                <div className="text-start text-sm text-gray-500">
                  Coût total estimé
                </div>
                <div className="flex items-center gap-2">
                  {totalCostMin === totalCostMax ? (
                    <p className="text-2xl font-bold text-primary text-right w-full">
                      ${totalCostMin.toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      ${totalCostMin.toLocaleString()} - $
                      {totalCostMax.toLocaleString()}
                    </p>
                  )}
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
                        ? "text-primary"
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
                className="pointer-events-none absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
                style={{ left: thumbStyle.left, width: thumbStyle.width }}
              />
            )}
            {/* <div className="hidden md:block space-x-2">
                <SignButton link={SIGN_LINK} />
              </div> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-40">
        {activeSection === "overview" && (
          <OverviewSection
            totalHoursMin={totalHoursMin}
            totalHoursMax={totalHoursMax}
            totalCostMin={totalCostMin}
            totalCostMax={totalCostMax}
            stepsCount={selectedSteps.length}
            features={selectedFeatures}
            conceptSummary={selectedConceptSummary}
          />
        )}

        {activeSection === "phases" && (
          <PhasesSection
            computedSteps={computedSteps}
            expandedSteps={expandedSteps}
            toggleStep={toggleStep}
          />
        )}

        {activeSection === "options" && (
          <OptionsSection
            computedOptions={computedOptions}
            expandedOptions={expandedOptions}
            toggleOption={toggleOption}
          />
        )}

        {activeSection === "costs" && (
          <CostsSection computedSteps={computedSteps} />
        )}

        {activeSection === "timeline" && (
          <TimelineSection
            schedules={estimate.schedule}
            totalCostMin={totalCostMin}
            totalCostMax={totalCostMax}
            totalHoursMin={totalHoursMin}
            computedSteps={computedSteps.map((s) => ({
              id: s.id,
              name: s.name,
              color: s.color,
              hoursMin: s.hoursMin,
            }))}
          />
        )}

        {estimate.signLink && (
          <div className="fixed bottom-6 right-6 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 flex justify-end">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-200 px-4 py-2">
                <SignButton
                  className="h-10 px-5 rounded-full"
                  link={estimate.signLink}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
