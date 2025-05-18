
import { useState, useCallback } from "react";
import { ChatMessage } from "@/components/chat/types";
import { addReactionToMessage, removeReactionFromMessage } from "@/components/chat/utils/reactionUtils";

export const useMessageReactions = (initialMessages: ChatMessage[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  // Handle reaction add
  const handleReactionAdd = useCallback((messageId: string, emoji: string, userId: string = "current-user") => {
    console.log("Adding reaction:", emoji, "to message:", messageId);
    setMessages(prevMessages => {
      const updatedMessages = addReactionToMessage(prevMessages, messageId, emoji, userId);
      console.log("Updated messages after adding reaction:", updatedMessages);
      return updatedMessages;
    });
  }, []);
  
  // Handle reaction remove
  const handleReactionRemove = useCallback((messageId: string, emoji: string, userId: string = "current-user") => {
    console.log("Removing reaction:", emoji, "from message:", messageId);
    setMessages(prevMessages => {
      const updatedMessages = removeReactionFromMessage(prevMessages, messageId, emoji, userId);
      console.log("Updated messages after removing reaction:", updatedMessages);
      return updatedMessages;
    });
  }, []);

  return {
    messages,
    setMessages,
    handleReactionAdd,
    handleReactionRemove
  };
};
