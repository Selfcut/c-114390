
import { useState } from "react";
import { MessageReply } from "./types/chatMessageTypes";

/**
 * Hook for managing the message input state, editing state, and reply state
 */
export const useMessageState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<MessageReply | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Cancel edit
  const cancelEdit = () => {
    setEditingMessageId(null);
    setInputMessage('');
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingToMessage(null);
  };

  return {
    isLoading,
    setIsLoading,
    inputMessage,
    setInputMessage,
    replyingToMessage,
    setReplyingToMessage,
    editingMessageId,
    setEditingMessageId,
    cancelEdit,
    cancelReply
  };
};
