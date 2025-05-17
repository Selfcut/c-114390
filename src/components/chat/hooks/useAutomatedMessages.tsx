
import { useState, useEffect } from 'react';
import { getRandomAutomatedMessage } from '../AutomatedMessages';
import { ChatMessage } from '../types';

interface AutomatedMessagesProps {
  isActive?: boolean;
  interval?: number;
  maxMessages?: number;
}

export const useAutomatedMessages = ({
  isActive = false,
  interval = 20000,
  maxMessages = 3
}: AutomatedMessagesProps) => {
  const [automatedMessages, setAutomatedMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!isActive) return;

    let messageCount = 0;
    const timer = setInterval(() => {
      if (messageCount >= maxMessages) {
        clearInterval(timer);
        return;
      }

      const newMessage = getRandomAutomatedMessage();
      setAutomatedMessages(prev => [...prev, newMessage]);
      messageCount++;
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [isActive, interval, maxMessages]);

  return { automatedMessages };
};
