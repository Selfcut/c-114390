
import React from 'react';
import { Button } from "@/components/ui/button";

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  currentUserId: string | null;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  messageId,
  currentUserId,
  onReactionAdd,
  onReactionRemove
}) => {
  if (!reactions || reactions.length === 0) return null;
  
  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    const hasReacted = reaction?.users.includes(currentUserId || 'anonymous');
    
    if (hasReacted && onReactionRemove) {
      onReactionRemove(messageId, emoji);
    } else if (!hasReacted && onReactionAdd) {
      onReactionAdd(messageId, emoji);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((reaction, index) => {
        const hasReacted = reaction.users.includes(currentUserId || 'anonymous');
        
        return (
          <Button
            key={`${reaction.emoji}-${index}`}
            variant={hasReacted ? "secondary" : "outline"}
            size="sm"
            className="h-6 px-2 py-0 text-xs rounded-full flex items-center gap-1"
            onClick={() => handleReactionClick(reaction.emoji)}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </Button>
        );
      })}
    </div>
  );
};
