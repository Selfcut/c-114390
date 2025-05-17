
import { useState, useEffect } from 'react';
import { getRandomAutomatedMessage } from '../AutomatedMessages';
import { ChatMessage } from '../types';

export const useAutomatedMessages = (
  isActive: boolean = false,
  interval: number = 20000,
  maxMessages: number = 3
) => {
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
