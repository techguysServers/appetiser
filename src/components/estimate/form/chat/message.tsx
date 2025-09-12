import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { UIMessage } from "ai";
import { BotIcon } from "lucide-react";

export default function ChatMessage({ message }: { message: UIMessage }) {
  if (message.role === "user") {
    return (
      <Message from="user">
        <MessageContent>
          {message.parts.map((part) => {
            switch (part.type) {
              case "text":
                return part.text;
              default:
                return "";
            }
          })}
        </MessageContent>
      </Message>
    );
  } else {
    return (
      <>
        <BotIcon className="block h-5 w-5 text-muted-foreground" />
        <Message from="assistant">
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${message.id}-${i}`}>{part.text}</Response>
                );
              case "tool-add_step": {
                const callId = part.toolCallId;

                switch (part.state) {
                  case "input-streaming":
                    return <div key={callId}>Preparing step request...</div>;
                  case "input-available":
                    return <div key={callId}>Getting step...</div>;
                  //   case "output-available":
                  //     return (
                  //       <div key={callId}>
                  //         Step:{" "}
                  //         {(part.output as z.infer<typeof CreateStepSchema>).name}
                  //       </div>
                  //     );
                  case "output-error":
                    return (
                      <div key={callId}>
                        Error getting step: {part.errorText}
                      </div>
                    );
                }
                break;
              }
              default:
                return null;
            }
          })}
        </Message>
      </>
    );
  }
}
