
import React from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image } from "lucide-react";

interface ChatInputToolsProps {
  onEmojiPickerToggle: () => void;
  onGifPickerToggle: () => void;
  onFileUpload: () => void;
}

export const ChatInputTools = ({ 
  onEmojiPickerToggle, 
  onGifPickerToggle, 
  onFileUpload 
}: ChatInputToolsProps) => {
  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        type="button"
        className="h-8 w-8 rounded-full"
        onClick={onEmojiPickerToggle}
      >
        <span role="img" aria-label="emoji">😀</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        type="button"
        className="h-8 w-8 rounded-full"
        onClick={onFileUpload}
      >
        <Paperclip size={18} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        type="button"
        className="h-8 w-8 rounded-full"
        onClick={onGifPickerToggle}
      >
        <Image size={18} />
      </Button>
    </div>
  );
};
