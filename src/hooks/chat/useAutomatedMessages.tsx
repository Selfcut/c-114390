
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAutomatedMessagesProps {
  isActive: boolean;
  maxMessages?: number;
}

export const useAutomatedMessages = ({ 
  isActive,
  maxMessages = 5
}: UseAutomatedMessagesProps) => {
  const [messageCount, setMessageCount] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    
    let timeout: NodeJS.Timeout;
    
    const sendAutomatedMessage = async () => {
      if (messageCount >= maxMessages) return;
      
      const systemMessages = [
        "Welcome to the community chat!",
        "Feel free to ask questions here.",
        "Don't forget to check out our resources section.",
        "Remember to be respectful to all community members.",
        "Need help? Tag an admin with @admin."
      ];
      
      const message = {
        content: systemMessages[messageCount % systemMessages.length],
        conversation_id: 'global',
        user_id: '00000000-0000-0000-0000-000000000000', // System user ID
        sender_name: 'System',
        is_system: true,
        created_at: new Date().toISOString()
      };
      
      try {
        await supabase.from('chat_messages').insert(message);
        setMessageCount(count => count + 1);
      } catch (error) {
        console.error('Error sending automated message:', error);
      }
      
      // Schedule next message if not reached max
      if (messageCount < maxMessages - 1) {
        const nextDelay = Math.random() * 20000 + 10000; // 10-30 seconds
        timeout = setTimeout(sendAutomatedMessage, nextDelay);
      }
    };
    
    // Start sending automated messages
    if (messageCount === 0) {
      timeout = setTimeout(sendAutomatedMessage, 5000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isActive, messageCount, maxMessages]);
};
