
import { useState } from "react";
import { ChatMessage } from "@/components/chat/types";
import { useConversations } from "./chat/useConversations";
import { useMessageInput } from "./chat/useMessageInput";
import { useMessageHandlers } from "./chat/useMessageHandlers";
import { useMessageReactions } from "./chat/useMessageReactions";
import { useMessageUtils } from "./chat/useMessageUtils";
import { supabase } from "@/integrations/supabase/client";

export const useChatMessages = () => {
  // Use real data from component hook instead of mock data
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    handleSelectConversation: selectConversationFromHook, // Rename to avoid conflict
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
  const fetchMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      // Fetch messages from Supabase
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Convert DB messages to the ChatMessage format
        const formattedMessages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          content: msg.content,
          senderName: msg.sender_name || 'Unknown',
          userId: msg.user_id || 'unknown',
          createdAt: msg.created_at,
          isCurrentUser: false // Will be updated in the component
        }));
        setMessages(formattedMessages);
      } else {
        // If no messages, show a welcome message
        setMessages([{
          id: crypto.randomUUID(),
          conversationId: conversationId,
          content: `Welcome to the conversation!`,
          senderName: "System",
          userId: "system",
          createdAt: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      console.error('Error in fetchMessages:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
  const handleSelectConversation = (conversationId: string) => {
    // Use the renamed function from the hook
    const conversation = selectConversationFromHook(conversationId);
    
    // Fetch real messages for this conversation
    fetchMessages(conversationId);
    
    // Clear any editing or replying state
    setEditingMessageId(null);
    setReplyingToMessage(null);
    
    return conversation;
  };

  return {
    conversations,
    selectedConversation,
    message,
    setMessage,
    messages,
    isLoading: isLoading || isSendingMessage,
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
    fetchMessages
  };
};
