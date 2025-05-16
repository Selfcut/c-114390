
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
  disabled?: boolean;  // Added disabled prop
}

export const CustomTooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
  disabled = false,  // Added with default value
}: CustomTooltipProps) => {
  if (disabled) {
    return <>{children}</>;
  }

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
