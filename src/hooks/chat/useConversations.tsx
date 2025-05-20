import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/components/chat/types';
import { useAuth } from '@/lib/auth';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;

        // Transform data to match Conversation type
        const formattedConversations: Conversation[] = data.map(conv => ({
          id: conv.id,
          name: conv.name,
          lastMessage: conv.last_message,
          updatedAt: conv.updated_at,
          isGlobal: conv.is_global,
          isGroup: conv.is_group,
          createdAt: conv.created_at
        }));

        setConversations(formattedConversations);
        
        // Set first conversation as active if none selected
        if (!activeConversationId && formattedConversations.length > 0) {
          setActiveConversationId(formattedConversations[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user, activeConversationId]);

  const createConversation = async (name: string, isGroup: boolean = false) => {
    if (!user) return null;
    
    try {
      const newConversation = {
        id: `conv-${Date.now()}`,
        name,
        isGroup,
        // No longer including participants property since it's not in the type
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in database...
      
      setConversations(prev => [newConversation, ...prev]);
      return newConversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const updateConversation = async (conversationId: string, updates: Partial<Conversation>) => {
    try {
      // Update in database...
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, ...updates } : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      // Delete from database...
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return {
    conversations,
    isLoading,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    updateConversation,
    deleteConversation
  };
};
