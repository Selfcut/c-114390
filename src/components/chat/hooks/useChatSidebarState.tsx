
import { useState, useEffect } from "react";
import { useAdminStatus } from "./useAdminStatus";
import { useChatMessages } from "./useChatMessages";
import { useSpecialEffects } from "./useSpecialEffects";
import { useRealtimeChatSubscription } from "./useRealtimeChatSubscription";
import { useAutomatedMessages } from "./useAutomatedMessages";
import { useChatActions } from "./useChatActions";
import { ConversationItem } from "../types";
import { useMessageUtils } from "@/hooks/chat/useMessageUtils";

interface UseChatSidebarStateProps {
  user: any;
  isOpen: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const useChatSidebarState = ({ 
  user, 
  isOpen,
  messagesEndRef
}: UseChatSidebarStateProps) => {
  const { isAdmin } = useAdminStatus();
  
  // Mock conversations for demo - ensure all have the required updatedAt property
  const [conversations, setConversations] = useState<ConversationItem[]>([
    { id: 'global', name: 'Global Chat', lastMessage: 'Welcome to the community!', unread: 2, updatedAt: new Date().toISOString() },
    { id: 'philosophy', name: 'Philosophy', lastMessage: 'What is consciousness?', unread: 0, updatedAt: new Date().toISOString() },
    { id: 'science', name: 'Science', lastMessage: 'New discoveries in quantum physics', unread: 3, updatedAt: new Date().toISOString() },
    { id: 'art', name: 'Art & Literature', lastMessage: 'Discussing modern art movements', unread: 1, updatedAt: new Date().toISOString() }
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState<string>("global");
  
  // Use the chat messages hook for loading messages
  const {
    messages,
    isLoadingMessages,
    addMessage,
    fetchMessages
  } = useChatMessages();

  // Use chat actions for message operations
  const {
    isLoading: isSendingMessage,
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
  } = useChatActions();
  
  const { handleSpecialEffect } = useSpecialEffects();
  const { formatTime } = useMessageUtils();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Use our custom hooks for realtime functionality
  useRealtimeChatSubscription({ 
    isOpen, 
    addMessage, 
    scrollToBottom, 
    handleSpecialEffect 
  });
  
  useAutomatedMessages({ 
    isActive: isOpen, 
    maxMessages: 5
  });

  // Fetch messages when the sidebar is opened or conversation changes
  useEffect(() => {
    if (isOpen) {
      fetchMessages(selectedConversation);
    }
  }, [isOpen, fetchMessages, selectedConversation]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  // Handle GIF selection
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(prev => prev + " " + gifMarkdown);
  };

  // Handle reaction operations
  const handleReactionAdd = (messageId: string, emoji: string) => {
    console.log(`Adding reaction ${emoji} to message ${messageId}`);
    // Implement reaction add functionality
    // In a real app, this would call to a backend API
  };
  
  const handleReactionRemove = (messageId: string, emoji: string) => {
    console.log(`Removing reaction ${emoji} from message ${messageId}`);
    // Implement reaction remove functionality
    // In a real app, this would call to a backend API
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark conversation as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
    
    // Fetch messages for this conversation
    fetchMessages(conversationId);
  };

  return {
    isAdmin,
    conversations,
    selectedConversation,
    messages,
    isLoadingMessages,
    isLoading: isLoadingMessages || isSendingMessage,
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
    handleKeyDown,
    handleEmojiSelect,
    handleGifSelect,
    handleReactionAdd,
    handleReactionRemove,
    formatTime,
    onMessageEdit: handleEditMessage,
    onMessageDelete: handleDeleteMessage,
    onMessageReply: handleReplyToMessage,
    onReactionAdd: handleReactionAdd,
    onReactionRemove: handleReactionRemove,
    onCancelEdit: cancelEdit,
    onCancelReply: cancelReply,
    onEmojiSelect: handleEmojiSelect,
    onGifSelect: handleGifSelect,
    onAdminEffectSelect: handleAdminEffectSelect,
    onSelectConversation: handleSelectConversation
  };
};
