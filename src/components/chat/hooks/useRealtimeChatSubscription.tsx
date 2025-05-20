
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/components/chat/types';

interface UseRealtimeChatSubscriptionProps {
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  scrollToBottom: () => void;
  handleSpecialEffect?: (effectType: string, content: string) => void;
}

export const useRealtimeChatSubscription = ({
  isOpen,
  addMessage,
  scrollToBottom,
  handleSpecialEffect
}: UseRealtimeChatSubscriptionProps) => {
  useEffect(() => {
    if (!isOpen) return;

    // Subscribe to new chat messages
    const channel = supabase.channel('public:chat_messages');
    
    const handleInsert = (payload: any) => {
      console.log('New message received:', payload);
      
      const message: ChatMessage = {
        id: payload.new.id,
        content: payload.new.content,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        senderName: payload.new.sender_name,
        createdAt: payload.new.created_at,
        isCurrentUser: false, // Will be set properly in the component
        isAdmin: payload.new.is_admin || false,
        effectType: payload.new.effect_type
      };
      
      // Check if the message has a special effect
      if (message.effectType && handleSpecialEffect) {
        handleSpecialEffect(message.effectType, message.content);
      }
      
      addMessage(message);
      setTimeout(scrollToBottom, 100);
    };

    channel
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        handleInsert)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, addMessage, scrollToBottom, handleSpecialEffect]);
};
