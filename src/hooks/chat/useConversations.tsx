import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/components/chat/types';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        // Map the data to match our Conversation type
        const mappedConversations: Conversation[] = data.map(item => ({
          id: item.id,
          name: item.name,
          lastMessage: item.last_message,
          updatedAt: item.updated_at,
          createdAt: item.created_at,
          isGlobal: item.is_global,
          isGroup: item.is_group,
          participants: [], // We'll need to fetch these separately if needed
          messages: []      // We'll need to fetch these separately if needed
        }));

        setConversations(mappedConversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Set up real-time subscription
    const channelA = supabase.channel('public:conversations');

    channelA
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, (payload) => {
        const newConversation: Conversation = {
          id: payload.new.id,
          name: payload.new.name,
          lastMessage: payload.new.last_message,
          updatedAt: payload.new.updated_at,
          createdAt: payload.new.created_at,
          isGlobal: payload.new.is_global,
          isGroup: payload.new.is_group,
          participants: [],
          messages: []
        };
        
        setConversations(prev => [newConversation, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, (payload) => {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === payload.new.id 
              ? {
                  ...conv,
                  name: payload.new.name,
                  lastMessage: payload.new.last_message,
                  updatedAt: payload.new.updated_at,
                  isGlobal: payload.new.is_global,
                  isGroup: payload.new.is_group
                } 
              : conv
          )
        );
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'conversations' }, (payload) => {
        setConversations(prev => 
          prev.filter(conv => conv.id !== payload.old.id)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelA);
    };
  }, []);

  return { conversations, isLoading, error };
};
