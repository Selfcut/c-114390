
import React from "react";

/**
 * Hook for handling keyboard events in the chat interface
 */
export const useKeyboardHandlers = (
  handleSendMessage: () => void,
  editingMessageId: string | null,
  replyingToMessage: any | null,
  cancelEdit: () => void,
  cancelReply: () => void
) => {
  // Handle key down event for message input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    if (e.key === 'Escape') {
      if (editingMessageId) {
        cancelEdit();
      } else if (replyingToMessage) {
        cancelReply();
      }
    }
  };

  return { handleKeyDown };
};
