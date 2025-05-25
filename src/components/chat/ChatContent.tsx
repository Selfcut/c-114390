
import React from "react";
import { ChatMessageArea } from "./ChatMessageArea";
import { ChatInputSection } from "./ChatInputSection";
import { ChatMessage } from "./types";

interface ChatContentProps {
  isLoadingMessages: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  formatTime: (timestamp: string) => string;
  onMessageEdit: (messageId: string) => void;
  onMessageDelete: (messageId: string) => void;
  onMessageReply: (messageId: string) => void;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
  message?: string;
  inputMessage?: string;
  setMessage?: (message: string) => void;
  setInputMessage?: (message: string) => void;
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
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentUserId: string | null;
}

export const ChatContent = ({
  isLoadingMessages,
  messages,
  isLoading,
  formatTime,
  onMessageEdit,
  onMessageDelete,
  onMessageReply,
  onReactionAdd,
  onReactionRemove,
  message,
  setMessage,
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
  messagesEndRef,
  currentUserId,
}: ChatContentProps) => {
  // Use inputMessage as a fallback if message is not provided
  const actualMessage = message || inputMessage || '';
  const actualSetMessage = setMessage || setInputMessage || (() => {});
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatMessageArea
        isLoadingMessages={isLoadingMessages}
        messages={messages}
        isLoading={isLoading}
        formatTime={formatTime}
        onMessageEdit={onMessageEdit}
        onMessageDelete={onMessageDelete}
        onMessageReply={onMessageReply}
        onReactionAdd={onReactionAdd}
        onReactionRemove={onReactionRemove}
        currentUserId={currentUserId}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInputSection
        message={actualMessage}
        setMessage={actualSetMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        isSubmitting={isLoading}
        editingMessageId={editingMessageId}
        replyingToMessage={replyingToMessage}
        onCancelEdit={onCancelEdit}
        onCancelReply={onCancelReply}
        isAdmin={isAdmin}
        onAdminEffectSelect={onAdminEffectSelect}
        onEmojiSelect={onEmojiSelect}
        onGifSelect={onGifSelect}
      />
    </div>
  );
};
