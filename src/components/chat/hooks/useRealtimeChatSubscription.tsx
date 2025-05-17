
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../types";
import { DbChatMessage } from "./useChatMessages";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface UseRealtimeChatSubscriptionProps {
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  scrollToBottom: () => void;
  handleSpecialEffect: (effectType: string) => void;
}

export const useRealtimeChatSubscription = ({
  isOpen,
  addMessage,
  scrollToBottom,
  handleSpecialEffect
}: UseRealtimeChatSubscriptionProps) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const channelRef = useRef<any>(null);

  // Set up real-time subscription for chat messages
  useEffect(() => {
    // Only set up subscription when sidebar is open and we're not already subscribed
    if (!isOpen || isSubscribed) return;

    console.log('Setting up realtime chat subscription');

    // Subscribe to chat message insertions
    const channel = supabase
      .channel('public:chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        (payload) => {
          try {
            const newMessage = payload.new as DbChatMessage;
            const chatMessage: ChatMessage = {
              id: newMessage.id,
              content: newMessage.content,
              createdAt: newMessage.created_at,
              conversationId: newMessage.conversation_id || 'global',
              userId: newMessage.user_id || 'anonymous',
              senderName: newMessage.sender_name || 'Anonymous',
              isCurrentUser: newMessage.user_id === user?.id,
              isAdmin: newMessage.is_admin || false,
              effectType: newMessage.effect_type
            };
            
            addMessage(chatMessage);
            
            // If there's a special effect, handle it
            if (chatMessage.effectType) {
              handleSpecialEffect(chatMessage.effectType);
            }
            
            setTimeout(scrollToBottom, 100);
          } catch (error) {
            console.error('Error handling realtime message:', error);
            toast.error('Error processing new message');
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat messages');
          setIsSubscribed(true);
          channelRef.current = channel;
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to chat messages');
          toast.error('Could not connect to chat. Please try again later.');
          setIsSubscribed(false);
        }
      });

    return () => {
      if (channelRef.current) {
        console.log('Cleaning up realtime chat subscription');
        supabase.removeChannel(channelRef.current);
        setIsSubscribed(false);
        channelRef.current = null;
      }
    };
  }, [isOpen, user, addMessage, scrollToBottom, handleSpecialEffect, isSubscribed]);
};
