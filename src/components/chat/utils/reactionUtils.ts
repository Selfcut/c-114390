
import { ChatMessage, MessageReaction } from '../types';

/**
 * Add a reaction to a message
 */
export const addReactionToMessage = (
  messages: ChatMessage[], 
  messageId: string, 
  emoji: string, 
  userId: string
): ChatMessage[] => {
  return messages.map(message => {
    if (message.id === messageId) {
      const reactions = message.reactions || [];
      
      // Check if user already reacted with this emoji
      const existingReaction = reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        // If user already reacted, increment count and add user
        if (!existingReaction.users.includes(userId)) {
          return {
            ...message,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? { 
                    ...r, 
                    count: r.count + 1, 
                    users: [...r.users, userId] 
                  }
                : r
            )
          };
        }
      } else {
        // Create new reaction
        const newReaction: MessageReaction = {
          id: `reaction-${Date.now()}-${Math.random()}`,
          emoji,
          userId,
          username: 'User', // Would get from user context
          messageId,
          users: [userId],
          count: 1
        };
        
        return {
          ...message,
          reactions: [...reactions, newReaction]
        };
      }
    }
    return message;
  });
};

/**
 * Remove a reaction from a message
 */
export const removeReactionFromMessage = (
  messages: ChatMessage[], 
  messageId: string, 
  emoji: string, 
  userId: string
): ChatMessage[] => {
  return messages.map(message => {
    if (message.id === messageId) {
      const reactions = message.reactions || [];
      
      return {
        ...message,
        reactions: reactions
          .map(reaction => {
            if (reaction.emoji === emoji && reaction.users.includes(userId)) {
              const newUsers = reaction.users.filter(id => id !== userId);
              return {
                ...reaction,
                users: newUsers,
                count: Math.max(0, reaction.count - 1)
              };
            }
            return reaction;
          })
          .filter(reaction => reaction.count > 0) // Remove reactions with 0 count
      };
    }
    return message;
  });
};

/**
 * Toggle a reaction on a message
 */
export const toggleReaction = (
  messages: ChatMessage[], 
  messageId: string, 
  emoji: string, 
  userId: string
): ChatMessage[] => {
  const message = messages.find(m => m.id === messageId);
  if (!message) return messages;
  
  const reactions = message.reactions || [];
  const existingReaction = reactions.find(r => r.emoji === emoji);
  
  if (existingReaction && existingReaction.users.includes(userId)) {
    return removeReactionFromMessage(messages, messageId, emoji, userId);
  } else {
    return addReactionToMessage(messages, messageId, emoji, userId);
  }
};
