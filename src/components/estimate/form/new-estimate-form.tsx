"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import NewEstimateGeneralInformations from "./general-informations";
import NewEstimateSteps from "./steps-form";
import { useEsimateForm } from "@/context/estimate-form-context";
import { Loader2 } from "lucide-react";
import NewEstimateScheduleForm from "./schedule-form";
import NewEstimateFeatures from "./overview-features-form";
import EstimateShowcase from "../showcase";

export default function NewEstimateForm() {
  const { form, submitForm } = useEsimateForm();

  return (
    <div className="grid grid-cols-2 gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="relative space-y-8"
        >
          <NewEstimateGeneralInformations />

          <NewEstimateFeatures />

          <NewEstimateSteps />

          <NewEstimateScheduleForm />

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <Button
              type="submit"
              className="p-6 rounded-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving
                </>
              ) : (
                <>Save Estimate</>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="sticky top-10 h-fit border rounded-lg overflow-hidden">
        <EstimateShowcase estimate={form.watch()} hideSign />
      </div>
    </div>
  );
}
