
import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "./types";
import { MessageReactions, Reaction } from "./MessageReactions";
import { parseMarkdown } from "@/lib/utils/message-utils";
import { Button } from "@/components/ui/button";
import { SmileIcon } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  formatTime: (timestamp: string) => string;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  isCurrentUser?: boolean;
  id?: string;
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
  reactions?: Reaction[];
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
  isCurrentUser
}: ChatMessageProps) => {
  const [showReactions, setShowReactions] = React.useState(false);
  const [reactions, setReactions] = React.useState<Reaction[]>([
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
          </div>
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
      {(onEdit || onDelete || onReply) && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {onReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onReply(message.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 17 2 2 4-4" />
                <path d="m9 15 2 2 7-7" />
                <path d="M14 10h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7" />
              </svg>
              <span className="sr-only">Reply</span>
            </Button>
          )}
          
          {isCurrentUser && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onEdit(message.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="sr-only">Edit</span>
            </Button>
          )}
          
          {isCurrentUser && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => onDelete(message.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span className="sr-only">Delete</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => setShowReactions(!showReactions)}
          >
            <SmileIcon size={14} />
            <span className="sr-only">Add reaction</span>
          </Button>
        </div>
      )}
      
      {/* Quick reaction popup */}
      {showReactions && (
        <div className="absolute right-2 top-10 bg-background border rounded-full shadow-lg p-1 flex gap-1">
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
