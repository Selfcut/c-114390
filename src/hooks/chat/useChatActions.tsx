
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const useChatActions = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);
  const { user } = useAuth();
  
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !user) return;
    
    setIsLoading(true);
    
    const newMessage = {
      content: inputMessage,
      conversation_id: 'global', // Default to global conversation
      user_id: user.id,
      sender_name: user.name || user.username || 'Anonymous',
      created_at: new Date().toISOString(),
    };
    
    if (editingMessageId) {
      // Update message
      const { error } = await supabase
        .from('chat_messages')
        .update({ content: inputMessage })
        .eq('id', editingMessageId);
        
      if (error) {
        console.error('Error updating message:', error);
      } else {
        setEditingMessageId(null);
      }
    } else {
      // Add reply information if replying to a message
      if (replyingToMessage) {
        newMessage.content = `@${replyingToMessage.senderName} ${newMessage.content}`;
        // In a real implementation, we'd store reply metadata in a separate field
      }
      
      // Insert new message
      const { error } = await supabase
        .from('chat_messages')
        .insert(newMessage);
        
      if (error) {
        console.error('Error sending message:', error);
      } else {
        setReplyingToMessage(null);
      }
    }
    
    setInputMessage('');
    setIsLoading(false);
  }, [inputMessage, user, editingMessageId, replyingToMessage]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  const handleEditMessage = useCallback((messageId: string) => {
    setEditingMessageId(messageId);
    // In a real implementation, you'd fetch the message content here
    // For now, we'll just set a placeholder
    setInputMessage('Edit message');
  }, []);
  
  const handleDeleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);
      
    if (error) {
      console.error('Error deleting message:', error);
    }
  }, [user]);
  
  const handleReplyToMessage = useCallback((messageId: string) => {
    setReplyingToMessage({
      id: messageId,
      content: 'Reply to message', // Placeholder
      senderName: 'User' // Placeholder
    });
  }, []);
  
  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setInputMessage('');
  }, []);
  
  const cancelReply = useCallback(() => {
    setReplyingToMessage(null);
  }, []);
  
  const handleAdminEffectSelect = useCallback((effectType: string, content?: string) => {
    if (content) {
      setInputMessage(`[${effectType}] ${content}`);
    } else {
      setInputMessage(prev => `[${effectType}] ${prev}`);
    }
  }, []);

  return {
    inputMessage,
    setInputMessage,
    isLoading,
    editingMessageId,
    replyingToMessage,
    handleSendMessage,
    handleKeyDown,
    handleEditMessage,
    handleDeleteMessage,
    handleReplyToMessage,
    handleAdminEffectSelect,
    cancelEdit,
    cancelReply
  };
};
