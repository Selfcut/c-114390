
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
  delay?: number;
}

export const CustomTooltip = ({
  children,
  content,
  position = "top",
  delay = 300,
}: CustomTooltipProps) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={position} className="max-w-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
