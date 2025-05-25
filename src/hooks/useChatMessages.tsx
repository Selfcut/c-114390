
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ChatMessage } from "@/components/chat/types";

// Define the DB message type and export it
export interface DbChatMessage {
  id: string;
  content: string;
  user_id: string | null;
  sender_name: string | null;
  created_at: string;
  conversation_id: string;
  is_admin?: boolean;
  effect_type?: string;
  reply_to?: string;
}

export const useChatMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Subscribe to new messages when the component mounts
  useEffect(() => {
    const subscription = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
      }, (payload) => {
        const newMessage = payload.new as DbChatMessage;
        
        const formattedMessage: ChatMessage = {
          id: newMessage.id,
          content: newMessage.content,
          createdAt: newMessage.created_at,
          conversationId: newMessage.conversation_id || 'global',
          userId: newMessage.user_id || 'anonymous',
          senderName: newMessage.sender_name || 'Anonymous',
          isCurrentUser: newMessage.user_id === user?.id,
          isAdmin: newMessage.is_admin || false,
          effectType: newMessage.effect_type,
        };
        
        addMessage(formattedMessage);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

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
        effectType: msg.effect_type
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
  const sendMessage = useCallback(async (
    content: string, 
    conversationId: string = 'global',
    replyTo?: string
  ) => {
    if (!content.trim()) return null;
    if (!user) {
      toast.error('You need to be logged in to send messages');
      return null;
    }

    try {
      const newMessage = {
        content,
        conversation_id: conversationId,
        user_id: user.id,
        sender_name: user.name || user.email?.split('@')[0] || 'Anonymous',
        is_admin: user.isAdmin || false,
        ...(replyTo ? { reply_to: replyTo } : {})
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
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
    sendMessage,
    addMessage
  };
};
