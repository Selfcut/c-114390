
import { useState } from "react";
import { ChatMessage } from "../types";
import { addReactionToMessage, removeReactionFromMessage } from "../utils/reactionUtils";

export const useMessageReactions = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const handleReactionAdd = (messageId: string, emoji: string, userId: string | null) => {
    setMessages(prev => addReactionToMessage(prev, messageId, emoji, userId));
  };
  
  const handleReactionRemove = (messageId: string, emoji: string, userId: string | null) => {
    setMessages(prev => removeReactionFromMessage(prev, messageId, emoji, userId));
  };
  
  return {
    messages,
    setMessages,
    handleReactionAdd,
    handleReactionRemove
  };
};
