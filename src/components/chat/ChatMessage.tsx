
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from "./types";
import { parseMarkdown } from "@/lib/utils/message-utils";
import { MessageReactions } from "./MessageReactions";

interface ChatMessageProps {
  message: ChatMessageType;
  formatTime: (date: Date) => string;
  id?: string;
  content?: string;
  sender?: {
    id?: string;
    name: string;
    avatar: string;
    isSystem?: boolean;
  };
  isCurrentUser?: boolean;
  timestamp?: Date;
  isEdited?: boolean;
  reactions?: Array<{emoji: string; count: number; users: string[]}>;
  replyTo?: {
    id: string;
    content: string;
    sender: { name: string };
  };
  mentions?: string[];
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
}

export const ChatMessage = ({ 
  message, 
  formatTime,
  id,
  content,
  sender,
  isCurrentUser,
  timestamp,
  isEdited,
  reactions,
  replyTo,
  mentions,
  onEdit,
  onDelete,
  onReply,
  onReactionAdd,
  onReactionRemove
}: ChatMessageProps) => {
  // Use the appropriate source for each prop (from message object or direct prop)
  const messageId = id || message.id;
  const messageContent = content || message.content;
  const messageSender = sender || message.sender;
  const messageTimestamp = timestamp || message.timestamp;
  
  // Handle reaction click
  const handleReact = (emoji: string) => {
    if (onReactionAdd) {
      onReactionAdd(messageId, emoji);
    }
  };
  
  return (
    <div className="flex gap-2 p-2 hover:bg-muted/20 rounded-md group">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={messageSender.avatar} />
        <AvatarFallback>{messageSender.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm ${messageSender.isSystem ? 'text-primary' : ''}`}>
            {messageSender.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(messageTimestamp)}
          </span>
          {isEdited && <span className="text-xs text-muted-foreground">(edited)</span>}
        </div>
        
        {/* Display reply information if available */}
        {replyTo && (
          <div className="ml-2 pl-2 border-l-2 border-muted mt-1 mb-2 text-xs text-muted-foreground">
            <span className="font-medium">{replyTo.sender.name}:</span> {replyTo.content.length > 50 ? `${replyTo.content.substring(0, 50)}...` : replyTo.content}
          </div>
        )}
        
        {/* Render message content with support for mentions and markdown */}
        <div className="text-sm break-words">{parseMarkdown(messageContent)}</div>
        
        {/* Message reactions */}
        {reactions && reactions.length > 0 && (
          <MessageReactions 
            reactions={reactions} 
            messageId={messageId}
            onReactionAdd={onReactionAdd || (() => {})}
            onReactionRemove={onReactionRemove}
            onReact={handleReact}
          />
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onReply && (
            <button 
              onClick={() => onReply(messageId)} 
              className="text-xs text-muted-foreground hover:underline"
            >
              Reply
            </button>
          )}
          {onReactionAdd && (
            <button 
              onClick={() => onReactionAdd(messageId, '👍')} 
              className="text-xs text-muted-foreground hover:underline"
            >
              React
            </button>
          )}
          {isCurrentUser && onEdit && (
            <button 
              onClick={() => onEdit(messageId)} 
              className="text-xs text-muted-foreground hover:underline"
            >
              Edit
            </button>
          )}
          {isCurrentUser && onDelete && (
            <button 
              onClick={() => onDelete(messageId)} 
              className="text-xs text-muted-foreground hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
