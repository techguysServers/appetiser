import { Trefoil } from "ldrs/react";
import "ldrs/react/Trefoil.css";

export default function LoadingMessage() {
  return (
    <div className="flex items-center gap-2">
      <Trefoil
        size="16"
        stroke="3"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.4"
        color="black"
      />
      {/* <BotIcon className="size-6" /> */}
      <div className="w-fit flex flex-col gap-2 bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-500"></p>
      </div>
    </div>
  );
}
