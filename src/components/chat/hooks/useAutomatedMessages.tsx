
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

interface UseAutomatedMessagesProps {
  isActive: boolean;
  maxMessages?: number;
}

// Sample messages for demonstration
const welcomeMessages = [
  "👋 Welcome to the chat! Feel free to ask any questions.",
  "Welcome! The community is here to help you on your learning journey.",
  "Hello there! Don't hesitate to join the conversation.",
  "Welcome aboard! This is a friendly space for discussions and learning.",
  "Greetings! Feel free to introduce yourself to the community."
];

const welcomeResponses = [
  "We're glad to have you here!",
  "Great to see new members joining the discussion!",
  "Feel free to explore all the features of our platform.",
  "Don't hesitate to ask if you need any help navigating around.",
  "The community is always here to support your learning journey."
];

export const useAutomatedMessages = ({
  isActive,
  maxMessages = 3
}: UseAutomatedMessagesProps) => {
  const sentMessagesCount = useRef(0);

  // Send an automated message
  const sendAutomatedMessage = async (content: string, isWelcome = false) => {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      await supabase.from("chat_messages").insert({
        id,
        content,
        conversation_id: "global",
        user_id: "system",
        sender_name: "Assistant",
        is_system: true,
        created_at: now
      });
      
      sentMessagesCount.current++;
      
      // For welcome messages, send a follow-up response after a delay
      if (isWelcome && sentMessagesCount.current < maxMessages) {
        setTimeout(() => {
          const responseIndex = Math.floor(Math.random() * welcomeResponses.length);
          sendAutomatedMessage(welcomeResponses[responseIndex]);
        }, 45000 + Math.random() * 30000); // Random delay between 45-75 seconds
      }
    } catch (error) {
      console.error("Error sending automated message:", error);
    }
  };

  // Initialize automated messages when chat becomes active
  useEffect(() => {
    if (isActive && sentMessagesCount.current === 0) {
      // Send first welcome message after a short delay
      const timeoutId = setTimeout(() => {
        const messageIndex = Math.floor(Math.random() * welcomeMessages.length);
        sendAutomatedMessage(welcomeMessages[messageIndex], true);
      }, 10000); // 10 seconds after activation
      
      return () => clearTimeout(timeoutId);
    }
  }, [isActive]);

  return null; // This hook doesn't return anything
};
