
import React from "react";
import { ChatInputArea } from "./ChatInputArea";

interface ChatInputSectionProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  editingMessageId: string | null;
  replyingToMessage: {
    id: string;
    content: string;
    senderName: string;
  } | null;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onEmojiSelect: (emoji: string) => void;
  onGifSelect: (gif: { url: string; alt: string }) => void;
  isAdmin: boolean;
  onAdminEffectSelect: (effectType: string, content?: string) => void;
}

export const ChatInputSection = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyDown,
  editingMessageId,
  replyingToMessage,
  onCancelEdit,
  onCancelReply,
  onEmojiSelect,
  onGifSelect,
  isAdmin,
  onAdminEffectSelect,
}: ChatInputSectionProps) => {
  return (
    <ChatInputArea 
      message={inputMessage}
      setMessage={setInputMessage}
      handleSendMessage={handleSendMessage}
      handleKeyDown={handleKeyDown}
      editingMessage={editingMessageId}
      replyingToMessage={replyingToMessage}
      onCancelEdit={onCancelEdit}
      onCancelReply={onCancelReply}
      onEmojiSelect={onEmojiSelect}
      onGifSelect={onGifSelect}
      isAdmin={isAdmin}
      onAdminEffectSelect={onAdminEffectSelect}
    />
  );
};
