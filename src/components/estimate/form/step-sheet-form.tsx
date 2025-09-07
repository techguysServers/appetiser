import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerFormat,
} from "@/components/ui/shadcn-io/color-picker";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CreateEstimateSchema } from "@/schemas/estimate";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import Color from "color";
import { Complexity } from "@/schemas/step";
import TaskTable from "./task-table";
import SubStepDialog from "./sub-step-dialog";
import React from "react";

export default function StepSheetForm({
  open,
  onOpenChange,
  form,
  index,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<z.infer<typeof CreateEstimateSchema>>;
  index: number;
}) {
  const [subStepOpen, setSubStepOpen] = React.useState<boolean>(false);
  const [subStepIndex, setSubStepIndex] = React.useState<number>(0);

  const subSteps = form.watch(`steps.${index}.subSteps`) || [];

  const handleAddSubStep = () => {
    const currentSubSteps = form.getValues(`steps.${index}.subSteps`) || [];
    const newSubStep = {
      name: `Sub-step ${currentSubSteps.length + 1}`,
      description: "",
      complexity: Complexity.MEDIUM,
      hours: 0,
      color: "#000000",
      order: currentSubSteps.length,
      disableRate: false,
      isAdditional: false,
      notes: "",
      subSteps: [],
    };

    form.setValue(`steps.${index}.subSteps`, [...currentSubSteps, newSubStep]);
    setSubStepIndex(currentSubSteps.length);
    setSubStepOpen(true);
  };

  const handleSubStepDelete = (taskIndex: number) => {
    const currentSubSteps = form.getValues(`steps.${index}.subSteps`) || [];
    const updatedSubSteps = currentSubSteps.filter((_, i) => i !== taskIndex);
    form.setValue(`steps.${index}.subSteps`, updatedSubSteps);
  };

  const handleEditSubStep = (taskIndex: number) => {
    setSubStepIndex(taskIndex);
    setSubStepOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="min-w-xl">
          <SheetHeader>
            <SheetTitle>Edit Step</SheetTitle>
            <SheetDescription>
              Modify the details of your step here.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <FormField
              control={form.control}
              name={`steps.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <Label className="font-medium">Name</Label>
                  <FormControl>
                    <Input placeholder="Step Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`steps.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <Label className="font-medium">Description</Label>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Step description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`steps.${index}.color`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="flex gap-2 justify-start bg-transparent"
                    >
                      <Button variant={"outline"}>
                        <div
                          className="w-9 h-5 rounded border"
                          style={{ backgroundColor: field.value }}
                        />

                        {field.value}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <ColorPicker
                        defaultValue={field.value}
                        onChange={(v: Parameters<typeof Color.rgb>[0]) => {
                          // v is an array of [r, g, b, a]
                          // convert it to hex
                          const hex = Color(v).hex();
                          field.onChange(hex);
                        }}
                        className="max-w-sm min-h-32"
                      >
                        <ColorPickerSelection className="min-h-48" />
                        <div className="flex items-center gap-4">
                          <ColorPickerEyeDropper />
                          <div className="grid w-full gap-1">
                            <ColorPickerHue />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ColorPickerOutput />
                          <FormControl>
                            <ColorPickerFormat className="bg-muted" />
                          </FormControl>
                        </div>
                      </ColorPicker>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name={`steps.${index}.disableRate`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-medium">Disable rate</Label>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        When enabled, the hourly rate will not be applied to
                        this step.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`steps.${index}.isAdditional`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-medium">Mark as additional</Label>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Consider as an additional feature and list it separately
                        in the estimate.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`steps.${index}.notes`}
              render={({ field }) => (
                <FormItem>
                  <Label>Notes</Label>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Additional notes for this step"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="flex justify-between mb-2">
                Tasks
                <Button
                  variant={"link"}
                  className="h-fit p-0 m-0 text-sm"
                  onClick={handleAddSubStep}
                >
                  Add task
                </Button>
              </Label>
              <TaskTable
                tasks={subSteps.map((step, idx) => ({
                  ...step,
                  id: `substep-${idx}`,
                }))}
                onEditTask={(task) => {
                  const taskIndex = subSteps.findIndex(
                    (s, idx) => `substep-${idx}` === task.id,
                  );
                  handleEditSubStep(taskIndex);
                }}
                onDeleteTask={(task) => {
                  const taskIndex = subSteps.findIndex(
                    (s, idx) => `substep-${idx}` === task.id,
                  );
                  handleSubStepDelete(taskIndex);
                }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <SubStepDialog
        open={subStepOpen}
        onOpenChange={setSubStepOpen}
        form={form}
        index={subStepIndex}
        stepIndex={index}
        onSave={() => {
          setSubStepOpen(false);
        }}
      />
    </>
  );
}
