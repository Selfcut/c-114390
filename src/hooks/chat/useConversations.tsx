import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationItem, Conversation } from "@/components/chat/types";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>("global");
  const { user } = useAuth();

  // Fetch conversations from Supabase
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedConversations: Conversation[] = data.map(conv => ({
          id: conv.id,
          name: conv.name,
          lastMessage: conv.last_message || '',
          updatedAt: conv.updated_at,
          isGlobal: conv.is_global || false,
          isGroup: conv.is_group || false,
          unread: 0 // We'll implement unread counts later
        }));

        setConversations(formattedConversations);
        
        // Make sure we have at least a global conversation
        if (formattedConversations.length === 0) {
          createGlobalConversation();
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a global conversation if none exists
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
        isGlobal: true,
        isGroup: true,
        updatedAt: new Date().toISOString(),
        unread: 0
      }]);
      
      setSelectedConversation('global');
    } catch (error) {
      console.error('Error creating global conversation:', error);
    }
  };
  
  // Create a new chat room
  const createChatRoom = async (name: string): Promise<string | null> => {
    if (!name.trim()) {
      toast.error('Please provide a room name');
      return null;
    }
    
    if (!user) {
      toast.error("You need to be logged in to create a chat room");
      return null;
    }

    try {
      // Generate a unique ID for the conversation
      const roomId = crypto.randomUUID();
      
      // Create a new conversation in Supabase
      const { error } = await supabase
        .from('conversations')
        .insert({
          id: roomId,
          name: name.trim(),
          is_global: false,
          is_group: true,
          last_message: `${user.name || 'Someone'} created this chat room`,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update the local state with the new conversation
      const newConversation: Conversation = {
        id: roomId,
        name: name.trim(),
        lastMessage: `${user.name || 'Someone'} created this chat room`,
        isGlobal: false,
        isGroup: true,
        updatedAt: new Date().toISOString(),
        unread: 0
      };
      
      setConversations(prev => [newConversation, ...prev]);
      
      // Return the new room ID
      return roomId;
    } catch (error: any) {
      console.error('Error creating chat room:', error);
      toast.error('Failed to create chat room: ' + (error.message || 'Unknown error'));
      return null;
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark conversation as read in the state
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
    
    return conversations.find(c => c.id === conversationId);
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
            ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() } 
            : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  // Load conversations when component mounts
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    handleSelectConversation,
    updateConversationLastMessage,
    createChatRoom,
    isLoading,
    refetchConversations: fetchConversations
  };
};
