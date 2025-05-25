import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FormattedDate } from '../FormattedDate';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  formatTime?: (timestamp: string) => string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  currentUserId?: string | null;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser, 
  formatTime, 
  onEdit, 
  onDelete, 
  onReply, 
  onReactionAdd, 
  onReactionRemove, 
  currentUserId 
}) => {
  // Improved time formatting with better error handling
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Just now';
      
      if (formatTime) {
        return formatTime(timestamp);
      }
      
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
    } catch (error) {
      console.warn('Error formatting message time:', error);
      return 'Just now';
    }
  };

  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={message.avatarUrl || message.sender?.avatarUrl} alt={message.senderName || 'User'} />
            <AvatarFallback>
              {message.senderName?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <div className={`flex items-center ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
            <span className="text-sm font-medium mr-2">{message.senderName || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">
              {formatMessageTime(message.createdAt)}
            </span>
            {message.isAdmin && (
              <span className="ml-1 text-primary font-medium text-[10px] uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>
          <div className={`p-3 rounded-lg border-0 ${
            isCurrentUser 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : message.effectType 
                ? `bg-muted rounded-tl-none ${getEffectClassNames(message.effectType)}`
                : 'bg-muted rounded-tl-none'
          }`}>
            {message.content}
          </div>
        </div>
        {isCurrentUser && (
          <Avatar className="h-8 w-8 ml-2">
            <AvatarImage src={message.avatarUrl || message.sender?.avatarUrl} alt={message.senderName || 'User'} />
            <AvatarFallback>
              {message.senderName?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

// Helper function to get effect-specific class names
function getEffectClassNames(effectType: string): string {
  switch (effectType) {
    case 'announcement':
      return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
    case 'celebrate':
      return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
    case 'warning':
      return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    case 'highlight':
      return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800';
    default:
      return '';
  }
}
