import { useState, useCallback } from "react";
import { ChatMessage, MessageReaction } from "../types";

export const useMessageReactions = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const handleReactionAdd = useCallback((messageId: string, emoji: string, userId: string | null) => {
    setMessages(prev => {
      return prev.map(message => {
        if (message.id === messageId) {
          // Find existing reaction or create new one
          const existingReactionIndex = message.reactions?.findIndex(r => r.emoji === emoji) ?? -1;
          const reactions = [...(message.reactions || [])];
          
          if (existingReactionIndex >= 0) {
            // Update existing reaction
            const reaction = reactions[existingReactionIndex];
            const userIdToUse = userId || 'anonymous';
            
            if (!reaction.users.includes(userIdToUse)) {
              reactions[existingReactionIndex] = {
                ...reaction,
                count: reaction.count + 1,
                users: [...reaction.users, userIdToUse]
              };
            }
          } else {
            // Add new reaction
            const newReaction: MessageReaction = {
              id: `reaction-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              emoji,
              count: 1,
              users: userId ? [userId] : ['anonymous'],
              userId: userId || 'anonymous',
              messageId
            };
            reactions.push(newReaction);
          }
          
          return { ...message, reactions };
        }
        return message;
      });
    });
  }, []);
  
  const handleReactionRemove = useCallback((messageId: string, emoji: string, userId: string | null) => {
    setMessages(prev => {
      return prev.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions?.filter(r => {
            if (r.emoji === emoji) {
              const userIdToUse = userId || 'anonymous';
              // If user has reacted, remove them and decrease count
              if (r.users.includes(userIdToUse)) {
                r.users = r.users.filter(id => id !== userIdToUse);
                r.count = r.count - 1;
              }
              // Only keep reactions with positive counts
              return r.count > 0;
            }
            return true;
          }) || [];
          
          return { ...message, reactions };
        }
        return message;
      });
    });
  }, []);
  
  return {
    messages,
    setMessages,
    handleReactionAdd,
    handleReactionRemove
  };
};
