
import React, { useState } from 'react';
import { ChatMessage } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Reply, Trash2, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageReactions } from './MessageReactions';

interface MessageBubbleProps {
  message: ChatMessage;
  onEdit?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble = ({ 
  message,
  onEdit,
  onReply,
  onDelete
}: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(false);
  
  // Format message timestamp
  const formattedTime = message.createdAt 
    ? format(new Date(message.createdAt), 'h:mm a')
    : '';

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle message edit
  const handleEdit = () => {
    if (onEdit && message.isCurrentUser) {
      onEdit(message.id);
    }
  };

  // Handle message reply
  const handleReply = () => {
    if (onReply) {
      onReply(message.id);
    }
  };

  // Handle message delete
  const handleDelete = () => {
    if (onDelete && message.isCurrentUser) {
      onDelete(message.id);
    }
  };

  // Handle like toggle
  const handleLike = () => {
    setLiked(!liked);
  };

  // Apply styling based on message effectType
  const getEffectStyles = () => {
    if (!message.effectType) return '';
    
    switch (message.effectType) {
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
    <div 
      className={cn(
        "group flex gap-2", 
        message.isCurrentUser ? "flex-row-reverse" : ""
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={`https://avatar.vercel.sh/${message.userId || 'user'}.png`} />
        <AvatarFallback>
          {getInitials(message.senderName || 'User')}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn("flex flex-col max-w-[75%]", message.isCurrentUser ? "items-end" : "items-start")}>
        {/* Sender name */}
        <div className={cn(
          "text-xs text-muted-foreground mb-1",
          message.isCurrentUser ? "text-right" : "text-left"
        )}>
          {message.senderName || 'Anonymous'} • {formattedTime}
          {message.isAdmin && (
            <span className="ml-1 text-primary font-medium text-[10px] uppercase tracking-wider">
              Admin
            </span>
          )}
        </div>
        
        {/* Message content */}
        <Card 
          className={cn(
            "p-3 break-words", 
            message.isCurrentUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted",
            getEffectStyles()
          )}
        >
          <ReactMarkdown
            className="prose dark:prose-invert max-w-none prose-sm"
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Message reactions would go here */}
          <MessageReactions messageId={message.id} />
        </Card>
        
        {/* Message actions */}
        <div 
          className={cn(
            "flex mt-1 gap-1 transition-opacity",
            showActions ? "opacity-100" : "opacity-0",
            message.isCurrentUser ? "justify-start flex-row-reverse" : "justify-end"
          )}
        >
          {message.isCurrentUser && onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={handleEdit}
            >
              <Edit size={12} />
              <span className="sr-only">Edit</span>
            </Button>
          )}
          
          {onReply && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={handleReply}
            >
              <Reply size={12} />
              <span className="sr-only">Reply</span>
            </Button>
          )}
          
          <Button 
            variant={liked ? "default" : "ghost"}
            size="icon" 
            className={cn("h-6 w-6 rounded-full", liked && "bg-primary/20 text-primary hover:bg-primary/30")}
            onClick={handleLike}
          >
            <ThumbsUp size={12} />
            <span className="sr-only">Like</span>
          </Button>
          
          {message.isCurrentUser && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={handleDelete}
            >
              <Trash2 size={12} />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
