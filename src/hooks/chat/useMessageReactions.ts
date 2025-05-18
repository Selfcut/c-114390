
import { useState, useCallback } from "react";
import { ChatMessage } from "@/components/chat/types";
import { 
  addReactionToMessage, 
  removeReactionFromMessage, 
  hasUserReacted 
} from "@/components/chat/utils/reactionUtils";

export const useMessageReactions = (initialMessages: ChatMessage[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  const handleReactionAdd = useCallback((messageId: string, emoji: string, userId: string | null) => {
    setMessages(prev => addReactionToMessage(prev, messageId, emoji, userId));
  }, []);
  
  const handleReactionRemove = useCallback((messageId: string, emoji: string, userId: string | null) => {
    setMessages(prev => removeReactionFromMessage(prev, messageId, emoji, userId));
  }, []);
  
  const checkUserReaction = useCallback((messageId: string, emoji: string, userId: string | null): boolean => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return false;
    
    return hasUserReacted(message, emoji, userId);
  }, [messages]);
  
  return {
    messages,
    setMessages,
    handleReactionAdd,
    handleReactionRemove,
    checkUserReaction
  };
};
