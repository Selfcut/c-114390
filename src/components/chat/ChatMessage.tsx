
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
}

export const ChatMessage = ({ message, formatTime }: ChatMessageProps) => {
  const [showReactions, setShowReactions] = React.useState(false);
  const [reactions, setReactions] = React.useState<Reaction[]>([
    { emoji: "👍", count: 0, users: [] },
    { emoji: "❤️", count: 0, users: [] },
    { emoji: "😂", count: 0, users: [] }
  ]);
  
  const currentUserId = "current-user"; // This would come from auth in a real app
  const isCurrentUser = message.userId === currentUserId;
  
  const handleReactionAdd = (messageId: string, emoji: string) => {
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
          {reactions.some(r => r.count > 0) && (
            <MessageReactions 
              reactions={reactions}
              messageId={message.id}
              onReactionAdd={handleReactionAdd}
              onReactionRemove={handleReactionRemove}
            />
          )}
        </div>
      </div>
      
      {/* Quick reaction button that appears on hover */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
};
