
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";
import { Send } from "lucide-react";
import { useChatTextarea } from "@/hooks/useChatTextarea";
import { useChatInput } from "@/hooks/useChatInput";
import { MessageEditingIndicator } from "./input/MessageEditingIndicator";
import { MessageReplyIndicator } from "./input/MessageReplyIndicator";
import { QuickMentions } from "./input/QuickMentions";
import { ChatInputTools } from "./input/ChatInputTools";
import { QuickEmojiPicker } from "./input/QuickEmojiPicker";

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
  const { textareaRef, textareaHeight } = useChatTextarea({ 
    message,
    isEditing: !!editingMessage 
  });

  const {
    showEmojiPicker,
    setShowEmojiPicker,
    showGifPicker,
    setShowGifPicker,
    handleEmojiSelect,
    handleGifSelect,
    handleMentionUser,
    handleFileUpload
  } = useChatInput({
    textareaRef,
    message,
    setMessage
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="border-t border-border p-3 bg-background">
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

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
            className="min-h-[40px] max-h-[120px] resize-none pr-24 py-2"
            style={{ height: `${textareaHeight}px` }}
          />
          <ChatInputTools
            onEmojiPickerToggle={() => setShowEmojiPicker(!showEmojiPicker)}
            onGifPickerToggle={() => setShowGifPicker(!showGifPicker)}
            onFileUpload={handleFileUpload}
          />
        </div>
        <Button 
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="sm"
          className="flex items-center gap-1"
        >
          <Send size={16} />
          {editingMessage ? "Save" : "Send"}
        </Button>
      </div>
      
      {/* Quick emoji picker */}
      {showEmojiPicker && (
        <QuickEmojiPicker onEmojiSelect={handleEmojiSelect} />
      )}
      
      {/* GIF picker */}
      {showGifPicker && (
        <div className="absolute bottom-16 right-4 z-50">
          <GifPicker onGifSelect={handleGifSelect} />
        </div>
      )}
      
      {/* Quick mentions */}
      <QuickMentions onMentionUser={handleMentionUser} />
    </div>
  );
};
