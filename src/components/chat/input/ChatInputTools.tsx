
import React from 'react';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, Image, Smile } from 'lucide-react';
import { AdminEffects } from '../AdminEffects';

interface ChatInputToolsProps {
  onEmojiPickerToggle: () => void;
  onGifPickerToggle: () => void;
  onFileUpload: () => void;
  showEmojiPicker?: boolean;
  showGifPicker?: boolean;
  isAdmin?: boolean;
  onAdminEffectSelect?: (effectType: string, content?: string) => void;
}

export const ChatInputTools = ({
  onEmojiPickerToggle,
  onGifPickerToggle,
  onFileUpload,
  showEmojiPicker,
  showGifPicker,
  isAdmin = false,
  onAdminEffectSelect = () => {}
}: ChatInputToolsProps) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEmojiPickerToggle}
        className="h-7 w-7 rounded-full"
        aria-pressed={showEmojiPicker}
        aria-label="Insert emoji"
        type="button"
      >
        <Smile size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onGifPickerToggle}
        className="h-7 w-7 rounded-full"
        aria-pressed={showGifPicker}
        aria-label="Insert GIF"
        type="button"
      >
        <Image size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onFileUpload}
        className="h-7 w-7 rounded-full"
        aria-label="Attach file"
        type="button"
      >
        <PaperclipIcon size={16} />
      </Button>
      {isAdmin && (
        <AdminEffects 
          onEffectSelect={onAdminEffectSelect} 
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};
