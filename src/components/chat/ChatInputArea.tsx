
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { Send, XCircle } from "lucide-react";
import { useChatTextarea } from "@/hooks/useChatTextarea";
import { MessageEditingIndicator } from "./input/MessageEditingIndicator";
import { MessageReplyIndicator } from "./input/MessageReplyIndicator";
import { ChatInputTools } from "./input/ChatInputTools";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  onEmojiSelect?: (emoji: string) => void;
  onGifSelect?: (gif: { url: string; alt: string }) => void;
  isAdmin?: boolean;
  onAdminEffectSelect?: (effectType: string, content?: string) => void;
}

export const ChatInputArea = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
  editingMessage,
  replyingToMessage,
  onCancelEdit,
  onCancelReply,
  onEmojiSelect,
  onGifSelect,
  isAdmin = false,
  onAdminEffectSelect
}: ChatInputAreaProps) => {
  const { textareaRef, textareaHeight } = useChatTextarea({ 
    message,
    isEditing: !!editingMessage,
    minHeight: 40,
    maxHeight: 120
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowGifPicker(false);
  };

  const handleGifPickerToggle = () => {
    setShowGifPicker(!showGifPicker);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = () => {
    // In a real implementation, this would open a file picker
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,audio/*,application/pdf';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Here you would handle uploading to storage
        const updatedMessage = message + ` [File uploaded: ${files[0].name}]`;
        setMessage(updatedMessage);
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleInternalEmojiSelect = (emoji: string) => {
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    } else {
      setMessage(message + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleInternalGifSelect = (gif: { url: string; alt: string }) => {
    if (onGifSelect) {
      onGifSelect(gif);
    } else {
      const gifMarkdown = `![${gif.alt}](${gif.url})`;
      setMessage(message + " " + gifMarkdown);
    }
    setShowGifPicker(false);
  };

  return (
    <div className="border-t border-border p-2 bg-background sticky bottom-0">
      {/* Editing indicator */}
      {editingMessage && onCancelEdit && (
        <MessageEditingIndicator onCancelEdit={onCancelEdit} />
      )}

      {/* Reply indicator */}
      {replyingToMessage && onCancelReply && (
        <MessageReplyIndicator 
          replyingToMessage={replyingToMessage} 
          onCancelReply={onCancelReply} 
        />
      )}

      <div className="flex flex-col space-y-2">
        {/* Text area for input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
          className="min-h-[40px] max-h-[120px] resize-none py-2 overflow-hidden"
          style={{ height: `${textareaHeight}px` }}
        />
          
        {/* Controls positioned below textarea */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ChatInputTools
              onEmojiPickerToggle={handleEmojiPickerToggle}
              onGifPickerToggle={handleGifPickerToggle}
              onFileUpload={handleFileUpload}
              showEmojiPicker={showEmojiPicker}
              showGifPicker={showGifPicker}
              isAdmin={isAdmin}
              onAdminEffectSelect={onAdminEffectSelect}
            />
          </div>

          {/* Send button */}
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
            className="flex-shrink-0"
            title={editingMessage ? "Save" : "Send"}
          >
            <Send size={16} className="mr-1" />
            <span>{editingMessage ? "Save" : "Send"}</span>
          </Button>
        </div>
      </div>
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="relative">
          <div className="absolute bottom-16 right-2 z-50">
            <Popover open={true} onOpenChange={setShowEmojiPicker}>
              <PopoverContent className="w-64 p-0" align="end">
                <EmojiPicker onEmojiSelect={handleInternalEmojiSelect} />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowEmojiPicker(false)}
                >
                  <XCircle size={14} />
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
      
      {/* GIF picker */}
      {showGifPicker && (
        <div className="relative">
          <div className="absolute bottom-16 right-2 z-50">
            <Popover open={true} onOpenChange={setShowGifPicker}>
              <PopoverContent className="w-72 p-2" align="end">
                <GifPicker onGifSelect={handleInternalGifSelect} />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowGifPicker(false)}
                >
                  <XCircle size={14} />
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
