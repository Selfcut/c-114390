
import { ChatMessage } from "../types";

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
    if (msg.id !== messageId) return msg;
    
    // Use a safe fallback user ID
    const safeUserId = userId || 'anonymous';
    
    // Initialize reactions array if it doesn't exist
    const existingReactions = msg.reactions || [];
    const existingReaction = existingReactions.find(r => r.emoji === emoji);
    
    let updatedReactions;
    
    if (existingReaction) {
      // Check if user already reacted with this emoji
      if (existingReaction.users.includes(safeUserId)) {
        // User already reacted, don't change anything
        return msg;
      }
      
      // Update existing reaction
      updatedReactions = existingReactions.map(r => 
        r.emoji === emoji 
          ? { ...r, count: r.count + 1, users: [...r.users, safeUserId] }
          : r
      );
    } else {
      // Add new reaction
      updatedReactions = [
        ...existingReactions, 
        { emoji, count: 1, users: [safeUserId] }
      ];
    }
    
    return { ...msg, reactions: updatedReactions };
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
    if (msg.id !== messageId) return msg;
    
    // Use a safe fallback user ID
    const safeUserId = userId || 'anonymous';
    
    // Check if reactions exist
    const existingReactions = msg.reactions || [];
    const existingReaction = existingReactions.find(r => r.emoji === emoji);
    
    // If no reaction exists or user hasn't reacted, don't change anything
    if (!existingReaction || !existingReaction.users.includes(safeUserId)) {
      return msg;
    }
    
    // Update reactions, removing the user from this emoji's users
    const updatedReactions = existingReactions
      .map(r => {
        if (r.emoji !== emoji) return r;
        
        const updatedUsers = r.users.filter(id => id !== safeUserId);
        
        // If no users left, remove this reaction entirely
        if (updatedUsers.length === 0) return null;
        
        return { 
          ...r, 
          count: r.count - 1, 
          users: updatedUsers 
        };
      })
      .filter(Boolean) as typeof existingReactions; // Remove null entries
    
    return { ...msg, reactions: updatedReactions };
  });
};

/**
 * Get a count of reactions by emoji across all messages
 */
export const getReactionCounts = (messages: ChatMessage[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  messages.forEach(msg => {
    if (!msg.reactions) return;
    
    msg.reactions.forEach(reaction => {
      if (!counts[reaction.emoji]) {
        counts[reaction.emoji] = 0;
      }
      
      counts[reaction.emoji] += reaction.count;
    });
  });
  
  return counts;
};

/**
 * Check if the current user has reacted with a specific emoji to a message
 */
export const hasUserReacted = (
  message: ChatMessage,
  emoji: string,
  userId: string | null
): boolean => {
  if (!message.reactions) return false;
  
  const reaction = message.reactions.find(r => r.emoji === emoji);
  if (!reaction) return false;
  
  return reaction.users.includes(userId || 'anonymous');
};
