
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './types';
import { formatTime } from './utils/formatTime';
import { MoreHorizontal, Reply, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageBubbleProps {
  message: ChatMessage;
  onEdit?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onEdit, 
  onReply 
}) => {
  const isCurrentUser = message.isCurrentUser;

  const getEffectStyles = (effectType?: string) => {
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
  };

  return (
    <div className={`group flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.avatarUrl} alt={message.senderName} />
        <AvatarFallback className="text-xs">
          {message.senderName?.charAt(0).toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
        <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-sm font-medium text-foreground">
            {message.senderName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
          {message.isAdmin && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              Admin
            </span>
          )}
        </div>
        
        <div className="relative group">
          <div className={`
            chat-message p-3 rounded-lg max-w-xs sm:max-w-sm lg:max-w-md
            ${isCurrentUser 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : `bg-card text-card-foreground rounded-bl-sm ${getEffectStyles(message.effectType)}`
            }
          `}>
            {message.content}
          </div>
          
          {/* Message actions */}
          <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity ${
            isCurrentUser ? '-left-8' : '-right-8'
          }`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                <DropdownMenuItem onClick={() => onReply?.(message.id)}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                {isCurrentUser && (
                  <DropdownMenuItem onClick={() => onEdit?.(message.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
