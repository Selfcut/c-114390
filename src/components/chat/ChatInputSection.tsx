
import React from 'react';
import { ChatInputArea } from './ChatInputArea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface ChatInputSectionProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSubmitting?: boolean;
  editingMessageId: string | null;
  replyingToMessage: {
    id: string;
    content: string;
    senderName: string;
  } | null;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  isAdmin: boolean;
  onAdminEffectSelect: (effectType: string, content?: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onGifSelect: (gif: { url: string; alt: string }) => void;
}

export const ChatInputSection = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
  isSubmitting = false,
  editingMessageId,
  replyingToMessage,
  onCancelEdit,
  onCancelReply,
  isAdmin,
  onAdminEffectSelect,
  onEmojiSelect,
  onGifSelect
}: ChatInputSectionProps) => {
  return (
    <>
      <ChatInputArea
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        editingMessage={editingMessageId}
        replyingToMessage={replyingToMessage}
        onCancelEdit={onCancelEdit}
        onCancelReply={onCancelReply}
        isAdmin={isAdmin}
        onAdminEffectSelect={onAdminEffectSelect}
        onEmojiSelect={onEmojiSelect}
        onGifSelect={onGifSelect}
      />
      
      {isSubmitting && (
        <div className="py-1 px-3 text-sm text-center text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Sending...
          </span>
        </div>
      )}
    </>
  );
};
