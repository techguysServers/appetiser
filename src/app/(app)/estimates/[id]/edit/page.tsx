import NewEstimateForm from "@/components/estimate/form/new-estimate-form";
import { EstimateFormProvider } from "@/context/estimate-form-context";
import { createClient } from "@/lib/supabase/server";
import { supabaseEstimateToEstimate } from "@/lib/utils";

export default async function EditEstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const estimateId = (await params).id;
  const supabase = await createClient();

  const estimateWithSteps = supabase
    .from("estimates")
    .select(`*, features (*), steps (*), schedule (*)`)
    .eq("id", estimateId)
    .single();
  const { data: estimate, error } = await estimateWithSteps;

  if (error || !estimate) {
    return <div>Estimate not found</div>;
  }

  return (
    <EstimateFormProvider estimate={supabaseEstimateToEstimate(estimate)}>
      <NewEstimateForm />
    </EstimateFormProvider>
  );
}
