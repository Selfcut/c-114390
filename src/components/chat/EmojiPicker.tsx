
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, X, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

// Common emoji categories
const emojiCategories = [
  {
    name: "recent",
    icon: <Clock size={16} />,
    emojis: ["😊", "👍", "❤️", "🔥", "😂", "🎉", "👏", "🙌", "💯", "✨"]
  },
  {
    name: "smileys",
    icon: "😀",
    emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤"]
  },
  {
    name: "people",
    icon: "👋",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿"]
  },
  {
    name: "nature",
    icon: "🌼",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🦁", "🐯", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞"]
  },
  {
    name: "food",
    icon: "🍔",
    emojis: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞"]
  },
  {
    name: "travel",
    icon: "✈️",
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞"]
  },
  {
    name: "symbols",
    icon: "💯",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊"]
  }
];

export const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("recent");
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Close the emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Filter emojis based on search query
  const filteredEmojis = searchQuery
    ? emojiCategories.flatMap(category => category.emojis).filter(emoji => 
        emoji.includes(searchQuery) || 
        (emoji.codePointAt(0)?.toString(16) || "").includes(searchQuery)
      )
    : [];

  return (
    <Card className="w-80" ref={containerRef}>
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="font-medium text-sm">Emoji</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X size={14} />
        </Button>
      </div>
      
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emoji"
            className="pl-8 h-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {searchQuery ? (
        <ScrollArea className="h-64">
          <div className="grid grid-cols-8 gap-1 p-2">
            {filteredEmojis.map((emoji, index) => (
              <Button
                key={`${emoji}-${index}`}
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => onEmojiSelect(emoji)}
              >
                <span className="text-lg">{emoji}</span>
              </Button>
            ))}
            {filteredEmojis.length === 0 && (
              <div className="col-span-8 flex items-center justify-center h-32 text-muted-foreground">
                No emoji found
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-7 p-1 h-auto">
            {emojiCategories.map(category => (
              <TabsTrigger 
                key={category.name}
                value={category.name} 
                className="p-2 h-8"
              >
                {typeof category.icon === 'string' ? category.icon : category.icon}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {emojiCategories.map(category => (
            <TabsContent key={category.name} value={category.name} className="mt-0">
              <ScrollArea className="h-64">
                <div className="grid grid-cols-8 gap-1 p-2">
                  {category.emojis.map((emoji, index) => (
                    <Button
                      key={`${emoji}-${index}`}
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => onEmojiSelect(emoji)}
                    >
                      <span className="text-lg">{emoji}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Card>
  );
};
