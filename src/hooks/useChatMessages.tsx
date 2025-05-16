
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, Conversation } from "@/components/chat/types";

// Mock conversations - in a real app, this would come from a database
const initialConversations = [
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

// Initial messages for the first conversation
const initialMessages: ChatMessage[] = [
  {
    id: "1",
    conversationId: "1",
    content: "Welcome to the Philosophy community! Feel free to ask questions or share insights.",
    senderName: "System",
    userId: "system",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2", 
    conversationId: "1",
    content: "Hello everyone! What major philosophical work has influenced you the most?",
    senderName: "Maria",
    userId: "user-1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    conversationId: "1",
    content: "I'd say Nietzsche's 'Beyond Good and Evil' changed my perspective significantly.",
    senderName: "John",
    userId: "user-2",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "4",
    conversationId: "1",
    content: "@Maria I've been deeply influenced by Eastern philosophy, particularly the Tao Te Ching.",
    senderName: "Alex",
    userId: "user-3",
    createdAt: new Date(Date.now() - 900000).toISOString(),
    mentions: ["Maria"],
  },
  {
    id: "5",
    conversationId: "1",
    content: "![meditation](https://media.tenor.com/YrJDHCj7JFAAAAAd/meditation-meditate.gif)",
    senderName: "Zen",
    userId: "user-4",
    createdAt: new Date(Date.now() - 300000).toISOString(),
  }
];

export const useChatMessages = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<string>(initialConversations[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    content: string;
    senderName: string;
  } | null>(null);

  // Format time for display
  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "Invalid time";
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Check if we're editing a message
    if (editingMessage) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === editingMessage 
            ? { ...msg, content: message.trim(), isEdited: true } 
            : msg
        )
      );
      setEditingMessage(null);
    } else {
      // Get mentions from the message
      const mentionRegex = /@(\w+)/g;
      const mentions: string[] = [];
      let match;
      while ((match = mentionRegex.exec(message.trim())) !== null) {
        mentions.push(match[1]);
      }
      
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
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, lastMessage: message.trim(), updatedAt: new Date().toISOString() } 
            : conv
        )
      );
      
      // Clear reply state
      setReplyingToMessage(null);
    }

    // Clear the message input
    setMessage("");

    // Simulate AI response after a short delay
    if (!editingMessage) {
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
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    if (e.key === "Escape") {
      if (editingMessage) {
        setEditingMessage(null);
        setMessage("");
      }
      
      if (replyingToMessage) {
        setReplyingToMessage(null);
      }
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // In a real app, this would fetch messages for the selected conversation from a database
    // For now, we'll just show some mock messages for the first conversation and empty for others
    if (conversationId === "1") {
      setMessages(initialMessages);
    } else {
      setMessages([
        {
          id: uuidv4(),
          conversationId: conversationId,
          content: `Welcome to the ${conversations.find(c => c.id === conversationId)?.name || "conversation"}!`,
          senderName: "System",
          userId: "system",
          createdAt: new Date().toISOString(),
        }
      ]);
    }
    
    // Clear any editing or replying state
    setEditingMessage(null);
    setReplyingToMessage(null);
  };
  
  // Handle message editing
  const handleMessageEdit = (messageId: string) => {
    const messageToEdit = messages.find(msg => msg.id === messageId);
    if (messageToEdit && messageToEdit.userId === "current-user") {
      setEditingMessage(messageId);
      setMessage(messageToEdit.content);
    }
  };
  
  // Handle message deletion
  const handleMessageDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    if (editingMessage === messageId) {
      setEditingMessage(null);
      setMessage("");
    }
    if (replyingToMessage?.id === messageId) {
      setReplyingToMessage(null);
    }
  };
  
  // Handle message reply
  const handleMessageReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyingToMessage({
        id: messageToReply.id,
        content: messageToReply.content,
        senderName: messageToReply.senderName
      });
    }
  };
  
  // Handle reaction add
  const handleReactionAdd = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.emoji === emoji);
        
        let updatedReactions;
        if (existingReaction) {
          // Update existing reaction if not already reacted by current user
          if (!existingReaction.users.includes("current-user")) {
            updatedReactions = existingReactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, "current-user"] }
                : r
            );
          } else {
            updatedReactions = existingReactions;
          }
        } else {
          // Add new reaction
          updatedReactions = [
            ...existingReactions, 
            { emoji, count: 1, users: ["current-user"] }
          ];
        }
        
        return { ...msg, reactions: updatedReactions };
      })
    );
  };
  
  // Handle reaction remove
  const handleReactionRemove = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        
        const existingReactions = msg.reactions || [];
        const existingReaction = existingReactions.find(r => r.emoji === emoji);
        
        if (!existingReaction || !existingReaction.users.includes("current-user")) {
          return msg;
        }
        
        // Update the reaction by removing the current user
        const updatedReactions = existingReactions
          .map(r => {
            if (r.emoji !== emoji) return r;
            
            const updatedUsers = r.users.filter(userId => userId !== "current-user");
            if (updatedUsers.length === 0) return null; // Remove reaction completely if no users left
            
            return { ...r, count: r.count - 1, users: updatedUsers };
          })
          .filter(Boolean) as typeof existingReactions; // Remove null entries
        
        return { ...msg, reactions: updatedReactions };
      })
    );
  };

  return {
    conversations,
    selectedConversation,
    message,
    setMessage,
    messages,
    isLoading,
    formatTime,
    handleSendMessage,
    handleKeyDown,
    handleSelectConversation,
    handleMessageEdit,
    handleMessageDelete,
    handleMessageReply,
    handleReactionAdd,
    handleReactionRemove,
    editingMessage,
    replyingToMessage
  };
};
