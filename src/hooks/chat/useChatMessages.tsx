
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/components/chat/types';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    
    setIsLoadingMessages(true);
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      // Transform data to match ChatMessage type
      const formattedMessages: ChatMessage[] = data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        conversationId: msg.conversation_id,
        userId: msg.user_id,
        senderName: msg.sender_name || 'Anonymous',
        createdAt: msg.created_at,
        isCurrentUser: false, // This will be set properly in the component
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);
  
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  return { messages, isLoadingMessages, addMessage, fetchMessages, setMessages };
};
