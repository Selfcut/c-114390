
import React from 'react';
import { ChatMessage } from './types';
import { MessageBubble } from './MessageBubble';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MessageCircle } from 'lucide-react';

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

export const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  isLoadingMessages,
  messages,
  formatTime,
  onMessageEdit,
  onMessageReply,
  messagesEndRef,
}) => {
  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingScreen fullScreen={false} message="Loading messages..." />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
        <MessageCircle size={48} className="mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No messages yet</h3>
        <p className="text-sm">Be the first to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onEdit={onMessageEdit}
          onReply={onMessageReply}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
