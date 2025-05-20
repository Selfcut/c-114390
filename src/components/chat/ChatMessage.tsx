
import React from 'react';
import { Avatar } from '../ui/avatar';
import { FormattedDate } from '../FormattedDate';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
        {!isCurrentUser && (
          <Avatar 
            className="h-8 w-8 mr-2"
            fallback={message.senderName?.[0] || '?'} 
          />
        )}
        <div>
          <div className={`flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
            <span className="text-sm font-medium mr-2">{message.senderName || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">
              <FormattedDate date={message.createdAt} format="relative" fallback="Just now" />
            </span>
          </div>
          <div className={`p-3 rounded-lg ${
            isCurrentUser 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : 'bg-muted rounded-tl-none'
          }`}>
            {message.content}
          </div>
        </div>
        {isCurrentUser && (
          <Avatar 
            className="h-8 w-8 ml-2"
            fallback={message.senderName?.[0] || '?'} 
          />
        )}
      </div>
    </div>
  );
};
