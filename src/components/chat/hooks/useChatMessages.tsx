
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ChatMessage } from "../types";
import { toast } from "sonner";

// Define the DB message type locally
interface DbChatMessage {
  id: string;
  content: string;
  user_id: string | null;
  sender_name: string | null;
  created_at: string;
  conversation_id: string;
  reactions_count?: number;
}

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
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      const formattedMessages: ChatMessage[] = data?.map((msg: DbChatMessage) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        conversationId: msg.conversation_id || 'global',
        userId: msg.user_id || 'anonymous',
        senderName: msg.sender_name || 'Anonymous',
        isCurrentUser: msg.user_id === user?.id,
        isAdmin: false,
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

  // Send a message
  const sendMessage = useCallback(async (content: string, conversationId: string = 'global', replyToId?: string) => {
    if (!user) {
      toast.error('You must be logged in to send messages');
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          user_id: user.id,
          sender_name: user.name || user.username || 'Anonymous',
          conversation_id: conversationId,
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      // Refresh messages after sending
      await fetchMessages(conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, [user, fetchMessages]);

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
    addMessage,
    sendMessage
  };
};
