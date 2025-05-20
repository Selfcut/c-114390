
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageReaction } from './types';

interface MessageReactionsProps {
  messageId: string;
}

export const MessageReactions = ({ messageId }: MessageReactionsProps) => {
  // In a real app, this data would come from the database
  const [reactions, setReactions] = useState<MessageReaction[]>([
    { id: '1', emoji: '👍', count: 1, messageId, userId: 'system', users: ['system'] },
    { id: '2', emoji: '❤️', count: 0, messageId, userId: 'system', users: [] },
    { id: '3', emoji: '😂', count: 0, messageId, userId: 'system', users: [] },
  ]);

  const toggleReaction = (emoji: string) => {
    setReactions(prev => 
      prev.map(reaction => {
        if (reaction.emoji === emoji) {
          const newUserReacted = !reaction.users.includes('current-user');
          return {
            ...reaction,
            count: reaction.count + (newUserReacted ? 1 : -1),
            users: newUserReacted 
              ? [...reaction.users, 'current-user'] 
              : reaction.users.filter(id => id !== 'current-user')
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
          variant={reaction.users.includes('current-user') ? "secondary" : "outline"}
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
