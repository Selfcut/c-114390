
import { useState } from "react";
import { ChatMessage } from "@/components/chat/types";
import { useConversations } from "./chat/useConversations";
import { useMessageInput } from "./chat/useMessageInput";
import { useMessageHandlers } from "./chat/useMessageHandlers";
import { useMessageReactions } from "./chat/useMessageReactions";
import { useMessageUtils } from "./chat/useMessageUtils";

// Initial messages for the first conversation
const initialMessages: ChatMessage[] = [
  {
    id: "1",
    conversationId: "1",
    content: "Welcome to the Philosophy community! Feel free to ask questions or share insights.",
    senderName: "System",
    userId: "system",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2", 
    conversationId: "1",
    content: "Hello everyone! What major philosophical work has influenced you the most?",
    senderName: "Maria",
    userId: "user-1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    conversationId: "1",
    content: "I'd say Nietzsche's 'Beyond Good and Evil' changed my perspective significantly.",
    senderName: "John",
    userId: "user-2",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "4",
    conversationId: "1",
    content: "@Maria I've been deeply influenced by Eastern philosophy, particularly the Tao Te Ching.",
    senderName: "Alex",
    userId: "user-3",
    createdAt: new Date(Date.now() - 900000).toISOString(),
    mentions: ["Maria"],
  },
  {
    id: "5",
    conversationId: "1",
    content: "![meditation](https://media.tenor.com/YrJDHCj7JFAAAAAd/meditation-meditate.gif)",
    senderName: "Zen",
    userId: "user-4",
    createdAt: new Date(Date.now() - 300000).toISOString(),
  }
];

export const useChatMessages = () => {
  // Use the extracted hooks
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    handleSelectConversation,
    updateConversationLastMessage
  } = useConversations();
  
  const {
    message,
    setMessage,
    editingMessageId,
    setEditingMessageId,
    replyingToMessage,
    setReplyingToMessage,
    handleKeyDown,
    clearInputState
  } = useMessageInput();
  
  const {
    isLoading,
    handleSendMessage: sendMessage,
    handleMessageEdit: editMessage,
    handleMessageDelete,
    handleMessageReply: replyToMessage
  } = useMessageHandlers({
    messages,
    setMessages,
    message,
    clearInputState,
    editingMessageId,
    replyingToMessage,
    selectedConversation,
    updateConversationLastMessage
  });
  
  const { handleReactionAdd, handleReactionRemove } = useMessageReactions(messages);
  const { formatTime } = useMessageUtils();

  // Wrap the original handlers to update input state
  const handleMessageEdit = (messageId: string) => {
    const result = editMessage(messageId);
    if (result) {
      setEditingMessageId(result.messageId);
      setMessage(result.content);
    }
  };
  
  const handleMessageReply = (messageId: string) => {
    const result = replyToMessage(messageId);
    if (result) {
      setReplyingToMessage(result);
    }
  };

  // Handle sending a message (wrapper for handleSendMessage from useMessageHandlers)
  const handleSendMessage = () => {
    sendMessage();
  };

  // Select conversation wrapper
  const handleSelectConversation = (conversationId: string) => {
    const conversation = handleSelectConversation(conversationId);
    
    // In a real app, this would fetch messages for the selected conversation from a database
    // For now, we'll just show some mock messages for the first conversation and empty for others
    if (conversationId === "1") {
      setMessages(initialMessages);
    } else {
      const conversationName = conversation?.name || "conversation";
      setMessages([
        {
          id: crypto.randomUUID(),
          conversationId: conversationId,
          content: `Welcome to the ${conversationName}!`,
          senderName: "System",
          userId: "system",
          createdAt: new Date().toISOString(),
        }
      ]);
    }
    
    // Clear any editing or replying state
    setEditingMessageId(null);
    setReplyingToMessage(null);
  };

  return {
    conversations,
    selectedConversation,
    message,
    setMessage,
    messages,
    isLoading,
    formatTime,
    handleSendMessage,
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e, handleSendMessage),
    handleSelectConversation,
    handleMessageEdit,
    handleMessageDelete,
    handleMessageReply,
    handleReactionAdd,
    handleReactionRemove,
    editingMessageId,
    replyingToMessage
  };
};
