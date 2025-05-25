
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ChatMessage } from "../types";
import { toast } from "sonner";
import { DbChatMessage } from "@/hooks/useChatMessages";

export const useChatMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch messages function
  const fetchMessages = useCallback(async (conversationId: string = 'global') => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = data?.map((msg: DbChatMessage) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        conversationId: msg.conversation_id || 'global',
        userId: msg.user_id || 'anonymous',
        senderName: msg.sender_name || 'Anonymous',
        isCurrentUser: msg.user_id === user?.id,
        isAdmin: msg.is_admin || false,
        effectType: msg.effect_type,
        reactions: []
      })) || [];
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user]);

  // Add a message to the state
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      if (prev.some(msg => msg.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  return { 
    messages,
    setMessages,
    isLoadingMessages,
    fetchMessages,
    addMessage
  };
};
