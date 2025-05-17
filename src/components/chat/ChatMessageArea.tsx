
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageList } from "./ChatMessageList";
import { ChatMessage } from "./types";

interface ChatMessageAreaProps {
  isLoadingMessages: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  formatTime: (timestamp: string) => string;
  onMessageEdit: (messageId: string) => void;
  onMessageDelete: (messageId: string) => void;
  onMessageReply: (messageId: string) => void;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
  currentUserId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessageArea = ({
  isLoadingMessages,
  messages,
  isLoading,
  formatTime,
  onMessageEdit,
  onMessageDelete,
  onMessageReply,
  onReactionAdd,
  onReactionRemove,
  currentUserId,
  messagesEndRef,
}: ChatMessageAreaProps) => {
  return (
    <>
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
    </>
  );
};
