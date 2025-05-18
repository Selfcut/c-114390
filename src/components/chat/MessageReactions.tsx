
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ReactionItem {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface MessageReactionsProps {
  messageId: string;
}

export const MessageReactions = ({ messageId }: MessageReactionsProps) => {
  // In a real app, this data would come from the database
  const [reactions, setReactions] = useState<ReactionItem[]>([
    { emoji: '👍', count: 1, userReacted: false },
    { emoji: '❤️', count: 0, userReacted: false },
    { emoji: '😂', count: 0, userReacted: false },
  ]);

  const toggleReaction = (emoji: string) => {
    setReactions(prev => 
      prev.map(reaction => {
        if (reaction.emoji === emoji) {
          const newUserReacted = !reaction.userReacted;
          return {
            ...reaction,
            count: reaction.count + (newUserReacted ? 1 : -1),
            userReacted: newUserReacted
          };
        }
        return reaction;
      })
    );
  };
  
  // Only show reactions with count > 0
  const visibleReactions = reactions.filter(r => r.count > 0);
  
  if (visibleReactions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {visibleReactions.map(reaction => (
        <Button
          key={reaction.emoji}
          variant={reaction.userReacted ? "secondary" : "outline"}
          size="sm"
          className="h-6 py-0 px-1.5 text-xs"
          onClick={() => toggleReaction(reaction.emoji)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
};
