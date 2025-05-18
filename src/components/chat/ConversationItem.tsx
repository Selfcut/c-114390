
import React from 'react';
import { Calendar, Globe, Users } from 'lucide-react';
import { ConversationItem as ConversationItemType } from './types';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ConversationItemProps {
  conversation: ConversationItemType;
  isSelected: boolean;
  onClick: () => void;
  onSelect?: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
  onSelect
}) => {
  // Format the last activity time
  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  const lastActivityTime = conversation.lastActivityAt 
    ? formatLastActivity(conversation.lastActivityAt)
    : conversation.updatedAt 
      ? formatLastActivity(conversation.updatedAt)
      : '';

  const handleClick = () => {
    onClick();
    if (onSelect) {
      onSelect(conversation.id);
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-accent' : 'hover:bg-accent/50'
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.avatar} />
        <AvatarFallback>
          {conversation.name ? conversation.name.charAt(0).toUpperCase() : 'C'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">
            {conversation.name}
            {conversation.isGlobal && (
              <Globe className="inline ml-1" size={14} />
            )}
            {conversation.isGroup && !conversation.isGlobal && (
              <Users className="inline ml-1" size={14} />
            )}
          </span>
          {conversation.unread && conversation.unread > 0 ? (
            <Badge variant="default" className="ml-2">
              {conversation.unread}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center">
              <Calendar size={12} className="mr-1" />
              {lastActivityTime}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  );
};
