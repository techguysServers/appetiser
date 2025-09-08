import NewEstimateForm from "@/components/estimate/form/new-estimate-form";
import { EstimateFormProvider } from "@/context/estimate-form-context";

export default function NewEstimatePage() {
  return (
    <>
      <h1 className="text-4xl font-semibold text-center">
        Let&apos;s close a new deal! 🚀
      </h1>
      <EstimateFormProvider>
        <NewEstimateForm />
      </EstimateFormProvider>
    </>
  );
}
