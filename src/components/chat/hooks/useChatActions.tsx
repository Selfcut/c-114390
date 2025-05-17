
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

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
    if (!user) {
      toast.error('You need to be logged in to send messages');
      return;
    }
    
    setIsLoading(true);
    
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
          user_id: user.id,
          sender_name: user.name || user.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global', // For simplicity, using a single global conversation
          is_admin: user.isAdmin || false,
          // Include reply info if applicable
          ...(replyInfo ? { 
            reply_to: replyInfo.id 
          } : {})
        });
      
      if (error) throw error;
      
      if (editingMessageId) {
        setEditingMessageId(null);
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message: ' + (error.message || 'Unknown error'));
      // Return the input message so user doesn't lose their text
      setInputMessage(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle admin effect
  const handleAdminEffectSelect = async (effectType: string, content?: string) => {
    if (!user?.isAdmin) {
      toast.error('Only admins can use special effects');
      return;
    }
    
    const messageContent = content || inputMessage;
    if (!messageContent.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageContent,
          user_id: user.id,
          sender_name: user.name || user.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global',
          is_admin: true,
          effect_type: effectType
        });
      
      if (error) throw error;
      
      // Clear input if we used it
      if (!content) {
        setInputMessage('');
      }
      
      toast.success(`${effectType} effect sent!`);
      
    } catch (error: any) {
      console.error('Error sending admin message:', error);
      toast.error('Failed to send message with effect: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Edit message
  const handleEditMessage = async (messageId: string) => {
    if (!user) {
      toast.error('You need to be logged in to edit messages');
      return;
    }
    
    // First get the content from the message
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content')
        .eq('id', messageId)
        .eq('user_id', user.id) // Only allow users to edit their own messages
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error("You can only edit your own messages");
        } else {
          toast.error('Failed to fetch message content');
        }
        return;
      }
      
      if (data) {
        setEditingMessageId(messageId);
        setInputMessage(data.content);
      }
    } catch (error) {
      console.error('Error fetching message content:', error);
      toast.error('Failed to edit message');
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) {
      toast.error('You need to be logged in to delete messages');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id); // Only allow users to delete their own messages
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error("You can only delete your own messages");
        } else {
          toast.error('Failed to delete message');
        }
        return;
      }
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Reply to message
  const handleReplyToMessage = async (messageId: string) => {
    // Fetch the message details to get content and sender name
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content, sender_name')
        .eq('id', messageId)
        .single();
      
      if (error) {
        toast.error('Failed to fetch message for reply');
        return;
      }
      
      if (data) {
        setReplyingToMessage({
          id: messageId,
          content: data.content,
          senderName: data.sender_name || 'Unknown'
        });
      }
    } catch (error) {
      console.error('Error fetching message for reply:', error);
      toast.error('Failed to reply to message');
    }
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
    
    if (e.key === 'Escape') {
      if (editingMessageId) {
        cancelEdit();
      } else if (replyingToMessage) {
        cancelReply();
      }
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
