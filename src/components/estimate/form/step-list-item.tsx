import { Button } from "@/components/ui/button";
import { useEsimateForm } from "@/context/estimate-form-context";
import { CreateStepSchema } from "@/schemas/step";
import { GripVertical, Pen, Trash2 } from "lucide-react";
import { useMemo } from "react";
import z from "zod";

export default function StepListItem({
  step,
  onEdit,
  onDelete,
}: {
  step: z.infer<typeof CreateStepSchema>;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { form } = useEsimateForm();
  const stepHours = useMemo(() => {
    return step.subSteps?.reduce((acc, sub) => acc + sub.hours, 0) || 0;
  }, [step.subSteps]);

  const stepCost = useMemo<[number, number]>(() => {
    const hourlyRate = form.getValues("hourlyRate");
    if (step.disableRate)
      return [stepHours * hourlyRate, stepHours * hourlyRate];
    const hourMaxMultiplier = form.getValues("hourMaxMultiplier");
    return [stepHours * hourlyRate, stepHours * hourlyRate * hourMaxMultiplier];
  }, [stepHours, step.disableRate, form]);

  return (
    <div className="w-full border rounded-lg flex justify-between items-center gap-2 px-2 py-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size={"icon"} className="cursor-move">
          <GripVertical className="size-4" />
        </Button>

        <div>
          <div className="font-medium">
            <span
              className={`inline-block size-3 mr-2 rounded-full`}
              style={{ background: step.color }}
            />
            <span>{step.name}</span>
            <span className="text-muted-foreground text-sm">
              {" "}
              - {step.subSteps?.length || 0} étapes
            </span>
          </div>
          {step.description && (
            <p className="text-sm text-muted-foreground max-w-md line-clamp-3">
              {step.description}
            </p>
          )}
        </div>
      </div>
      <div className="font-medium text-muted-foreground">
        {step.disableRate ? (
          <>{stepHours}h</>
        ) : (
          <>
            {stepHours}h - {stepHours * form.getValues("hourMaxMultiplier")}h
          </>
        )}
      </div>
      <div className="font-medium text-muted-foreground">
        {step.disableRate ? (
          <>{stepCost[0]}€</>
        ) : (
          <>
            {stepCost[0]}€ - {!step.disableRate && <>{stepCost[1]}€</>}
          </>
        )}
      </div>
      <div className="flex justify-end items-center gap-2">
        <Button variant="ghost" size={"icon"} onClick={onEdit} type="button">
          <Pen />
        </Button>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
          type="button"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
