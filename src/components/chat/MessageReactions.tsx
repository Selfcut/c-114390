
import React, { useState } from 'react';
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
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const commonEmojis = ["👍", "👎", "😄", "🎉", "❤️", "🔥"];
  
  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    const userIdToUse = currentUserId || 'anonymous';
    
    if (!reaction) {
      if (onReactionAdd) {
        onReactionAdd(messageId, emoji);
      }
      return;
    }
    
    const hasReacted = reaction.users.includes(userIdToUse);
    
    if (hasReacted && onReactionRemove) {
      onReactionRemove(messageId, emoji);
    } else if (!hasReacted && onReactionAdd) {
      onReactionAdd(messageId, emoji);
    }
  };

  return (
    <div className="relative message-reactions group">
      {/* Display existing reactions */}
      {reactions && reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 existing-reactions">
          {reactions.map((reaction, index) => {
            const userIdToUse = currentUserId || 'anonymous';
            const hasReacted = reaction.users.includes(userIdToUse);
            
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
      )}
      
      {/* Add reaction button that shows on message hover */}
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 py-0 text-xs rounded-full"
        onClick={() => setShowReactionPicker(!showReactionPicker)}
      >
        +
      </Button>
      
      {/* Reaction picker that shows when add reaction is clicked */}
      {showReactionPicker && (
        <div className="absolute bottom-full mb-1 bg-background border rounded-md shadow-md p-1 flex z-10 animate-fade-in">
          {commonEmojis.map(emoji => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                handleReactionClick(emoji);
                setShowReactionPicker(false);
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
