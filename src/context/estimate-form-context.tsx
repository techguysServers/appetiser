"use client";

import { createClient } from "@/lib/supabase/client";
import { CreateEstimateSchema, Estimate } from "@/schemas/estimate";
import { createContext, ReactNode, useContext } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Complexity, SupabaseStep } from "@/schemas/step";
import { SupabaseFeature } from "@/schemas/features";

interface EstimateFormContextType {
  form: ReturnType<typeof useForm<z.infer<typeof CreateEstimateSchema>>>;
  submitForm: (data: z.infer<typeof CreateEstimateSchema>) => void;
}

const EstimateFormContext = createContext<EstimateFormContextType | undefined>(
  undefined
);

export function EstimateFormProvider({
  children,
  estimate,
}: {
  children: ReactNode;
  estimate?: Estimate;
}) {
  const defaultValues = estimate
    ? estimate
    : {
        name: "",
        description: "",
        primaryColor: "#000000",
        secondaryColor: "#FFFFFF",
        hourlyRate: 135,
        signLink: "",
        hourMaxMultiplier: 1.2,
        features: [
          {
            label: "",
            icon: "brain",
            color: "#000000",
          },
          {
            label: "",
            icon: "brain",
            color: "#FF0000",
          },
        ],
        steps: [
          {
            name: "Step 1",
            description: "Description for step 1",
            color: "#000000",
            disableRate: false,
            hours: 0,
            subSteps: [
              {
                name: "Sub-step 1.1",
                description: "Description for sub-step 1.1",
                color: "#000000",
                hours: 0,
                complexity: Complexity.MEDIUM,
              },
            ],
          },
        ],
        schedule: [{ duration: 1, repartition: [{ month: 1, percent: 100 }] }],
      };

  const form = useForm<z.infer<typeof CreateEstimateSchema>>({
    defaultValues: defaultValues,
  });

  const submitForm = async (data: z.infer<typeof CreateEstimateSchema>) => {
    const supabaseClient = createClient();

    // You can also use getUser() which will be slower.
    const supabaseClaims = await supabaseClient.auth.getClaims();

    const user = supabaseClaims.data?.claims;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Insert estimate
    const result = await supabaseClient
      .from("estimates")
      .upsert({
        id: estimate?.id,
        name: data.name,
        description: data.description,
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor,
        hourly_rate: data.hourlyRate,
        sign_link: data.signLink,
        hours_max_multiplier: data.hourMaxMultiplier,
        user_id: user.sub,
      })
      .select();

    const estimateId = result.data ? result.data[0].id : null;
    if (!estimateId) {
      console.error("Estimate ID not found after insertion");
      return;
    }

    const formattedFeatures: SupabaseFeature[] = data.features.map(
      (feature) => ({
        id: uuidv4(),
        label: feature.label,
        icon: feature.icon,
        color: feature.color,
        user_id: user.sub,
        estimate_id: estimateId,
      })
    );

    await supabaseClient
      .from("features")
      .delete()
      .eq("estimate_id", estimateId);
    await supabaseClient.from("features").insert(formattedFeatures);

    const formattedSteps: {
      mainSteps: SupabaseStep[];
      subSteps: SupabaseStep[];
    } = {
      mainSteps: [],
      subSteps: [],
    };
    data.steps.map((step) => {
      const parentStepId = uuidv4();

      const mainStep: SupabaseStep = {
        id: parentStepId,
        name: step.name,
        description: step.description || undefined,
        complexity: Complexity.MEDIUM,
        color: step.color,
        disable_max_multiplier: step.disableRate || false,
        is_additional: step.isAdditional || false,
        notes: step.notes || undefined,
        hours: 0,
        parent_id: null,
        estimate_id: estimateId,
        user_id: user.sub,
      };

      const subSteps: SupabaseStep[] = (step.subSteps || []).map((subStep) => ({
        id: uuidv4(),
        name: subStep.name,
        description: subStep.description || undefined,
        complexity: subStep.complexity,
        color: "#000000",
        is_additional: false,
        hours: subStep.hours || 0,
        parent_id: parentStepId,
        estimate_id: estimateId,
        user_id: user.sub,
      }));

      return (
        formattedSteps.mainSteps.push(mainStep),
        formattedSteps.subSteps.push(...subSteps)
      );
    });

    await supabaseClient.from("steps").delete().eq("estimate_id", estimateId);

    await supabaseClient.from("steps").insert(formattedSteps.mainSteps);
    await supabaseClient.from("steps").insert(formattedSteps.subSteps);

    // Insert payment schedule
    const paymentSchedule = data.schedule.map((item) => ({
      estimate_id: estimateId,
      duration: item.duration,
      repartition: item.repartition,
      user_id: user.sub,
    }));

    await supabaseClient
      .from("schedule")
      .delete()
      .eq("estimate_id", estimateId);
    await supabaseClient.from("schedule").insert(paymentSchedule);
  };

  return (
    <EstimateFormContext.Provider
      value={{
        form,
        submitForm,
      }}
    >
      {children}
    </EstimateFormContext.Provider>
  );
}

export function useEsimateForm() {
  const context = useContext(EstimateFormContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
