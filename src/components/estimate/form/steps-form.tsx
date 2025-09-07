import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Complexity } from "@/schemas/step";
import { useFieldArray } from "react-hook-form";
import StepListItem from "./step-list-item";
import React from "react";
import StepSheetForm from "./step-sheet-form";
import { useEsimateForm } from "@/context/estimate-form-context";

export default function NewEstimateSteps() {
  const { form } = useEsimateForm();
  const {
    fields: steps,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "steps",
  });
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editingStepIndex, setEditingStepIndex] = React.useState<number>(0);

  const handleAddStep = () => {
    append({
      name: `Step ${steps.length + 1}`,
      description: "",
      complexity: Complexity.MEDIUM,
      hours: 0,
      color: "#000000",
      disableRate: false,
      subSteps: [],
    });
    setEditingStepIndex(steps.length);
    setSheetOpen(true);
  };

  const handleEditStep = (index: number) => {
    setEditingStepIndex(index);
    setSheetOpen(true);
  };

  const handleStepDelete = (id: string) => {
    remove(steps.findIndex((s) => s.id === id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Steps</CardTitle>
          <CardDescription>
            Define the steps of your estimate and the tasks associated with each
            step.
          </CardDescription>
        </div>
        <Button variant={"outline"} type="button" onClick={handleAddStep}>
          Add Step
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No steps added yet. Click &quot;Add Step&quot; to create your first
            step.
          </p>
        )}
        {form.watch("steps") &&
          steps.map((s, idx) => {
            const refreshedStep = form.getValues(`steps.${idx}`);
            return (
              <StepListItem
                key={s.id}
                step={refreshedStep}
                onEdit={() =>
                  handleEditStep(steps.findIndex((step) => step.id === s.id))
                }
                onDelete={() => handleStepDelete(s.id)}
              />
            );
          })}
      </CardContent>
      <StepSheetForm
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        form={form}
        index={editingStepIndex}
      />
    </Card>
  );
}
