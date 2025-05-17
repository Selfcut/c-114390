
import React from "react";
import { Button } from "@/components/ui/button";

interface QuickEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const QuickEmojiPicker = ({ onEmojiSelect }: QuickEmojiPickerProps) => {
  const popularEmojis = ["😀", "😂", "❤️", "👍", "👎", "😎", "🎉", "😢", "🤔", "😡", "👏", "🙏"];
  
  return (
    <div className="absolute bottom-16 right-4 bg-background border rounded-md shadow-lg p-2 z-50">
      <div className="grid grid-cols-6 gap-1">
        {popularEmojis.map(emoji => (
          <button
            key={emoji}
            className="hover:bg-accent rounded-md w-8 h-8 flex items-center justify-center"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
