
import React from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageReactions } from "./MessageReactions";
import { MessageHeader } from "./message/MessageHeader";
import { MessageContent } from "./message/MessageContent";
import { MessageActions } from "./message/MessageActions";
import { MessageReplyReference } from "./message/MessageReplyReference";

export interface ChatMessageProps {
  message: ChatMessageType;
  formatTime: (timestamp: string) => string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  isCurrentUser?: boolean;
  currentUserId?: string;
}

export const ChatMessage = ({
  message,
  formatTime,
  onEdit,
  onDelete,
  onReply,
  onReactionAdd,
  onReactionRemove,
  isCurrentUser,
  currentUserId
}: ChatMessageProps) => {
  // Apply special styles based on effect type
  const getMessageStyles = () => {
    const baseStyles = "p-3 rounded-lg max-w-[80%] break-words";
    
    if (message.isSystem) {
      return `${baseStyles} bg-muted text-center mx-auto italic text-muted-foreground`;
    }
    
    if (isCurrentUser) {
      return `${baseStyles} bg-primary text-primary-foreground ml-auto`;
    }
    
    if (message.isAdmin) {
      return `${baseStyles} bg-destructive/20 mr-auto`;
    }
    
    return `${baseStyles} bg-card mr-auto border`;
  };
  
  // Get special effect classes
  const getEffectClasses = () => {
    if (!message.effectType) return "";
    
    switch (message.effectType) {
      case 'rainbow':
        return "rainbow-text";
      case 'highlight':
        return "highlight-glow";
      case 'shake':
        return "shake-animation";
      case 'announcement':
        return "announcement-message";
      case 'system-alert':
        return "system-alert-message";
      case 'pin':
        return "pinned-message";
      default:
        return "";
    }
  };

  return (
    <div className={`flex flex-col mb-4 group ${message.isSystem ? 'px-4' : ''}`}>
      {/* Reply reference */}
      {message.replyTo && <MessageReplyReference replyTo={message.replyTo} />}
      
      <div className="flex items-start gap-2 relative">
        {/* Avatar - don't show for system messages */}
        {!message.isSystem && (
          <div className="flex-shrink-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{message.senderName?.[0] || '?'}</AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className="flex flex-col flex-grow">
          {/* Message header - don't show for system messages */}
          {!message.isSystem && (
            <MessageHeader 
              senderName={message.senderName}
              isAdmin={message.isAdmin || false}
              formatTime={formatTime}
              createdAt={message.createdAt}
              isEdited={message.isEdited}
            />
          )}
          
          {/* Message content */}
          <MessageContent 
            content={message.content} 
            className={`${getMessageStyles()} ${getEffectClasses()}`} 
          />
          
          {/* Reaction display area - displays existing reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <MessageReactions
                reactions={message.reactions}
                messageId={message.id}
                currentUserId={currentUserId || ''}
                onReactionAdd={onReactionAdd}
                onReactionRemove={onReactionRemove}
              />
            </div>
          )}
        </div>
        
        {/* Message actions - positioned absolutely and only visible on hover */}
        {!message.isSystem && (
          <MessageActions 
            isCurrentUser={isCurrentUser || false}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            messageId={message.id}
          />
        )}
      </div>
    </div>
  );
};
