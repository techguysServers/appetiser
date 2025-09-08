import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EstimateCard from "@/components/estimate/card";
import { supabaseEstimateToEstimate } from "@/lib/utils";

export const generateMetadata = async () => {
  return {
    title: "Appetiser - Estimates",
  };
};

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const estimateWithSteps = supabase
    .from("estimates")
    .select(`*, features (*), steps (*), schedule (*)`);
  const { data: estimates } = await estimateWithSteps;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Estimates</h1>
        <Button asChild>
          <Link href="/estimates/new">Create a new estimate</Link>
        </Button>
      </div>
      {estimates?.length === 0 && (
        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <h1 className="font-semibold text-lg">No estimates found</h1>
          <h2>
            You have no estimates yet. Start by{" "}
            <Button
              asChild
              variant={"link"}
              className="inline p-0 m-0 text-base"
            >
              <Link href="/estimates/new" className="w-full h-full">
                creating one
              </Link>
            </Button>
            .
          </h2>
          <Button asChild variant={"link"}>
            <Link href="/estimates/new" className="w-full h-full">
              Create a new estimate
            </Link>
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estimates?.map((estimate) => (
          <EstimateCard
            key={estimate.id}
            estimate={supabaseEstimateToEstimate(estimate)}
          />
        ))}
      </div>
    </div>
  );
}
