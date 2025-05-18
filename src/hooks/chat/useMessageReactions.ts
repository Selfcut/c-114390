
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export type Reaction = {
  emoji: string;
  count: number;
  userReacted: boolean;
};

export type MessageReactions = {
  [emoji: string]: Reaction;
};

export const useMessageReactions = (messageId: string) => {
  const [reactions, setReactions] = useState<MessageReactions>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Fetch all reactions for a message
  const fetchReactions = useCallback(async () => {
    if (!messageId) return;
    
    setIsLoading(true);
    try {
      // Use generic query instead of typed query
      const { data, error } = await supabase
        .from('message_reactions')
        .select('emoji, user_id')
        .eq('message_id', messageId);
        
      if (error) throw error;
      
      // Process reactions data
      const reactionCounts: Record<string, number> = {};
      const userReactions: Record<string, boolean> = {};
      
      if (data) {
        data.forEach(reaction => {
          // Count occurrences of each emoji
          const emoji = reaction.emoji as string;
          reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
          
          // Check if current user reacted
          if (user && reaction.user_id === user.id) {
            userReactions[emoji] = true;
          }
        });
      }
      
      // Format reactions for the state
      const formattedReactions: MessageReactions = {};
      Object.keys(reactionCounts).forEach(emoji => {
        formattedReactions[emoji] = {
          emoji,
          count: reactionCounts[emoji],
          userReacted: !!userReactions[emoji]
        };
      });
      
      setReactions(formattedReactions);
    } catch (error) {
      console.error('Error fetching message reactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messageId, user]);

  // Toggle a reaction
  const toggleReaction = useCallback(async (emoji: string) => {
    if (!user) {
      toast.error('You need to be signed in to react to messages');
      return;
    }
    
    if (!messageId) return;
    
    try {
      // Check if user already reacted with this emoji
      const userReacted = reactions[emoji]?.userReacted;
      
      if (userReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id)
          .eq('emoji', emoji);
          
        if (error) throw error;

        // Call the counter function to update reactions_count
        await supabase.rpc('decrement_counter', {
          row_id: messageId,
          column_name: 'reactions_count',
          table_name: 'chat_messages'
        });
        
        // Update local state
        setReactions(prev => {
          const updated = { ...prev };
          if (updated[emoji]) {
            if (updated[emoji].count <= 1) {
              delete updated[emoji];
            } else {
              updated[emoji] = {
                ...updated[emoji],
                count: updated[emoji].count - 1,
                userReacted: false
              };
            }
          }
          return updated;
        });
      } else {
        // Add reaction
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            emoji: emoji
          });
          
        if (error) throw error;
        
        // Call the counter function to update reactions_count
        await supabase.rpc('increment_counter', {
          row_id: messageId,
          column_name: 'reactions_count',
          table_name: 'chat_messages'
        });
        
        // Update local state
        setReactions(prev => {
          const updated = { ...prev };
          if (updated[emoji]) {
            updated[emoji] = {
              ...updated[emoji],
              count: updated[emoji].count + 1,
              userReacted: true
            };
          } else {
            updated[emoji] = {
              emoji,
              count: 1,
              userReacted: true
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
    }
  }, [messageId, reactions, user]);

  // Subscribe to real-time changes for reactions
  useEffect(() => {
    if (!messageId) return;
    
    // Initial fetch
    fetchReactions();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel(`message-reactions-${messageId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'message_reactions',
        filter: `message_id=eq.${messageId}`
      }, () => {
        // Refetch the reactions when there's a change
        fetchReactions();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId, fetchReactions]);

  return {
    reactions,
    isLoading,
    toggleReaction
  };
};
