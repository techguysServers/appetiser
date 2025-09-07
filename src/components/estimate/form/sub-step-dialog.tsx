import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertComplexityToLabel } from "@/lib/utils";
import { CreateEstimateSchema } from "@/schemas/estimate";
import { Complexity } from "@/schemas/step";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import React from "react";

export default function SubStepDialog({
  open,
  onOpenChange,
  form,
  index,
  stepIndex,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<z.infer<typeof CreateEstimateSchema>>;
  index: number;
  stepIndex: number;
  onSave: () => void;
}) {
  const subSteps = form.watch(`steps.${stepIndex}.subSteps`) || [];
  const currentSubStep = subSteps[index];

  const [name, setName] = React.useState(currentSubStep?.name || "");
  const [description, setDescription] = React.useState(
    currentSubStep?.description || "",
  );
  const [hours, setHours] = React.useState(currentSubStep?.hours || 0);
  const [complexity, setComplexity] = React.useState(
    currentSubStep?.complexity || Complexity.MEDIUM,
  );

  React.useEffect(() => {
    if (currentSubStep) {
      setName(currentSubStep.name);
      setDescription(currentSubStep.description || "");
      setHours(currentSubStep.hours);
      setComplexity(currentSubStep.complexity);
    }
  }, [currentSubStep, index]);

  const handleSave = () => {
    const updatedSubSteps = [...subSteps];
    updatedSubSteps[index] = {
      ...updatedSubSteps[index],
      name,
      description,
      hours,
      complexity,
    };

    form.setValue(`steps.${stepIndex}.subSteps`, updatedSubSteps);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sub-step</DialogTitle>
          <DialogDescription>
            Modify the details of your sub-step here. Sub-steps help break down
            complex steps into manageable tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Sub-step Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              placeholder="Sub-step Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Hours</Label>
              <Input
                type="number"
                placeholder="10"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label className="font-medium">Complexity</Label>
              <Select
                onValueChange={(v) => setComplexity(Number(v) as Complexity)}
                value={complexity?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a complexity for the step" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Complexity.LOW.toString()}>
                    {convertComplexityToLabel(Complexity.LOW)}
                  </SelectItem>
                  <SelectItem value={Complexity.MEDIUM.toString()}>
                    {convertComplexityToLabel(Complexity.MEDIUM)}
                  </SelectItem>
                  <SelectItem value={Complexity.HIGH.toString()}>
                    {convertComplexityToLabel(Complexity.HIGH)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave}>Save</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
