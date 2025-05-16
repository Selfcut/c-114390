
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  disabled?: boolean;
}

export function CustomTooltip({ children, content, side = "top", delayDuration = 300, disabled = false }: CustomTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="text-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CustomTooltip;
