
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageReply } from './types/chatMessageTypes';

export const useMessageOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchMessageForEdit = useCallback(async (
    messageId: string,
    setEditingMessageId: (id: string | null) => void,
    setInputMessage: (message: string) => void
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content')
        .eq('id', messageId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setEditingMessageId(messageId);
        setInputMessage(data.content);
      }
    } catch (error) {
      console.error('Error fetching message for edit:', error);
      toast.error('Failed to edit message');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const deleteMessage = useCallback(async (messageId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchMessageForReply = useCallback(async (
    messageId: string,
    setReplyingToMessage: (message: MessageReply | null) => void
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, content, sender_name')
        .eq('id', messageId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setReplyingToMessage({
          id: data.id,
          content: data.content,
          senderName: data.sender_name || 'Anonymous'
        });
      }
    } catch (error) {
      console.error('Error fetching message for reply:', error);
      toast.error('Failed to reply to message');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // New functions for handling message reactions
  const addReaction = useCallback(async (messageId: string, emoji: string, userId: string) => {
    setIsLoading(true);
    try {
      // Use the raw supabase client with generic types for the new table
      const { data: existingReaction, error: checkError } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If the reaction doesn't exist, add it
      if (!existingReaction) {
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: userId,
            emoji: emoji
          });
        
        if (error) throw error;
        
        // Update the reactions count on the message using RPC
        await incrementReactionCount(messageId);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const removeReaction = useCallback(async (messageId: string, emoji: string, userId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);
      
      if (error) throw error;
      
      // Update the reactions count on the message
      await decrementReactionCount(messageId);
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const incrementReactionCount = async (messageId: string) => {
    try {
      // Use the RPC function we created in the SQL migration
      await supabase.rpc('increment_counter', {
        row_id: messageId,
        column_name: 'reactions_count',
        table_name: 'chat_messages'
      });
    } catch (error) {
      console.error('Error incrementing reaction count:', error);
    }
  };
  
  const decrementReactionCount = async (messageId: string) => {
    try {
      // Use the RPC function we created in the SQL migration
      await supabase.rpc('decrement_counter', {
        row_id: messageId,
        column_name: 'reactions_count',
        table_name: 'chat_messages'
      });
    } catch (error) {
      console.error('Error decrementing reaction count:', error);
    }
  };
  
  return {
    isLoading,
    fetchMessageForEdit,
    deleteMessage,
    fetchMessageForReply,
    addReaction,
    removeReaction
  };
};
