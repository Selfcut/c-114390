
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/components/chat/types";

interface UseMessageHandlersProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  message: string;
  clearInputState: () => void;
  editingMessageId: string | null;
  replyingToMessage: {
    id: string;
    content: string;
    senderName: string;
  } | null;
  selectedConversation: string;
  updateConversationLastMessage: (conversationId: string, message: string) => void;
}

export const useMessageHandlers = ({
  messages,
  setMessages,
  message,
  clearInputState,
  editingMessageId,
  replyingToMessage,
  selectedConversation,
  updateConversationLastMessage
}: UseMessageHandlersProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Extract mentions from message
  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Check if we're editing a message
    if (editingMessageId) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === editingMessageId 
            ? { ...msg, content: message.trim(), isEdited: true } 
            : msg
        )
      );
    } else {
      // Get mentions from the message
      const mentions = extractMentions(message.trim());
      
      // Create a new message
      const newMessage: ChatMessage = {
        id: uuidv4(),
        conversationId: selectedConversation,
        content: message.trim(),
        senderName: "You", // In a real app, this would be the current user's name
        userId: "current-user", // In a real app, this would be the current user's ID
        createdAt: new Date().toISOString(),
        mentions: mentions.length > 0 ? mentions : undefined,
        replyTo: replyingToMessage 
          ? {
              id: replyingToMessage.id,
              content: replyingToMessage.content,
              sender: { name: replyingToMessage.senderName }
            } 
          : undefined
      };

      // Add the message to the messages array
      setMessages(prev => [...prev, newMessage]);

      // Update the conversation last message
      updateConversationLastMessage(selectedConversation, message.trim());
      
      // Simulate AI response after a short delay
      setIsLoading(true);
      setTimeout(() => {
        const aiResponses = [
          "That's an interesting perspective!",
          "I hadn't thought of it that way before.",
          "Thanks for sharing your thoughts on this topic.",
          "What led you to that conclusion?",
          "I'd love to hear more about your ideas on this.",
          "![thinking](https://media.tenor.com/mGc0C4gOdTYAAAAi/thinking-hmm.gif)"
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          conversationId: selectedConversation,
          content: randomResponse,
          senderName: "AI Assistant",
          userId: "ai-assistant",
          createdAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    }

    // Clear the message input and related states
    clearInputState();
  };

  // Handle message editing
  const handleMessageEdit = (messageId: string) => {
    const messageToEdit = messages.find(msg => msg.id === messageId);
    if (messageToEdit && messageToEdit.userId === "current-user") {
      const originalContent = messageToEdit.content;
      return { messageId, content: originalContent };
    }
    return null;
  };
  
  // Handle message deletion
  const handleMessageDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };
  
  // Handle message reply
  const handleMessageReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      return {
        id: messageToReply.id,
        content: messageToReply.content,
        senderName: messageToReply.senderName
      };
    }
    return null;
  };

  return {
    isLoading,
    handleSendMessage,
    handleMessageEdit,
    handleMessageDelete,
    handleMessageReply
  };
};
