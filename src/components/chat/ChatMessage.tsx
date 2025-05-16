import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "./types";
import { MessageReactions, Reaction } from "./MessageReactions";
import { parseMarkdown } from "@/lib/utils/message-utils";
import { Button } from "@/components/ui/button";
import { SmileIcon, Reply, Pencil, Trash } from "lucide-react";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

interface ChatMessageProps {
  message: ChatMessageType;
  formatTime: (timestamp: string) => string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  isCurrentUser?: boolean;
  id?: string; // Add this line to fix the error
  content?: string;
  timestamp?: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    status: string;
  };
  isEdited?: boolean;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  replyTo?: {
    id: string;
    content: string;
    sender: { name: string };
  } | null;
  mentions?: string[];
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
  // We're ignoring the other props since they're already in the message object
  // and we don't need to use them separately
} : ChatMessageProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: "👍", count: 0, users: [] },
    { emoji: "❤️", count: 0, users: [] },
    { emoji: "😂", count: 0, users: [] }
  ]);
  
  const currentUserId = "current-user"; // This would come from auth in a real app
  
  const handleReactionAdd = (messageId: string, emoji: string) => {
    if (onReactionAdd) {
      onReactionAdd(messageId, emoji);
      return;
    }
    
    setReactions(prev => 
      prev.map(reaction => {
        if (reaction.emoji === emoji) {
          // Check if user already reacted with this emoji
          if (reaction.users.includes(currentUserId)) {
            return reaction;
          }
          
          return {
            ...reaction,
            count: reaction.count + 1,
            users: [...reaction.users, currentUserId]
          };
        }
        return reaction;
      })
    );
  };
  
  const handleReactionRemove = (messageId: string, emoji: string) => {
    if (onReactionRemove) {
      onReactionRemove(messageId, emoji);
      return;
    }
    
    setReactions(prev => 
      prev.map(reaction => {
        if (reaction.emoji === emoji && reaction.users.includes(currentUserId)) {
          return {
            ...reaction,
            count: Math.max(0, reaction.count - 1),
            users: reaction.users.filter(id => id !== currentUserId)
          };
        }
        return reaction;
      })
    );
  };

  // Parse and render message content with markdown, mentions and GIFs
  const renderedContent = parseMarkdown(message.content);

  return (
    <div 
      className={cn(
        "group relative px-4 py-2",
        isCurrentUser ? "bg-primary/10" : "hover:bg-accent/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {message.senderName?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{message.senderName}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>
          
          {/* Reply reference */}
          {message.replyTo && (
            <div className="mt-1 pl-2 border-l-2 border-primary/20 text-xs text-muted-foreground">
              <span className="font-medium">{message.replyTo.sender.name}</span>: {message.replyTo.content.length > 50 
                ? message.replyTo.content.substring(0, 50) + "..." 
                : message.replyTo.content}
            </div>
          )}
          
          <div className="mt-1 text-sm break-words">
            {renderedContent}
          </div>
          
          {/* Reactions */}
          {message.reactions && message.reactions.some(r => r.count > 0) && (
            <MessageReactions 
              reactions={message.reactions}
              messageId={message.id}
              onReactionAdd={handleReactionAdd}
              onReactionRemove={handleReactionRemove}
            />
          )}
        </div>
      </div>
      
      {/* Message actions menu that appears on hover */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {onReply && (
          <CustomTooltip content="Reply">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onReply(message.id)}
            >
              <Reply size={14} />
              <span className="sr-only">Reply</span>
            </Button>
          </CustomTooltip>
        )}
        
        {isCurrentUser && onEdit && (
          <CustomTooltip content="Edit">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onEdit(message.id)}
            >
              <Pencil size={14} />
              <span className="sr-only">Edit</span>
            </Button>
          </CustomTooltip>
        )}
        
        {isCurrentUser && onDelete && (
          <CustomTooltip content="Delete">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onDelete(message.id)}
            >
              <Trash size={14} />
              <span className="sr-only">Delete</span>
            </Button>
          </CustomTooltip>
        )}
        
        <CustomTooltip content="Add reaction">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => setShowReactions(!showReactions)}
          >
            <SmileIcon size={14} />
            <span className="sr-only">Add reaction</span>
          </Button>
        </CustomTooltip>
      </div>
      
      {/* Quick reaction popup */}
      {showReactions && (
        <div className="absolute right-2 top-10 bg-background border rounded-full shadow-lg p-1 flex gap-1 z-50">
          {reactions.map(reaction => (
            <button
              key={reaction.emoji}
              className="hover:bg-accent rounded-full w-7 h-7 flex items-center justify-center"
              onClick={() => {
                handleReactionAdd(message.id, reaction.emoji);
                setShowReactions(false);
              }}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
