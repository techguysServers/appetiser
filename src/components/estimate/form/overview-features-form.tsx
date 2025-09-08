import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";
import { ICONS } from "@/config";
import { useEsimateForm } from "@/context/estimate-form-context";
import Color from "color";
import { Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

export default function OverviewFeaturesForm() {
  const { form } = useEsimateForm();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Define the features of your estimate.
          </CardDescription>
        </div>
        <Button
          onClick={() => append({ label: "", icon: "brain", color: "#000000" })}
          variant={"outline"}
          type="button"
        >
          Add Feature
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No features added yet. Click &quot;Add Feature&quot; to create your
            first feature.
          </p>
        )}
        {fields.map((field, index) => (
          <div key={index} className="flex flex-row items-center gap-4">
            <FormField
              control={form.control}
              name={`features.${index}.color`}
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger className="flex gap-2 justify-start items-center bg-transparent">
                      <div
                        className="size-7 rounded-full border"
                        style={{ backgroundColor: field.value }}
                      />
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
              name={`features.${index}.icon`}
              render={({ field }) => {
                const SelectedIcon = ICONS[field.value as keyof typeof ICONS];
                return (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-auto max-w-20">
                          {SelectedIcon && <SelectedIcon className="w-4 h-4" />}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ICONS).map(([key, Icon]) => (
                          <SelectItem
                            key={key}
                            value={key}
                            className="flex items-center gap-2 capitalize"
                          >
                            <Icon className="w-4 h-4" />
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name={`features.${index}.label`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Feature name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant="ghost"
              onClick={() => remove(index)}
              type="button"
              size="icon"
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
