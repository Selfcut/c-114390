import { useState } from 'react';
import { ChatMessage } from '@/components/chat/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export const useMessageHandlers = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();

  // Handle edit message
  const handleEditMessage = (messageId: string) => {
    setIsEditing(messageId);
  };

  // Handle reply to message
  const handleReplyMessage = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageId); // Now storing just the ID
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!user) return;
    
    try {
      let message: ChatMessage = {
        id: `msg-${Date.now()}`,
        content,
        userId: user.id,
        createdAt: new Date().toISOString(),
        conversationId,
        senderName: user.name,
      };
      
      if (isEditing) {
        // Editing existing message
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === isEditing
              ? { ...msg, content, isEdited: true }
              : msg
          )
        );
      } else if (replyingTo) {
        // Find the original message to get data
        const originalMessage = messages.find(msg => msg.id === replyingTo);
        
        if (originalMessage) {
          message.replyTo = replyingTo; // Store the ID of the message being replied to
        }
        
        setMessages(prevMessages => [...prevMessages, message]);
      } else {
        setMessages(prevMessages => [...prevMessages, message]);
      }
      
      // Optimistically update the UI
      // setMessages(prevMessages => [...prevMessages, message]);
      
      setIsEditing(null);
      setReplyingTo(null);
      
      return message.id;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  return {
    messages,
    isEditing,
    replyingTo,
    sendMessage,
    handleEditMessage: (messageId: string) => setIsEditing(messageId),
    handleReplyMessage,
  };
};
