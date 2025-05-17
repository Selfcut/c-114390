
import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
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
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {isLoadingMessages ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <ChatMessageList 
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
        </ScrollArea>
      )}
      
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
    </div>
  );
};
