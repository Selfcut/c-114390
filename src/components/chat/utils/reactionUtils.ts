
import { ChatMessage, Reaction } from "../types";

/**
 * Add a reaction to a message
 */
export const addReactionToMessage = (
  messages: ChatMessage[],
  messageId: string,
  emoji: string,
  userId: string | null
): ChatMessage[] => {
  return messages.map(msg => {
    if (msg.id === messageId) {
      const existingReactions = msg.reactions || [];
      const existingReaction = existingReactions.find(r => r.emoji === emoji);
      const userIdToUse = userId || 'anonymous';
      
      let updatedReactions: Reaction[];
      
      if (existingReaction) {
        // Increase count if reaction exists and user hasn't already reacted
        if (!existingReaction.users.includes(userIdToUse)) {
          updatedReactions = existingReactions.map(r => 
            r.emoji === emoji 
              ? { ...r, count: r.count + 1, users: [...r.users, userIdToUse] }
              : r
          );
        } else {
          // User already reacted with this emoji
          updatedReactions = existingReactions;
        }
      } else {
        // Add new reaction type
        updatedReactions = [
          ...existingReactions, 
          { emoji, count: 1, users: [userIdToUse] }
        ];
      }
      
      return { ...msg, reactions: updatedReactions };
    }
    return msg;
  });
};

/**
 * Remove a reaction from a message
 */
export const removeReactionFromMessage = (
  messages: ChatMessage[],
  messageId: string,
  emoji: string,
  userId: string | null
): ChatMessage[] => {
  return messages.map(msg => {
    if (msg.id === messageId && msg.reactions) {
      const userIdToUse = userId || 'anonymous';
      
      const updatedReactions = msg.reactions
        .map(r => {
          if (r.emoji === emoji && r.users.includes(userIdToUse)) {
            return {
              ...r,
              count: Math.max(0, r.count - 1),
              users: r.users.filter(id => id !== userIdToUse)
            };
          }
          return r;
        })
        .filter(r => r.count > 0);
      
      return { ...msg, reactions: updatedReactions };
    }
    return msg;
  });
};
