
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { parseMentions } from "@/lib/utils/message-utils";

interface ChatInputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const ChatInputArea = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
}: ChatInputAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
    textareaRef.current?.focus();
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    // Insert markdown image format for GIF
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setMessage(message + " " + gifMarkdown);
    textareaRef.current?.focus();
  };

  // Handle @ mentions
  const handleMentionUser = (username: string) => {
    const currentPosition = textareaRef.current?.selectionStart || 0;
    const beforeCursor = message.substring(0, currentPosition);
    const afterCursor = message.substring(currentPosition);
    
    // Check if we need to add a space before the mention
    const needsSpace = beforeCursor.length > 0 && !beforeCursor.endsWith(' ');
    
    const newMessage = `${beforeCursor}${needsSpace ? ' ' : ''}@${username} ${afterCursor}`;
    setMessage(newMessage);
    textareaRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="border-t border-border p-3 bg-background">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none pr-12 py-2"
            rows={1}
          />
          <div className="absolute bottom-1 right-1 flex items-center">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            <GifPicker onGifSelect={handleGifSelect} />
          </div>
        </div>
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="sm"
        >
          Send
        </Button>
      </div>
      
      {/* Quick mentions - In a real app, this would be populated with users in the conversation */}
      <div className="flex gap-1 mt-1">
        {["john", "maria", "alex"].map(username => (
          <Button 
            key={username}
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs hover:bg-primary/10" 
            onClick={() => handleMentionUser(username)}
          >
            @{username}
          </Button>
        ))}
      </div>
    </div>
  );
};
