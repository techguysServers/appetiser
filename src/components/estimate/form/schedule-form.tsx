"use client";

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useEsimateForm } from "@/context/estimate-form-context";

export default function NewEstimateScheduleForm() {
  const { form } = useEsimateForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>
          Select how budget will be scheduled for this estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form.watch("schedule").map((s, index) => (
          <div key={index}>
            <FormField
              control={form.control}
              name={`schedule.${index}.percent`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-4 mb-4">
                  <FormLabel className="shrink-0">Month {s.month}</FormLabel>
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
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        )
                      }
                    />
                  </FormControl>
                  <p>%</p>
                </FormItem>
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
