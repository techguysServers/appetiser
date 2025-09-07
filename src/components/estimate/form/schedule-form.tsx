"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEsimateForm } from "@/context/estimate-form-context";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

export default function NewEstimateScheduleForm() {
  const { form } = useEsimateForm();

  const {
    fields: variants,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  useEffect(() => {
    console.log("Variants", variants);
  }, [variants]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>
            Select how budget will be scheduled for this estimate.
          </CardDescription>
        </div>
        <Button
          type="button"
          onClick={() => {
            append({
              duration: 4,
              repartition: [
                { month: 1, percent: 20 },
                { month: 2, percent: 20 },
                { month: 3, percent: 20 },
                { month: 4, percent: 20 },
              ],
            });
          }}
        >
          Add variant
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={`duration-${0}`}>
          <TabsList>
            {variants.map((variant, index) => (
              <TabsTrigger key={variant.id} value={`duration-${index}`}>
                {form.watch(`schedule.${index}.duration`)} month
                {form.watch(`schedule.${index}.duration`) > 1 ? "s" : ""}
              </TabsTrigger>
            ))}
          </TabsList>
          {variants.map((variant, variantIndex) => (
            <TabsContent key={variantIndex} value={`duration-${variantIndex}`}>
              <div className="my-2">
                <FormField
                  control={form.control}
                  name={`schedule.${variantIndex}.duration`}
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Duration (months)</FormLabel>
                      <div className="flex items-end gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const duration = Number(e.target.value);

                              field.onChange(Number(e.target.value));
                              if (isNaN(duration) || duration < 1) {
                                return;
                              }
                              const currentRepartition = form.getValues(
                                `schedule.${variantIndex}.repartition`,
                              );
                              let repartition = currentRepartition;
                              if (duration > currentRepartition.length) {
                                // Add months
                                repartition = [
                                  ...currentRepartition,
                                  ...Array.from(
                                    {
                                      length:
                                        duration - currentRepartition.length,
                                    },
                                    (_, i) => ({
                                      month: currentRepartition.length + i + 1,
                                      percent: 0,
                                    }),
                                  ),
                                ];
                              } else if (duration < currentRepartition.length) {
                                // Remove months
                                repartition = currentRepartition.slice(
                                  0,
                                  duration,
                                );
                              }
                              // Ensure total percent is 100
                              const totalPercent = repartition.reduce(
                                (acc, r) => acc + r.percent,
                                0,
                              );
                              if (totalPercent !== 100) {
                                const factor = 100 / totalPercent;
                                repartition = repartition.map((r) => ({
                                  month: r.month,
                                  percent: Math.round(r.percent * factor),
                                }));
                                // Adjust last month to ensure total is exactly 100
                                const adjustedTotal = repartition.reduce(
                                  (acc, r) => acc + r.percent,
                                  0,
                                );
                                const difference = 100 - adjustedTotal;
                                repartition[repartition.length - 1].percent +=
                                  difference;
                              }
                              console.log("Updated repartition", repartition);
                              update(variantIndex, {
                                duration: Number(e.target.value),
                                repartition: repartition,
                              });
                            }}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => remove(variantIndex)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {variant.repartition.map((s, index) => (
                  <FormField
                    key={`repartition-${index}`}
                    control={form.control}
                    name={`schedule.${variantIndex}.repartition.${index}.percent`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 mb-4">
                        <FormLabel className="shrink-0">
                          Month {s.month}
                        </FormLabel>
                        <FormControl>
                          <Slider
                            step={1}
                            min={0}
                            max={100}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            className="w-16"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                Math.min(
                                  100,
                                  Math.max(0, Number(e.target.value)),
                                ),
                              )
                            }
                          />
                        </FormControl>
                        <p>%</p>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
