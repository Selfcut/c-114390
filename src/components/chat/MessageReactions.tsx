
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
  currentUserId: string;
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
  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted && onReactionRemove) {
      onReactionRemove(messageId, emoji);
    } else if (!hasReacted && onReactionAdd) {
      onReactionAdd(messageId, emoji);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 ml-2">
      {reactions.map((reaction, index) => {
        const hasReacted = reaction.users.includes(currentUserId);
        
        return (
          <Button
            key={`${reaction.emoji}-${index}`}
            variant={hasReacted ? "secondary" : "outline"}
            size="sm"
            className="h-6 px-2 py-0 text-xs rounded-full flex items-center gap-1"
            onClick={() => handleReactionClick(reaction.emoji, hasReacted)}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </Button>
        );
      })}
    </div>
  );
};
