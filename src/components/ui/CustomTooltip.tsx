
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const CustomTooltip = ({ 
  children, 
  content,
  position = "top",
  delay = 300
}: CustomTooltipProps) => {
  if (!content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={position} className="text-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
