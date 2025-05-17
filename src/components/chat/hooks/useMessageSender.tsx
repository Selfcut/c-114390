
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { MessageReply } from "./types/chatMessageTypes";

/**
 * Hook for sending regular and admin messages
 */
export const useMessageSender = () => {
  const { user } = useAuth();

  // Send a regular message
  const sendMessage = async (
    messageContent: string, 
    replyInfo: MessageReply | null,
    setIsLoading: (loading: boolean) => void,
    setInputMessage: (message: string) => void,
    setEditingMessageId: (messageId: string | null) => void,
    editingMessageId: string | null
  ) => {
    if (!messageContent.trim()) return;
    if (!user) {
      toast.error('You need to be logged in to send messages');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageContent,
          user_id: user.id,
          sender_name: user.name || user.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global', // For simplicity, using a single global conversation
          is_admin: user.isAdmin || false,
          // Include reply info if applicable
          ...(replyInfo ? { reply_to: replyInfo.id } : {})
        });
      
      if (error) throw error;
      
      if (editingMessageId) {
        setEditingMessageId(null);
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message: ' + (error.message || 'Unknown error'));
      // Return the input message so user doesn't lose their text
      setInputMessage(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  // Send an admin effect message
  const sendAdminEffect = async (
    effectType: string, 
    content: string | undefined,
    setIsLoading: (loading: boolean) => void,
    setInputMessage: (message: string) => void
  ) => {
    if (!user?.isAdmin) {
      toast.error('Only admins can use special effects');
      return;
    }
    
    const messageContent = content || '';
    if (!messageContent.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageContent,
          user_id: user.id,
          sender_name: user.name || user.email?.split('@')[0] || 'Anonymous',
          conversation_id: 'global',
          is_admin: true,
          effect_type: effectType
        });
      
      if (error) throw error;
      
      // Clear input if we used it
      if (!content) {
        setInputMessage('');
      }
      
      toast.success(`${effectType} effect sent!`);
      
    } catch (error: any) {
      console.error('Error sending admin message:', error);
      toast.error('Failed to send message with effect: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, sendAdminEffect };
};
