
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth"; 
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { ChatMessage, ConversationItem } from "../types";
import { useChatMessages } from "@/hooks/chat/useChatMessages";
import { useChatActions } from "@/hooks/chat/useChatActions";
import { useSpecialEffects } from "@/hooks/chat/useSpecialEffects";
import { useMessageUtils } from "@/hooks/chat/useMessageUtils";
import { useRealtimeChatSubscription } from "@/hooks/chat/useRealtimeChatSubscription";
import { useAutomatedMessages } from "@/hooks/chat/useAutomatedMessages";

export interface UseChatSidebarStateProps {
  isOpen: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  user?: any;
}

// Implementation of the hook
export const useChatSidebarState = ({ 
  isOpen,
  messagesEndRef
}: UseChatSidebarStateProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminStatus();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>("global");

  // Use the chat messages hook for loading messages
  const {
    messages,
    isLoadingMessages,
    addMessage,
    fetchMessages
  } = useChatMessages();

  // Fetch conversations from Supabase
  useEffect(() => {
    if (!isOpen) return;

    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedConversations: ConversationItem[] = data.map(conv => ({
            id: conv.id,
            name: conv.name,
            lastMessage: conv.last_message || '',
            lastActivityAt: conv.updated_at || new Date().toISOString(),
            unreadCount: 0, // We'll implement unread counts separately
            isGlobal: conv.is_global || false,
            isGroup: conv.is_group || false,
            updatedAt: conv.updated_at || new Date().toISOString()
          }));

          setConversations(formattedConversations);
          
          // If no conversations exist, create a global one
          if (formattedConversations.length === 0) {
            createGlobalConversation();
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [isOpen]);

  // Create a global conversation if none exist
  const createGlobalConversation = async () => {
    try {
      const { error } = await supabase
        .from('conversations')
        .insert({
          id: 'global',
          name: 'Global Chat',
          is_global: true,
          is_group: true,
          last_message: 'Welcome to the community!',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Add the global conversation to state
      setConversations([{
        id: 'global',
        name: 'Global Chat',
        lastMessage: 'Welcome to the community!',
        lastActivityAt: new Date().toISOString(),
        unreadCount: 0,
        isGlobal: true,
        isGroup: true,
        updatedAt: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error creating global conversation:', error);
    }
  };

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
  };
  
  const handleReactionRemove = (messageId: string, emoji: string) => {
    console.log(`Removing reaction ${emoji} from message ${messageId}`);
    // Implement reaction remove functionality
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark conversation as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
    
    // Fetch messages for this conversation
    fetchMessages(conversationId);
  };

  // Update conversation's last message
  const updateConversationLastMessage = async (conversationId: string, message: string) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('conversations')
        .update({
          last_message: message,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
        
      if (error) throw error;
        
      // Update locally
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, lastMessage: message, lastActivityAt: new Date().toISOString(), updatedAt: new Date().toISOString() } 
            : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  return {
    isAdmin,
    conversations,
    selectedConversation,
    messages,
    isLoadingMessages,
    isLoading: isLoadingMessages || isSendingMessage || isLoadingConversations,
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
    onSelectConversation: handleSelectConversation,
    updateConversationLastMessage
  };
};
