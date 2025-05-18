
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdminEffectsProps {
  onEffectSelect: (effectType: string, content?: string) => void;
  isAdmin: boolean;
}

export const AdminEffects = ({ onEffectSelect, isAdmin }: AdminEffectsProps) => {
  if (!isAdmin) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full flex-shrink-0 text-amber-500"
              >
                <Sparkles size={16} />
                <span className="sr-only">Admin effects</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => onEffectSelect('announcement')}
                >
                  📢 Announcement
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onEffectSelect('celebrate')}
                >
                  🎉 Celebration
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onEffectSelect('warning')}
                >
                  ⚠️ Warning
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onEffectSelect('highlight')}
                >
                  ✨ Highlight
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side="top">Admin effects</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
