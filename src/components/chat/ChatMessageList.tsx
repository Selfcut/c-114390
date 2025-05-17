
import React from "react";
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
  currentUserId?: string;
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
  const groupedMessages = messages.reduce((groups: Record<string, ChatMessageType[]>, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Get dates in order
  const dates = Object.keys(groupedMessages).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading messages...</div>;
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
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
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
                isCurrentUser={message.userId === currentUserId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
