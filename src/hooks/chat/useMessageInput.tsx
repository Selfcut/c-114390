
import { useState } from "react";

export const useMessageInput = () => {
  const [message, setMessage] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, sendMessage: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    
    if (e.key === "Escape") {
      if (editingMessageId) {
        setEditingMessageId(null);
        setMessage("");
      }
      
      if (replyingToMessage) {
        setReplyingToMessage(null);
      }
    }
  };

  // Clear input state after sending
  const clearInputState = () => {
    setMessage("");
    setEditingMessageId(null);
    setReplyingToMessage(null);
  };

  return {
    message,
    setMessage,
    editingMessageId,
    setEditingMessageId,
    replyingToMessage,
    setReplyingToMessage,
    handleKeyDown,
    clearInputState
  };
};
