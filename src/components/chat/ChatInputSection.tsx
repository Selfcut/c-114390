
import React from 'react';
import { ChatInputArea } from './ChatInputArea';

interface ChatInputSectionProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
  editingMessageId?: string | null;
  replyingToMessage?: {
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

export const ChatInputSection: React.FC<ChatInputSectionProps> = (props) => {
  return (
    <ChatInputArea
      message={props.message}
      setMessage={props.setMessage}
      handleSendMessage={props.handleSendMessage}
      handleKeyDown={props.handleKeyDown}
      editingMessage={props.editingMessageId}
      replyingToMessage={props.replyingToMessage}
      onCancelEdit={props.onCancelEdit}
      onCancelReply={props.onCancelReply}
      isAdmin={props.isAdmin}
      onAdminEffectSelect={props.onAdminEffectSelect}
      onEmojiSelect={props.onEmojiSelect}
      onGifSelect={props.onGifSelect}
    />
  );
};
