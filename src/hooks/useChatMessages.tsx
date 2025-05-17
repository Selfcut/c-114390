
import { useState, useCallback } from "react";
import { ChatMessage } from "@/components/chat/types";
import { useConversations } from "./chat/useConversations";
import { useMessageInput } from "./chat/useMessageInput";
import { useMessageHandlers } from "./chat/useMessageHandlers";
import { useMessageReactions } from "./chat/useMessageReactions";
import { useMessageUtils } from "./chat/useMessageUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define an interface for the database message shape that matches the Supabase schema
export interface DbChatMessage {
  id: string;
  content: string;
  created_at: string;
  conversation_id: string;
  user_id?: string;
  sender_name?: string;
  is_admin?: boolean;
  effect_type?: string;
  reply_to?: string;
  updated_at?: string;
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    handleSelectConversation: selectConversationFromHook,
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
    isLoading: isSendingMessage,
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

  // Function to fetch messages from the database
  const fetchMessages = useCallback(async (conversationId: string = 'global') => {
    setIsLoadingMessages(true);
    try {
      // Fetch messages from Supabase
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Could not load messages');
        return;
      }
      
      if (data && data.length > 0) {
        // Convert DB messages to the ChatMessage format
        const formattedMessages: ChatMessage[] = data.map((msg: DbChatMessage) => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          content: msg.content,
          senderName: msg.sender_name || 'Unknown',
          userId: msg.user_id || 'unknown',
          createdAt: msg.created_at,
          isCurrentUser: false, // Will be updated in the component
          // Handle potentially missing properties
          isAdmin: msg.is_admin || false,
          effectType: msg.effect_type || undefined
        }));
        setMessages(formattedMessages);
      } else {
        // If no messages, show an empty state
        setMessages([]);
      }
    } catch (err) {
      console.error('Error in fetchMessages:', err);
      toast.error('Could not load messages');
    } finally {
      setIsLoadingMessages(false);
      setIsLoading(false);
    }
  }, []);

  // Add a message to the state - needed by FullHeightChatSidebar for real-time updates
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      if (prev.some(msg => msg.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

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

  // Handle sending a message
  const handleSendMessage = () => {
    sendMessage();
  };

  // Select conversation wrapper
  const handleSelectConversation = useCallback((conversationId: string) => {
    // Use the renamed function from the hook
    const conversation = selectConversationFromHook(conversationId);
    
    // Fetch real messages for this conversation
    fetchMessages(conversationId);
    
    // Clear any editing or replying state
    setEditingMessageId(null);
    setReplyingToMessage(null);
    
    return conversation;
  }, [selectConversationFromHook, fetchMessages, setEditingMessageId, setReplyingToMessage]);

  return {
    conversations,
    selectedConversation,
    message,
    setMessage,
    messages,
    setMessages,
    isLoading: isLoading || isSendingMessage,
    isLoadingMessages,
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
    replyingToMessage,
    fetchMessages,
    addMessage
  };
};
