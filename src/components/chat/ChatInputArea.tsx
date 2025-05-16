
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { X } from "lucide-react";

interface ChatInputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  editingMessage?: string | null;
  replyingToMessage?: {
    id: string;
    content: string;
    senderName: string;
  } | null;
  onCancelEdit?: () => void;
  onCancelReply?: () => void;
}

export const ChatInputArea = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
  editingMessage,
  replyingToMessage,
  onCancelEdit,
  onCancelReply
}: ChatInputAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textareaHeight, setTextareaHeight] = useState<number>(40);

  // Focus textarea when editing starts
  useEffect(() => {
    if (editingMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingMessage]);

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      setTextareaHeight(scrollHeight < 40 ? 40 : Math.min(scrollHeight, 120));
      textareaRef.current.style.height = `${textareaHeight}px`;
    }
  }, [message]);

  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = textareaRef.current?.selectionStart || message.length;
    const newMessage = message.substring(0, cursorPosition) + emoji + message.substring(cursorPosition);
    setMessage(newMessage);
    
    // Focus back on textarea and set cursor position after the inserted emoji
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = cursorPosition + emoji.length;
        textareaRef.current.selectionEnd = cursorPosition + emoji.length;
      }
    }, 0);
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    // Insert markdown image format for GIF
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    const cursorPosition = textareaRef.current?.selectionStart || message.length;
    const newMessage = message.substring(0, cursorPosition) + " " + gifMarkdown + message.substring(cursorPosition);
    setMessage(newMessage);
    
    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle @ mentions
  const handleMentionUser = (username: string) => {
    const currentPosition = textareaRef.current?.selectionStart || message.length;
    const beforeCursor = message.substring(0, currentPosition);
    const afterCursor = message.substring(currentPosition);
    
    // Check if we need to add a space before the mention
    const needsSpace = beforeCursor.length > 0 && !beforeCursor.endsWith(' ');
    
    const newMessage = `${beforeCursor}${needsSpace ? ' ' : ''}@${username} ${afterCursor}`;
    setMessage(newMessage);
    
    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = currentPosition + (needsSpace ? 2 : 1) + username.length + 1;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="border-t border-border p-3 bg-background">
      {/* Editing indicator */}
      {editingMessage && (
        <div className="mb-2 px-3 py-1.5 bg-primary/10 rounded-md flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Editing message</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={onCancelEdit}
          >
            <X size={14} />
            <span className="sr-only">Cancel edit</span>
          </Button>
        </div>
      )}

      {/* Reply indicator */}
      {replyingToMessage && (
        <div className="mb-2 px-3 py-1.5 bg-muted/50 rounded-md flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">
              Replying to <span className="font-medium">{replyingToMessage.senderName}</span>
            </span>
            <p className="text-xs line-clamp-1 text-muted-foreground max-w-[250px]">
              {replyingToMessage.content.length > 50 
                ? `${replyingToMessage.content.substring(0, 50)}...` 
                : replyingToMessage.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0"
            onClick={onCancelReply}
          >
            <X size={14} />
            <span className="sr-only">Cancel reply</span>
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
            className="min-h-[40px] max-h-[120px] resize-none pr-12 py-2"
            style={{ height: `${textareaHeight}px` }}
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
          {editingMessage ? "Save" : "Send"}
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
