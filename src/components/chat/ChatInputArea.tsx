
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

  // Handle mention suggestions
  const [mentionSuggestions, setMentionSuggestions] = useState<{
    show: boolean;
    query: string;
    position: { top: number; left: number };
    users: Array<{ id: string; name: string; avatar: string }>;
  }>({
    show: false,
    query: "",
    position: { top: 0, left: 0 },
    users: []
  });

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Check for @ mention pattern
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      
      // Mock users - in a real app, you'd fetch this from your backend
      const allUsers = [
        { id: "1", name: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
        { id: "2", name: "Bob", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
        { id: "3", name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
        { id: "4", name: "David", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" }
      ];
      
      const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query)
      ).slice(0, 5);
      
      // Calculate position for the mention popup
      const caretCoordinates = getCaretCoordinates(e.target, cursorPosition);
      
      setMentionSuggestions({
        show: true,
        query,
        position: {
          top: caretCoordinates.top + 20,
          left: caretCoordinates.left
        },
        users: filteredUsers
      });
    } else {
      setMentionSuggestions(prev => ({ ...prev, show: false }));
    }
  };

  const insertMention = (username: string) => {
    const cursorPosition = document.querySelector('textarea')?.selectionStart || 0;
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
    
    // Find the @ symbol that started this mention
    const mentionStartMatch = textBeforeCursor.match(/@\w*$/);
    if (mentionStartMatch) {
      const mentionStart = mentionStartMatch.index || 0;
      const newText = textBeforeCursor.substring(0, mentionStart) + 
        `@${username} ` + 
        textAfterCursor;
      
      setMessage(newText);
    }
    
    setMentionSuggestions(prev => ({ ...prev, show: false }));
  };

  // Function to get caret position in the textarea
  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    // This is a simplified version
    // In a real app, you'd need a more sophisticated method to get the exact position
    const { offsetLeft, offsetTop } = element;
    return {
      top: offsetTop + 20, // Approximate line height
      left: offsetLeft + 10 * (position % 50) // Rough approximation
    };
  };

  return (
    <div className="border-t p-3 relative">
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
          onChange={handleTextareaChange}
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
      
      {/* Mention suggestions dropdown */}
      {mentionSuggestions.show && mentionSuggestions.users.length > 0 && (
        <div 
          className="absolute bg-popover border border-border rounded-md shadow-md z-50 w-48 overflow-hidden"
          style={{ 
            top: mentionSuggestions.position.top, 
            left: mentionSuggestions.position.left 
          }}
        >
          <ul className="py-1">
            {mentionSuggestions.users.map(user => (
              <li 
                key={user.id} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => insertMention(user.name)}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm">{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
