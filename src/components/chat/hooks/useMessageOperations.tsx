
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { MessageReply } from "./types/chatMessageTypes";

/**
 * Hook for message operations like edit, delete, and reply
 */
export const useMessageOperations = () => {
  const { user } = useAuth();

  // Edit message
  const fetchMessageForEdit = async (messageId: string, setEditingMessageId: (id: string | null) => void, setInputMessage: (message: string) => void) => {
    if (!user) {
      toast.error('You need to be logged in to edit messages');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content')
        .eq('id', messageId)
        .eq('user_id', user.id) // Only allow users to edit their own messages
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error("You can only edit your own messages");
        } else {
          toast.error('Failed to fetch message content');
        }
        return;
      }
      
      if (data) {
        setEditingMessageId(messageId);
        setInputMessage(data.content);
      }
    } catch (error) {
      console.error('Error fetching message content:', error);
      toast.error('Failed to edit message');
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!user) {
      toast.error('You need to be logged in to delete messages');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id); // Only allow users to delete their own messages
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error("You can only delete your own messages");
        } else {
          toast.error('Failed to delete message');
        }
        return;
      }
      
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Reply to message
  const fetchMessageForReply = async (messageId: string, setReplyingToMessage: (reply: MessageReply) => void) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('content, sender_name')
        .eq('id', messageId)
        .single();
      
      if (error) {
        toast.error('Failed to fetch message for reply');
        return;
      }
      
      if (data) {
        setReplyingToMessage({
          id: messageId,
          content: data.content,
          senderName: data.sender_name || 'Unknown'
        });
      }
    } catch (error) {
      console.error('Error fetching message for reply:', error);
      toast.error('Failed to reply to message');
    }
  };

  // Add reaction to message
  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) {
      toast.error('You need to be logged in to react to messages');
      return;
    }
    
    try {
      // In a real implementation, you would have a reactions table
      // For now, we'll just show a toast indicating success
      toast.success(`Added reaction ${emoji}`);
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  // Remove reaction from message
  const removeReaction = async (messageId: string, emoji: string) => {
    if (!user) {
      toast.error('You need to be logged in to remove reactions');
      return;
    }
    
    try {
      // In a real implementation, you would remove from a reactions table
      // For now, we'll just show a toast indicating success
      toast.success(`Removed reaction ${emoji}`);
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
  };

  return {
    fetchMessageForEdit,
    deleteMessage,
    fetchMessageForReply,
    addReaction,
    removeReaction
  };
};
