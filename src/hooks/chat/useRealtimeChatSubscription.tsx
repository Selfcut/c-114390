
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
    const subscription = supabase
      .channel('public:chat_messages')
      .on('INSERT', (payload) => {
        console.log('New message received:', payload);
        
        const message: ChatMessage = {
          id: payload.new.id,
          content: payload.new.content,
          conversationId: payload.new.conversation_id,
          userId: payload.new.user_id,
          senderName: payload.new.sender_name,
          createdAt: payload.new.created_at,
          isCurrentUser: false // Will be set properly in the component
        };
        
        // Check if the message has a special effect
        if (payload.new.content.startsWith('[') && handleSpecialEffect) {
          const match = payload.new.content.match(/^\[(.*?)\](.*)/);
          if (match) {
            const effectType = match[1];
            const effectContent = match[2].trim();
            handleSpecialEffect(effectType, effectContent);
          }
        }
        
        addMessage(message);
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen, addMessage, scrollToBottom, handleSpecialEffect]);
};
