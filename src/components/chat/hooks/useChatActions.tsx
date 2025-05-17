
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ChatMessage } from "../types";

export const useChatActions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Send a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Clear input and reply state
    const messageContent = inputMessage;
    setInputMessage('');
    const replyInfo = replyingToMessage;
    setReplyingToMessage(null);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageContent,
          user_id: user?.id,
          sender_name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global', // For simplicity, using a single global conversation
          is_admin: user?.email?.includes('admin') || false,
          // Include reply info if applicable
          ...(replyInfo ? { 
            reply_to: replyInfo.id 
          } : {})
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Handle admin effect
  const handleAdminEffectSelect = async (effectType: string, content?: string) => {
    const messageContent = content || inputMessage;
    if (!messageContent.trim()) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageContent,
          user_id: user?.id,
          sender_name: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global',
          is_admin: true,
          effect_type: effectType
        });
      
      if (error) throw error;
      
      // Clear input if we used it
      if (!content) {
        setInputMessage('');
      }
      
    } catch (error) {
      console.error('Error sending admin message:', error);
      toast.error('Failed to send message with effect');
    }
  };

  // Edit message
  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setInputMessage(currentContent);
  };

  // Delete message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user?.id); // Only allow users to delete their own messages
      
      if (error) throw error;
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Reply to message
  const handleReplyToMessage = (messageId: string, content: string, senderName: string) => {
    setReplyingToMessage({
      id: messageId,
      content,
      senderName
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingMessageId(null);
    setInputMessage('');
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingToMessage(null);
  };

  // Handle key down event for message input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
