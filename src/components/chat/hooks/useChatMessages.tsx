
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ChatMessage } from "../types";
import { toast } from "sonner";

// Define an interface for the database message shape
export interface DbChatMessage {
  id: string;
  content: string;
  created_at: string;
  conversation_id: string;
  user_id?: string;
  sender_name?: string;
  is_admin?: boolean;
  effect_type?: string;
  reply_to?: string;
}

export const useChatMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch messages function
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
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
        effectType: msg.effect_type
      })) || [];
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Add a message to the state
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  return { 
    messages,
    setMessages,
    isLoadingMessages,
    fetchMessages,
    addMessage
  };
};
