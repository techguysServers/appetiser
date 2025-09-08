import EstimateShowcase from "@/components/estimate/showcase";
import { createClient } from "@/lib/supabase/server";
import { supabaseEstimateToEstimate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function EstimatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const estimateId = (await params).id;
  const supabase = await createClient();

  let supabaseEstimate;

  if (token) {
    const { data } = await supabase
      .rpc("get_estimate_by_token", {
        p_eid: estimateId,
        p_token: token,
      })
      .single();

    if (data) {
      supabaseEstimate = data;
    }
  }

  if (!supabaseEstimate) {
    const estimateWithSteps = supabase
      .from("estimates")
      .select(`*, features (*), steps (*), schedule (*)`)
      .eq("id", estimateId)
      .single();
    const { data: estimate } = await estimateWithSteps;
    supabaseEstimate = estimate;
  }

  if (!supabaseEstimate) {
    return notFound();
  }

  return (
    <EstimateShowcase estimate={supabaseEstimateToEstimate(supabaseEstimate)} />
  );
}
