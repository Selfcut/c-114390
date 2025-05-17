
import { useState } from "react";
import { Conversation } from "@/components/chat/types";

// Mock conversations - in a real app, this would come from a database
const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "General Chat",
    lastMessage: "Welcome to the community!",
    updatedAt: new Date().toISOString(),
    isGlobal: true
  },
  {
    id: "2",
    name: "Book Club",
    lastMessage: "What's everyone reading?",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    isGroup: true
  },
  {
    id: "3",
    name: "Philosophy Discussion",
    lastMessage: "Interesting perspective!",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    isGroup: true
  }
];

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<string>(initialConversations[0].id);

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    return conversations.find(c => c.id === conversationId);
  };

  // Update conversation's last message
  const updateConversationLastMessage = (conversationId: string, message: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() } 
          : conv
      )
    );
  };

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    handleSelectConversation,
    updateConversationLastMessage
  };
};
