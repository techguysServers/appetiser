import { EditEstimateSchema } from "@/schemas/estimate";
import {
  CreateStepSchema,
  CreateSubStepSchema,
  EditStepSchema,
  EditSubStepWithParentIdSchema,
} from "@/schemas/step";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    messages: convertToModelMessages(messages),
    tools: {
      get_steps: {
        description: "Get the steps of the estimate",
        inputSchema: z.object({}),
      },
      edit_estimate: {
        description:
          "Edit the estimate with the given information. Provide only the values you want to edit, do not provide the entire estimate.",
        inputSchema: EditEstimateSchema,
      },
      //   add_step: {
      //     description:
      //       "Add an array of steps to the estimate with at least one sub steps. If the step can be separated into sub steps, create those sub steps inside the step. Always provide at least one sub step. When providing sub steps, if complexity is not provided but hours are, look at other hours of other step and calculate the complexity based on that. For example, if the step has 10 hours and the other step has 20 hours, the complexity of the sub step should be LOW (1). If you can't calculate the complexity, provide MEDIUM (3).",
      //     inputSchema: AICreateStepsSchema,
      //   },
      add_step: {
        description:
          "Add an array of steps to the estimate with at least one sub steps. If the step can be separated into sub steps, create those sub steps inside the step. Always provide at least one sub step. When providing sub steps, if complexity is not provided but hours are, look at other hours of other step and calculate the complexity based on that. For example, if the step has 10 hours and the other step has 20 hours, the complexity of the sub step should be LOW (1). If you can't calculate the complexity, provide MEDIUM (3).",
        inputSchema: CreateStepSchema.omit({ id: true }).extend({
          subSteps: z.array(CreateSubStepSchema.omit({ id: true })).min(1),
        }),
      },
      edit_step: {
        description:
          "Edit a step with the given information. When editing a step, you must provide the id of the step you want to edit. You can retreive the id of the step from the step you are editing. In addition to the id, provide only the values you want to edit and change, do not provide the entire step. Id is not something user is providing, it is something you are providing. If you are not providing an id, the step will not be edited.",
        inputSchema: EditStepSchema,
      },
      //   add_sub_step: {
      //     description:
      //       "Add a sub step to the step with the given information. When adding a sub step, you must provide the id of the step you want to add the sub step to. You must not provide an id for the sub step, it will be generated automatically.",
      //     inputSchema: CreateSubStepWithParentIdSchema.omit({ id: true }),
      //   },
      edit_sub_step: {
        description:
          "Edit a sub step with the given information. When editing a sub step, you must provide the id of the sub step you want to edit. You can retreive the id of the sub step from the sub step you are editing.",
        inputSchema: EditSubStepWithParentIdSchema,
      },
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error: unknown) => {
      console.error(error);
      return "error";
    },
  });
}
