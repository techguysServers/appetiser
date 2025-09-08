import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEsimateForm } from "@/context/estimate-form-context";
import Color from "color";
import { CircleQuestionMark } from "lucide-react";

export default function NewEstimateGeneralInformations() {
  const { form } = useEsimateForm();
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Informations</CardTitle>
        <CardDescription>
          Provide the name of the estimate as well as other general
          informations.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Estimate Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary color</FormLabel>
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
                      <ColorPickerFormat className="bg-muted" />
                    </div>
                  </ColorPicker>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary color</FormLabel>
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

        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="135"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hourMaxMultiplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <span>Hour max multiplier</span>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    This coefficient is used to calculate the maximum number of
                    hours for a step. For example, if the given number of hours
                    is 10 and the coefficient is 1.2, the maximum number of
                    hours will be 12 (10 * 1.2).
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="1.2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sign link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/sign"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
