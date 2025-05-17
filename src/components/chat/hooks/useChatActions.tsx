
import { useMessageState } from "./useMessageState";
import { useMessageSender } from "./useMessageSender";
import { useMessageOperations } from "./useMessageOperations";
import { useKeyboardHandlers } from "./useKeyboardHandlers";
import { AdminEffect } from "./types/chatMessageTypes";

export const useChatActions = () => {
  const {
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
  } = useMessageState();

  const { sendMessage, sendAdminEffect } = useMessageSender();
  const { fetchMessageForEdit, deleteMessage, fetchMessageForReply } = useMessageOperations();

  // Send a message
  const handleSendMessage = async () => {
    await sendMessage(
      inputMessage,
      replyingToMessage,
      setIsLoading,
      setInputMessage,
      setEditingMessageId,
      editingMessageId
    );
    setInputMessage('');
    setReplyingToMessage(null);
  };

  // Handle admin effect
  const handleAdminEffectSelect = async (effectType: string, content?: string) => {
    await sendAdminEffect(
      effectType,
      content || inputMessage,
      setIsLoading,
      setInputMessage
    );
  };

  // Edit message
  const handleEditMessage = async (messageId: string) => {
    await fetchMessageForEdit(messageId, setEditingMessageId, setInputMessage);
  };

  // Delete message
  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  // Reply to message
  const handleReplyToMessage = async (messageId: string) => {
    await fetchMessageForReply(messageId, setReplyingToMessage);
  };

  // Keyboard handlers
  const { handleKeyDown } = useKeyboardHandlers(
    handleSendMessage,
    editingMessageId,
    replyingToMessage,
    cancelEdit,
    cancelReply
  );

  return {
    isLoading,
    inputMessage,
    setInputMessage,
    replyingToMessage,
    editingMessageId,
    handleSendMessage,
    handleAdminEffectSelect,
    handleEditMessage,
    handleDeleteMessage,
    handleReplyToMessage,
    cancelEdit,
    cancelReply,
    handleKeyDown
  };
};
