"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Estimate } from "@/schemas/estimate";
import { getStepComplexity, getStepHoursMin } from "@/lib/utils";
import { useMemo } from "react";
import { ExternalLink, Pen } from "lucide-react";
import ShareDialog from "./share-dialog";

export default function EstimateCard({
  estimate,
}: {
  estimate: Estimate & { id?: string };
}) {
  const computedSteps = useMemo(
    () =>
      estimate.steps.map((s) => {
        const hoursMin = getStepHoursMin(s);
        const hoursMax = s.disableRate
          ? hoursMin
          : Math.round(hoursMin * estimate.hourMaxMultiplier);
        const costMin = hoursMin * estimate.hourlyRate;
        const costMax = s.disableRate
          ? costMin
          : hoursMax * estimate.hourlyRate;
        return {
          ...s,
          hoursMin,
          hoursMax,
          costMin,
          costMax,
          complexity: getStepComplexity(s),
        };
      }),
    [estimate],
  );

  const totalCostMin = useMemo(
    () => computedSteps.reduce((sum, s) => sum + s.costMin, 0),
    [computedSteps],
  );
  const totalCostMax = useMemo(
    () => computedSteps.reduce((sum, s) => sum + s.costMax, 0),
    [computedSteps],
  );
  const totalHoursMin = useMemo(
    () => computedSteps.reduce((sum, s) => sum + s.hoursMin, 0),
    [computedSteps],
  );
  const totalHoursMax = useMemo(
    () => computedSteps.reduce((sum, s) => sum + s.hoursMax, 0),
    [computedSteps],
  );

  return (
    <Card key={estimate.id} className="max-w-96">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          {estimate.name}
          <Button asChild variant={"ghost"} size={"icon"}>
            <Link href={`/estimates/${estimate.id}/edit`}>
              <Pen />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col gap-4">
        <ul className="flex-1">
          <li>
            {totalHoursMin} - {totalHoursMax} heures
          </li>
          <li>
            {totalCostMin}€ - {totalCostMax}€
          </li>
          <li>{estimate.steps.length} étapes</li>
        </ul>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/e/${estimate.id}`}>View</Link>
          </Button>
          <ShareDialog
            name={estimate.name}
            id={estimate.id!}
            hasSignLink={estimate.signLink !== undefined}
          >
            <Button variant={"outline"} size={"icon"}>
              <ExternalLink />
            </Button>
          </ShareDialog>
        </div>
      </CardContent>
    </Card>
  );
}
