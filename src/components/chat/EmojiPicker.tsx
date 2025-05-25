
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const POPULAR_EMOJIS = [
  "😀", "😂", "😊", "😍", "🥰", "😎", "🙄", "😔", "😢", "❤️", 
  "👍", "👎", "🎉", "🔥", "💯", "✅", "❌", "⭐", "💡", "🤔"
];

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-accent hover:text-accent-foreground"
          type="button"
        >
          <Smile size={16} />
          <span className="sr-only">Add emoji</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-60 p-3 bg-popover border-border shadow-lg" 
        align="end" 
        sideOffset={5}
        side="top"
      >
        <div className="grid grid-cols-5 gap-2">
          {POPULAR_EMOJIS.map(emoji => (
            <Button
              key={emoji}
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground"
              onClick={() => onEmojiSelect(emoji)}
              type="button"
            >
              <span role="img" aria-label={`emoji ${emoji}`}>
                {emoji}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
