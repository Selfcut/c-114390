
import { useState } from "react";
import { ChatMessage } from "@/components/chat/types";

export const useMessageReactions = (initialMessages: ChatMessage[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  // Handle reaction add
  const handleReactionAdd = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.emoji === emoji);
        
        let updatedReactions;
        if (existingReaction) {
          // Update existing reaction if not already reacted by current user
          if (!existingReaction.users.includes("current-user")) {
            updatedReactions = existingReactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, "current-user"] }
                : r
            );
          } else {
            updatedReactions = existingReactions;
          }
        } else {
          // Add new reaction
          updatedReactions = [
            ...existingReactions, 
            { emoji, count: 1, users: ["current-user"] }
          ];
        }
        
        return { ...msg, reactions: updatedReactions };
      })
    );
  };
  
  // Handle reaction remove
  const handleReactionRemove = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.emoji === emoji);
        
        if (!existingReaction || !existingReaction.users.includes("current-user")) {
          return msg;
        }
        
        // Update the reaction by removing the current user
        const updatedReactions = existingReactions
          .map(r => {
            if (r.emoji !== emoji) return r;
            
            const updatedUsers = r.users.filter(userId => userId !== "current-user");
            if (updatedUsers.length === 0) return null; // Remove reaction completely if no users left
            
            return { ...r, count: r.count - 1, users: updatedUsers };
          })
          .filter(Boolean) as typeof existingReactions; // Remove null entries
        
        return { ...msg, reactions: updatedReactions };
      })
    );
  };

  return {
    messages,
    setMessages,
    handleReactionAdd,
    handleReactionRemove
  };
};
