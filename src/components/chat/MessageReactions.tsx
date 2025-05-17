
import React from "react";

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
  currentUserId?: string;
}

export const MessageReactions = ({
  reactions,
  messageId,
  onReactionAdd,
  onReactionRemove,
  currentUserId = "current-user"
}: MessageReactionsProps) => {
  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      onReactionRemove?.(messageId, emoji);
    } else {
      onReactionAdd?.(messageId, emoji);
    }
  };

  // Filter out reactions with count 0
  const visibleReactions = reactions.filter(r => r.count > 0);

  if (!visibleReactions.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {visibleReactions.map((reaction) => {
        const hasReacted = reaction.users.includes(currentUserId || "");
        
        return (
          <button
            key={reaction.emoji}
            onClick={() => handleReactionClick(reaction.emoji, hasReacted)}
            className={`
              flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs
              ${hasReacted ? 'bg-primary/20 text-primary' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}
              transition-colors
            `}
            aria-label={`${reaction.emoji} reaction (${reaction.count})`}
          >
            <span>{reaction.emoji}</span>
            <span className="min-w-4 text-center">{reaction.count}</span>
          </button>
        );
      })}
    </div>
  );
};
