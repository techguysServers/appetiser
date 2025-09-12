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
import Chat from "./chat/chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function NewEstimateForm({ className }: { className?: string }) {
  const { form, submitForm } = useEsimateForm();
  const [activeTab, setActiveTab] = useState<string>("chat");
  return (
    <div className={cn("grid grid-cols-8 gap-8 pb-24", className)}>
      <Tabs
        defaultValue="chat"
        className={cn(
          "relative flex-1 min-h-0 flex flex-col",
          activeTab === "chat" ? "col-span-2" : "col-span-3",
        )}
        onValueChange={setActiveTab}
      >
        <TabsList className="absolute top-3 left-3 z-10">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="min-h-full relative">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="relative flex flex-col space-y-8 pt-14"
            >
              <NewEstimateGeneralInformations />

              <NewEstimateFeatures />

              <NewEstimateSteps />

              <NewEstimateScheduleForm />
            </form>
          </Form>
        </TabsContent>
        <TabsContent
          value="chat"
          className="relative flex-1 min-h-0 max-h-[90vh] overflow-hidden"
        >
          <Chat />
        </TabsContent>
      </Tabs>
      <div
        className={cn(
          "h-fit max-h-[90vh] sticky top-20 border rounded-lg overflow-auto",
          activeTab === "chat" ? "col-span-6" : "col-span-5",
        )}
      >
        <EstimateShowcase estimate={form.watch()} hideSign />
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Button
          className="p-6 rounded-full"
          onClick={form.handleSubmit(submitForm)}
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
    </div>
  );
}
