
import { useState, useCallback } from "react";
import { ChatMessage } from "@/components/chat/types";
import { addReactionToMessage, removeReactionFromMessage } from "@/components/chat/utils/reactionUtils";

export const useMessageReactions = (initialMessages: ChatMessage[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  // Handle reaction add
  const handleReactionAdd = useCallback((messageId: string, emoji: string, userId: string = "current-user") => {
    setMessages(prev => addReactionToMessage(prev, messageId, emoji, userId));
  }, []);
  
  // Handle reaction remove
  const handleReactionRemove = useCallback((messageId: string, emoji: string, userId: string = "current-user") => {
    setMessages(prev => removeReactionFromMessage(prev, messageId, emoji, userId));
  }, []);

  return {
    messages,
    setMessages,
    handleReactionAdd,
    handleReactionRemove
  };
};
