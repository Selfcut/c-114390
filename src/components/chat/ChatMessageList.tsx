
import React, { useMemo } from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { ChatMessage } from "./ChatMessage";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  formatTime: (timestamp: string) => string;
  onMessageEdit?: (messageId: string) => void;
  onMessageDelete?: (messageId: string) => void;
  onMessageReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  currentUserId?: string | null;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

export const ChatMessageList = ({
  messages,
  isLoading,
  formatTime,
  onMessageEdit,
  onMessageDelete,
  onMessageReply,
  onReactionAdd,
  onReactionRemove,
  currentUserId,
  messagesEndRef
}: ChatMessageListProps) => {
  // Group messages by date for better organization
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups: Record<string, ChatMessageType[]>, message) => {
      try {
        const date = new Date(message.createdAt);
        if (isNaN(date.getTime())) {
          // Use current date as fallback for invalid dates
          const fallbackDate = new Date().toLocaleDateString();
          if (!groups[fallbackDate]) {
            groups[fallbackDate] = [];
          }
          groups[fallbackDate].push(message);
        } else {
          const dateStr = date.toLocaleDateString();
          if (!groups[dateStr]) {
            groups[dateStr] = [];
          }
          groups[dateStr].push(message);
        }
      } catch (error) {
        console.error('Error parsing message date:', error, message);
        const fallbackDate = new Date().toLocaleDateString();
        if (!groups[fallbackDate]) {
          groups[fallbackDate] = [];
        }
        groups[fallbackDate].push(message);
      }
      return groups;
    }, {});
  }, [messages]);

  // Get dates in order
  const dates = useMemo(() => {
    return Object.keys(groupedMessages).sort((a, b) => {
      try {
        return new Date(a).getTime() - new Date(b).getTime();
      } catch (error) {
        return 0; // Keep the order as is if dates are invalid
      }
    });
  }, [groupedMessages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 h-full">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-sm text-muted-foreground">Loading messages...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No messages yet</p>
        <p className="text-sm text-muted-foreground">Start the conversation by sending a message</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">
      {dates.map(date => (
        <div key={date}>
          <div className="text-center my-2">
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground border-0">
              {new Date(date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="space-y-1">
            {groupedMessages[date].map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                formatTime={formatTime}
                onEdit={onMessageEdit}
                onDelete={onMessageDelete}
                onReply={onMessageReply}
                onReactionAdd={onReactionAdd}
                onReactionRemove={onReactionRemove}
                isCurrentUser={message.userId === currentUserId || message.isCurrentUser === true}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};
