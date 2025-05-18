
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Image } from 'lucide-react';
import { AdminEffects } from '../AdminEffects';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ChatInputToolsProps {
  onEmojiPickerToggle: () => void;
  onGifPickerToggle: () => void;
  showEmojiPicker?: boolean;
  showGifPicker?: boolean;
  isAdmin?: boolean;
  onAdminEffectSelect?: (effectType: string, content?: string) => void;
}

export const ChatInputTools = ({
  onEmojiPickerToggle,
  onGifPickerToggle,
  showEmojiPicker,
  showGifPicker,
  isAdmin = false,
  onAdminEffectSelect
}: ChatInputToolsProps) => {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEmojiPickerToggle}
              className="h-7 w-7 rounded-full flex-shrink-0"
              aria-pressed={showEmojiPicker}
              aria-label="Insert emoji"
              type="button"
            >
              <Smile size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Insert emoji</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onGifPickerToggle}
              className="h-7 w-7 rounded-full flex-shrink-0"
              aria-pressed={showGifPicker}
              aria-label="Insert GIF"
              type="button"
            >
              <Image size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Insert GIF</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isAdmin && onAdminEffectSelect && (
        <AdminEffects 
          onEffectSelect={onAdminEffectSelect} 
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};
