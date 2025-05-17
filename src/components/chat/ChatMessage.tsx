
import React from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Reply } from "lucide-react";
import { MessageReactions } from "./MessageReactions";

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
  // Function to check if message contains markdown image
  const containsImage = (content: string) => {
    return /!\[.*?\]\(.*?\)/.test(content);
  };

  // Function to render markdown content
  const renderContent = (content: string) => {
    // Check for GIF or image markdown format: ![alt](url)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>);
      }

      // Add the image
      const alt = match[1];
      const url = match[2];
      parts.push(
        <img 
          key={`img-${match.index}`} 
          src={url} 
          alt={alt} 
          className="max-w-full rounded-md my-1 max-h-60 object-contain" 
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : content;
  };

  // Handle message actions
  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message.id);
    }
  };

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
    <div className={`flex flex-col mb-4 ${message.isSystem ? 'px-4' : ''}`}>
      {/* Reply reference */}
      {message.replyTo && (
        <div className="flex items-center text-xs text-muted-foreground mb-1 ml-12">
          <Reply size={12} className="mr-1" />
          Replying to <span className="font-medium ml-1">{message.replyTo.sender.name}</span>:
          <span className="ml-1 truncate max-w-[150px]">"{message.replyTo.content}"</span>
        </div>
      )}
      
      <div className="flex items-start gap-2">
        {/* Avatar - don't show for system messages */}
        {!message.isSystem && (
          <div className="flex-shrink-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{message.senderName?.[0] || '?'}</AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className="flex flex-col">
          {/* Message header - don't show for system messages */}
          {!message.isSystem && (
            <div className="flex items-center mb-1">
              <span className="font-medium text-sm">
                {message.senderName}
                {message.isAdmin && (
                  <span className="ml-1 text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {formatTime(message.createdAt)}
                {message.isEdited && <span className="ml-1">(edited)</span>}
              </span>
            </div>
          )}
          
          {/* Message content */}
          <div className={`${getMessageStyles()} ${getEffectClasses()}`}>
            {renderContent(message.content)}
          </div>
          
          {/* Message actions */}
          {!message.isSystem && (
            <div className="flex items-center mt-1 gap-1">
              {isCurrentUser && onEdit && (
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleEdit}>
                  <Edit size={14} />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              
              {isCurrentUser && onDelete && (
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleDelete}>
                  <Trash2 size={14} />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
              
              {onReply && (
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleReply}>
                  <Reply size={14} />
                  <span className="sr-only">Reply</span>
                </Button>
              )}
              
              {/* Message reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <MessageReactions
                  reactions={message.reactions}
                  messageId={message.id}
                  currentUserId={currentUserId || ''}
                  onReactionAdd={onReactionAdd}
                  onReactionRemove={onReactionRemove}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
