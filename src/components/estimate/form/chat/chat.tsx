import { MessageSquare, MicIcon } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import ChatMessage from "./message";
import LoadingMessage from "./loading-message";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { MODELS } from "@/lib/models";
import { cn } from "@/lib/utils";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import {
  CreateStepSchema,
  CreateSubStepWithParentIdSchema,
  EditStepSchema,
  EditSubStepWithParentIdSchema,
  Step,
} from "@/schemas/step";
import z from "zod";
import { useEsimateForm } from "@/context/estimate-form-context";
import { useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { EditEstimateSchema } from "@/schemas/estimate";

export default function Chat({ className }: { className?: string }) {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(MODELS[0].id);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);
  const { form } = useEsimateForm();
  const { append } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const { messages, sendMessage, status, addToolResult, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === "get_steps") {
        console.log("Getting steps", form.getValues("steps"));
        addToolResult({
          tool: "get_steps",
          toolCallId: toolCall.toolCallId,
          output: form.getValues("steps"),
        });
      }

      if (toolCall.toolName === "edit_estimate") {
        const estimate = toolCall.input as z.infer<typeof EditEstimateSchema>;

        console.log("Edited estimate", estimate);

        // For every key in estimate from tool call, set the value in the form
        Object.keys(estimate).forEach((key) => {
          form.setValue(
            key as keyof z.infer<typeof EditEstimateSchema>,
            estimate[key as keyof z.infer<typeof EditEstimateSchema>],
          );
        });

        addToolResult({
          tool: "edit_estimate",
          toolCallId: toolCall.toolCallId,
          output: estimate,
        });
      }

      //   if (toolCall.toolName === "add_step") {
      //     const steps = (toolCall.input as z.infer<typeof AICreateStepsSchema>)
      //       .steps;

      //     console.log("Added steps", steps);

      //     steps.forEach((s) => {
      //       append({
      //         ...s,
      //         id: uuidv4(),
      //         subSteps: s.subSteps.map((ss) => ({
      //           ...ss,
      //           id: uuidv4(),
      //         })),
      //       });
      //     });

      //     addToolResult({
      //       tool: "add_step",
      //       toolCallId: toolCall.toolCallId,
      //       output: steps,
      //     });
      //   }

      if (toolCall.toolName === "add_step") {
        const step = toolCall.input as z.infer<typeof CreateStepSchema>;

        console.log("Added step", step);

        append({
          ...step,
          id: uuidv4(),
          subSteps: step.subSteps.map((ss) => ({
            ...ss,
            id: uuidv4(),
          })),
        });

        addToolResult({
          tool: "add_step",
          toolCallId: toolCall.toolCallId,
          output: step,
        });
      }

      if (toolCall.toolName === "edit_step") {
        const step = toolCall.input as z.infer<typeof EditStepSchema>;

        const formStep: Step | undefined = form
          .getValues("steps")
          .find((s) => s.id === step.id);
        if (!formStep) {
          return;
        }
        const stepIndex = form
          .getValues("steps")
          .findIndex((s) => s.id === step.id);

        const updatedSubSteps = formStep.subSteps.map((s) => {
          const updatedSubStep = step.subSteps?.find((ss) => ss.id === s.id);
          return updatedSubStep ? { ...s, ...updatedSubStep } : s;
        });

        form.setValue(`steps.${stepIndex}`, {
          ...formStep,
          ...step,
          subSteps: updatedSubSteps,
        });

        addToolResult({
          tool: "edit_step",
          toolCallId: toolCall.toolCallId,
          output: step,
        });
      }

      if (toolCall.toolName === "add_sub_step") {
        const subStep = toolCall.input as z.infer<
          typeof CreateSubStepWithParentIdSchema
        >;

        const formStep: Step | undefined = form
          .getValues("steps")
          .find((s) => s.id === subStep.parent_id);
        if (!formStep) {
          return;
        }

        const parentStepIndex = form
          .getValues(`steps`)
          .findIndex((s) => s.id === subStep.parent_id);

        const updatedSubSteps = [
          ...formStep.subSteps,
          {
            ...subStep,
            id: uuidv4(),
          },
        ];

        form.setValue(`steps.${parentStepIndex}.subSteps`, updatedSubSteps);

        addToolResult({
          tool: "add_sub_step",
          toolCallId: toolCall.toolCallId,
          output: updatedSubSteps,
        });
      }

      if (toolCall.toolName === "edit_sub_step") {
        const input = toolCall.input as z.infer<
          typeof EditSubStepWithParentIdSchema
        >;

        const formStep: Step | undefined = form
          .getValues("steps")
          .find((s) => s.id === input.parent_id);
        if (!formStep) {
          return;
        }

        const parentStepIndex = form
          .getValues("steps")
          .findIndex((s) => s.id === input.parent_id);

        let updatedSubStep;
        const updatedSubSteps = formStep.subSteps.map((ss) => {
          if (ss.id === input.id) {
            updatedSubStep = { ...ss, ...input };
            return updatedSubStep;
          }
          return ss;
        });

        form.setValue(`steps.${parentStepIndex}.subSteps`, updatedSubSteps);

        addToolResult({
          tool: "edit_sub_step",
          toolCallId: toolCall.toolCallId,
          output: updatedSubStep,
        });
      }

      console.log(toolCall);
    },
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text:
          message.text ||
          "Extract information from the provided document and edit the estimate accordingly.",
        files: message.files,
      },
      {
        body: {
          model: model,
        },
      },
    );
    setText("");
  };

  return (
    <div
      className={cn(
        "border rounded-xl h-full max-h-full flex flex-col overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col flex-1 min-h-0 max-h-full">
        <Conversation className="flex-1 overflow-y-hidden space-y-2">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="No messages yet"
                description="Start a conversation to see messages here"
              />
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {error && (
              <ChatMessage
                message={{
                  role: "assistant",
                  id: "error",
                  parts: [{ type: "text", text: error.message }],
                }}
              />
            )}
            {status === "submitted" && <LoadingMessage />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          globalDrop
          multiple
        >
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Add me a step of..."
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                onClick={() => setUseMicrophone(!useMicrophone)}
                variant={useMicrophone ? "default" : "ghost"}
              >
                <MicIcon size={16} />
                <span className="sr-only">Microphone</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {MODELS.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
