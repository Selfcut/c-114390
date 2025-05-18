
import React from 'react';
import { Button } from '@/components/ui/button';
import { PaperclipIcon, Image, Smile } from 'lucide-react';
import { EmojiPicker } from '../EmojiPicker';
import { GifPicker } from '../GifPicker';
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
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEmojiPickerToggle}
        className="h-7 w-7 rounded-full"
        aria-pressed={showEmojiPicker}
        aria-label="Insert emoji"
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
      >
        <Image size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onFileUpload}
        className="h-7 w-7 rounded-full"
        aria-label="Attach file"
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
