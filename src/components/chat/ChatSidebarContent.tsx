
import React from "react";
import { ConversationsList } from "./ConversationsList";
import { ChatContent } from "./ChatContent";
import { ConversationItem, ChatMessage } from "./types";

interface ChatSidebarContentProps {
  isOpen: boolean;
  selectedConversation: string;
  conversations: ConversationItem[];
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  isLoading: boolean;
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
  formatTime: (timestamp: string) => string;
  onMessageEdit: (messageId: string) => void;
  onMessageDelete: (messageId: string) => void;
  onMessageReply: (messageId: string) => void;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

export const ChatSidebarContent: React.FC<ChatSidebarContentProps> = ({
  isOpen,
  selectedConversation,
  conversations,
  messages,
  isLoadingMessages,
  isLoading,
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
  formatTime,
  onMessageEdit,
  onMessageDelete,
  onMessageReply,
  onReactionAdd,
  onReactionRemove,
  onSelectConversation
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b p-2">
        <ConversationsList 
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      </div>
      
      <ChatContent
        isLoadingMessages={isLoadingMessages}
        messages={messages}
        isLoading={isLoading}
        formatTime={formatTime}
        onMessageEdit={onMessageEdit}
        onMessageDelete={onMessageDelete}
        onMessageReply={onMessageReply}
        onReactionAdd={onReactionAdd}
        onReactionRemove={onReactionRemove}
        message={inputMessage}
        setMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        editingMessageId={editingMessageId}
        replyingToMessage={replyingToMessage}
        onCancelEdit={onCancelEdit}
        onCancelReply={onCancelReply}
        onEmojiSelect={onEmojiSelect}
        onGifSelect={onGifSelect}
        isAdmin={isAdmin}
        onAdminEffectSelect={onAdminEffectSelect}
        messagesEndRef={messagesEndRef}
        currentUserId={currentUserId}
      />
    </div>
  );
};
