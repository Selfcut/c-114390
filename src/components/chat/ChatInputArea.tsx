
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { Send } from "lucide-react";
import { useChatTextarea } from "@/hooks/useChatTextarea";
import { MessageEditingIndicator } from "./input/MessageEditingIndicator";
import { MessageReplyIndicator } from "./input/MessageReplyIndicator";
import { ChatInputTools } from "./input/ChatInputTools";
import { AdminEffects } from "./AdminEffects";

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
  isAdmin?: boolean;
  onAdminEffectSelect?: (effectType: string, content?: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onGifSelect: (gif: { url: string; alt: string }) => void;
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
  isAdmin = false,
  onAdminEffectSelect,
  onEmojiSelect,
  onGifSelect
}: ChatInputAreaProps) => {
  const { textareaRef, textareaHeight } = useChatTextarea({ 
    message,
    isEditing: !!editingMessage,
    minHeight: 40,
    maxHeight: 120
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    onGifSelect(gif);
  };

  const isMessageEmpty = !message.trim();

  return (
    <div className="border-t p-2 bg-background sticky bottom-0 border-border dark:border-border">
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
          className="min-h-[40px] max-h-[120px] resize-none py-2 overflow-hidden border-border dark:border-border"
          style={{ height: `${textareaHeight}px` }}
        />
          
        {/* Controls positioned below textarea */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            <GifPicker onGifSelect={handleGifSelect} />
            
            {isAdmin && onAdminEffectSelect && (
              <AdminEffects onAdminEffectSelect={onAdminEffectSelect} />
            )}
          </div>

          {/* Send button */}
          <Button 
            onClick={handleSendMessage}
            disabled={isMessageEmpty}
            size="sm"
            className={`flex-shrink-0 ml-2 ${isMessageEmpty ? 'opacity-50' : 'opacity-100'}`}
            title={editingMessage ? "Save" : "Send"}
            type="button"
          >
            <Send size={16} className="mr-1" />
            <span>{editingMessage ? "Save" : "Send"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
