
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
  formatTime: (date: Date) => string;
  id?: string; // Added to match the prop being passed
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
  
  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={messageSender.avatar} />
        <AvatarFallback>{messageSender.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm ${messageSender.isSystem ? 'text-primary' : ''}`}>
            {messageSender.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(messageTimestamp)}
          </span>
        </div>
        <p className="text-sm break-words">{messageContent}</p>
        
        {/* Add support for reactions, replies, etc. if those props are provided */}
        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {reactions.map((reaction, idx) => (
              <span key={`${reaction.emoji}-${idx}`} className="text-xs bg-muted/50 px-1.5 py-0.5 rounded-full">
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}
        
        {/* Display reply information if available */}
        {replyTo && (
          <div className="ml-2 pl-2 border-l-2 border-muted mt-1 text-xs text-muted-foreground">
            <span>Reply to {replyTo.sender.name}</span>
          </div>
        )}
        
        {/* Action buttons if the handlers are provided */}
        {(onEdit || onDelete || onReply) && isCurrentUser && (
          <div className="flex gap-2 mt-1">
            {onReply && (
              <button 
                onClick={() => onReply(messageId)} 
                className="text-xs text-muted-foreground hover:underline"
              >
                Reply
              </button>
            )}
            {onEdit && (
              <button 
                onClick={() => onEdit(messageId)} 
                className="text-xs text-muted-foreground hover:underline"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(messageId)} 
                className="text-xs text-muted-foreground hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
