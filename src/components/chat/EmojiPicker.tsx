
import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

// Define emoji categories
const emojiCategories = [
  {
    id: "smileys",
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘"]
  },
  {
    id: "gestures",
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👋", "🤚", "🖐️", "✋", "👏", "👐", "🙌", "🤲", "🙏"]
  },
  {
    id: "animals",
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"]
  },
  {
    id: "food",
    name: "Food",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥥", "🥝", "🍅", "🥑"]
  },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredEmojis = searchQuery.trim() === "" 
    ? null
    : emojiCategories.flatMap(category => 
        category.emojis.filter(emoji => 
          emoji.includes(searchQuery.toLowerCase())
        )
      );

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted">
          <Smile size={18} />
          <span className="sr-only">Pick emoji</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-64 p-0" sideOffset={10}>
        <div className="p-2 border-b">
          <Input
            placeholder="Search emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 text-xs"
          />
        </div>
        
        {searchQuery.trim() !== "" ? (
          <div className="p-2 max-h-[200px] overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-2">Search results:</p>
            <div className="grid grid-cols-8 gap-1">
              {filteredEmojis && filteredEmojis.length > 0 ? (
                filteredEmojis.map((emoji, index) => (
                  <Button
                    key={`${emoji}-${index}`}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 flex items-center justify-center text-lg hover:bg-muted"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))
              ) : (
                <p className="text-xs text-muted-foreground col-span-8 py-2">No emojis found</p>
              )}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="smileys" className="w-full">
            <TabsList className="grid grid-cols-4 p-1">
              {emojiCategories.map(category => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="px-2 py-1 h-7 data-[state=active]:bg-muted"
                >
                  {category.emojis[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {emojiCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="p-2 max-h-[200px] overflow-y-auto">
                <div className="grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji, index) => (
                    <Button
                      key={`${emoji}-${index}`}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 flex items-center justify-center text-lg hover:bg-muted"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  );
};
