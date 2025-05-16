
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

export const CustomTooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
}: CustomTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} className="bg-popover text-popover-foreground border border-border shadow-md">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
