
import React from 'react';
import { EmojiPicker } from '../EmojiPicker';
import { GifPicker } from '../GifPicker';
import { AdminEffects } from '../AdminEffects';

interface ChatInputToolsProps {
  onEmojiPickerToggle: () => void;
  onGifPickerToggle: () => void;
  showEmojiPicker: boolean;
  showGifPicker: boolean;
  isAdmin: boolean;
  onAdminEffectSelect?: (effectType: string, content?: string) => void;
}

export const ChatInputTools = ({
  onEmojiPickerToggle,
  onGifPickerToggle,
  showEmojiPicker,
  showGifPicker,
  isAdmin,
  onAdminEffectSelect
}: ChatInputToolsProps) => {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEmojiPickerToggle}
        className="p-1 hover:bg-accent rounded-md transition-colors"
        title="Add emoji"
      >
        😊
      </button>
      
      <button
        type="button"
        onClick={onGifPickerToggle}
        className="p-1 hover:bg-accent rounded-md transition-colors"
        title="Add GIF"
      >
        GIF
      </button>
      
      {isAdmin && onAdminEffectSelect && (
        <AdminEffects onAdminEffectSelect={onAdminEffectSelect} />
      )}
    </div>
  );
};
