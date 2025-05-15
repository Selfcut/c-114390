
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Common emoji categories
const emojis = {
  smileys: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘"],
  gestures: ["👍", "👎", "👌", "👏", "🙌", "🤝", "👊", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"],
  food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥝"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🥊", "🎯", "🎮"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "✈️"],
  objects: ["💻", "📱", "💽", "💾", "💿", "📀", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", "📟"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗"]
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground"
        >
          <Smile size={18} />
          <span className="sr-only">Emoji picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Tabs defaultValue="smileys">
          <TabsList className="flex justify-start">
            <TabsTrigger value="smileys">😀</TabsTrigger>
            <TabsTrigger value="gestures">👍</TabsTrigger>
            <TabsTrigger value="animals">🐶</TabsTrigger>
            <TabsTrigger value="food">🍎</TabsTrigger>
            <TabsTrigger value="activities">⚽</TabsTrigger>
            <TabsTrigger value="travel">🚗</TabsTrigger>
            <TabsTrigger value="objects">💻</TabsTrigger>
            <TabsTrigger value="symbols">❤️</TabsTrigger>
          </TabsList>
          
          {Object.entries(emojis).map(([category, categoryEmojis]) => (
            <TabsContent key={category} value={category} className="p-2">
              <div className="grid grid-cols-8 gap-1">
                {categoryEmojis.map((emoji, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    className="h-8 w-8 p-0 hover:bg-accent"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
