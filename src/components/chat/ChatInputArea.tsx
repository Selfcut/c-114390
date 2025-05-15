
import React, { useState } from "react";
import { Send, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GifPicker } from "./GifPicker";
import { MessageReactions } from "./MessageReactions";

interface ChatInputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export const ChatInputArea = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown
}: ChatInputAreaProps) => {
  // Emoji data for quick selection
  const emojiCategories = [
    {
      name: "Smileys",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"]
    },
    {
      name: "Gestures",
      emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤙", "👋", "🤚", "✋"]
    },
    {
      name: "Objects",
      emojis: ["📚", "💡", "🔍", "🧠", "📝", "📊", "🌐", "💭", "🎓", "⏱️"]
    }
  ];

  const handleInsertEmoji = (emoji: string) => {
    setMessage(message + emoji);
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    // Insert the GIF URL as a markdown image
    setMessage(message + `\n![${gif.alt}](${gif.url})\n`);
  };

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full flex-shrink-0">
              <SmilePlus size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-64 p-0">
            <Tabs defaultValue="Smileys">
              <TabsList className="grid grid-cols-3">
                {emojiCategories.map((category) => (
                  <TabsTrigger key={category.name} value={category.name}>
                    {category.emojis[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              {emojiCategories.map((category) => (
                <TabsContent key={category.name} value={category.name} className="p-2">
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        className="h-8 w-8 flex items-center justify-center text-lg hover:bg-accent rounded"
                        onClick={() => handleInsertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </PopoverContent>
        </Popover>
        
        {/* GIF Picker */}
        <GifPicker onGifSelect={handleGifSelect} />
        
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="icon"
          className="h-9 w-9 rounded-full flex-shrink-0"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};
