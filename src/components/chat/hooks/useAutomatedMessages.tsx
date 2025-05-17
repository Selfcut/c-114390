
import { useEffect } from "react";
import { ChatMessage } from "../types";
import { scheduleAutomatedMessages, getRandomAutomatedMessage } from "../AutomatedMessages";

interface UseAutomatedMessagesProps {
  isOpen: boolean;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  scrollToBottom: () => void;
}

export const useAutomatedMessages = ({
  isOpen,
  messages,
  addMessage,
  scrollToBottom
}: UseAutomatedMessagesProps) => {
  // Schedule automated messages
  useEffect(() => {
    if (!isOpen) return;
    
    // Add an initial message when chat is first opened
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        content: "Welcome to the chat! This is a space to discuss consciousness, philosophy, and STEM topics. I'll occasionally share interesting facts and insights. Feel free to join the conversation!",
        senderName: "Neural Network",
        userId: "system",
        createdAt: new Date().toISOString(),
        isSystem: true,
        conversationId: 'global'
      };
      
      addMessage(welcomeMessage);
      
      // Add a first automated message after 10 seconds
      setTimeout(() => {
        const firstAutomatedMessage = getRandomAutomatedMessage();
        addMessage(firstAutomatedMessage);
      }, 10000);
    }
    
    // Schedule recurring automated messages
    const cleanup = scheduleAutomatedMessages((msg) => {
      addMessage(msg);
      setTimeout(scrollToBottom, 100);
    }, 60000, 180000); // Between 1-3 minutes
    
    return cleanup;
  }, [isOpen, messages.length, addMessage, scrollToBottom]);
};
