
import React, { useRef, useEffect, useState } from "react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { useChatMessages } from "./hooks/useChatMessages";
import { useSpecialEffects } from "./hooks/useSpecialEffects";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useRealtimeChatSubscription } from "./hooks/useRealtimeChatSubscription";
import { useAutomatedMessages } from "./hooks/useAutomatedMessages";
import { useAuth } from "@/lib/auth";
import { CollapsedChatButton } from "./CollapsedChatButton";
import { ChatSidebarContainer } from "./ChatSidebarContainer";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatContent } from "./ChatContent";
import { ChatAnimationStyles } from "./ChatAnimationStyles";
import { useChatActions } from "./hooks/useChatActions";
import { ConversationsList } from "./ConversationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationItem } from "./types";

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const { isAdmin } = useAdminStatus();
  const [activeTab, setActiveTab] = useState<string>("chats");
  
  // Mock conversations for demo
  const [conversations, setConversations] = useState<ConversationItem[]>([
    { id: 'global', name: 'Global Chat', lastMessage: 'Welcome to the community!', unread: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'philosophy', name: 'Philosophy', lastMessage: 'What is consciousness?', unread: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'science', name: 'Science', lastMessage: 'New discoveries in quantum physics', unread: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'art', name: 'Art & Literature', lastMessage: 'Discussing modern art movements', unread: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState<string>("global");
  
  // Use the chat messages hook for loading messages
  const {
    messages,
    isLoadingMessages,
    addMessage,
    fetchMessages
  } = useChatMessages();

  // Use chat actions for message operations
  const {
    isLoading: isSendingMessage,
    inputMessage,
    setInputMessage,
    replyingToMessage,
    editingMessageId,
    handleSendMessage,
    handleAdminEffectSelect,
    handleEditMessage,
    handleDeleteMessage,
    handleReplyToMessage,
    cancelEdit,
    cancelReply,
    handleKeyDown
  } = useChatActions();
  
  const { handleSpecialEffect } = useSpecialEffects();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Use our custom hooks for realtime functionality
  useRealtimeChatSubscription({ 
    isOpen, 
    addMessage, 
    scrollToBottom, 
    handleSpecialEffect 
  });
  
  // Fix: Update to use object parameter
  useAutomatedMessages({ 
    isActive: isOpen, 
    maxMessages: 5
  });

  // Fetch messages when the sidebar is opened or conversation changes
  useEffect(() => {
    if (isOpen) {
      fetchMessages(selectedConversation);
    }
  }, [isOpen, fetchMessages, selectedConversation]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  // Handle GIF selection
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(prev => prev + " " + gifMarkdown);
  };

  // Handle reaction operations
  const handleReactionAdd = (messageId: string, emoji: string) => {
    console.log(`Adding reaction ${emoji} to message ${messageId}`);
    // Implement reaction add functionality
    const updatedMessages = messages.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const existingReactions = msg.reactions || [];
      const existingReaction = existingReactions.find(r => r.emoji === emoji);
      
      let updatedReactions;
      if (existingReaction) {
        // Update existing reaction if not already reacted by current user
        if (!existingReaction.users.includes(user?.id || 'current-user')) {
          updatedReactions = existingReactions.map(r => 
            r.emoji === emoji 
              ? { ...r, count: r.count + 1, users: [...r.users, user?.id || 'current-user'] }
              : r
          );
        } else {
          updatedReactions = existingReactions;
        }
      } else {
        // Add new reaction
        updatedReactions = [
          ...existingReactions, 
          { emoji, count: 1, users: [user?.id || 'current-user'] }
        ];
      }
      
      return { ...msg, reactions: updatedReactions };
    });
    
    // Update messages with new reactions
    // In a real app, this would call to a backend API
  };
  
  const handleReactionRemove = (messageId: string, emoji: string) => {
    console.log(`Removing reaction ${emoji} from message ${messageId}`);
    // Implement reaction remove functionality
    const updatedMessages = messages.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const existingReactions = msg.reactions || [];
      const existingReaction = existingReactions.find(r => r.emoji === emoji);
      
      if (!existingReaction || !existingReaction.users.includes(user?.id || 'current-user')) {
        return msg;
      }
      
      // Update the reaction by removing the current user
      const updatedReactions = existingReactions
        .map(r => {
          if (r.emoji !== emoji) return r;
          
          const updatedUsers = r.users.filter(userId => userId !== (user?.id || 'current-user'));
          if (updatedUsers.length === 0) return null; // Remove reaction completely if no users left
          
          return { ...r, count: r.count - 1, users: updatedUsers };
        })
        .filter(Boolean) as typeof existingReactions; // Remove null entries
      
      return { ...msg, reactions: updatedReactions };
    });
    
    // Update messages with new reactions
    // In a real app, this would call to a backend API
  };

  // Format time helper function
  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return 'Invalid time';
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark conversation as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
    
    // Fetch messages for this conversation
    fetchMessages(conversationId);
  };

  return (
    <>
      {!isOpen && <CollapsedChatButton onClick={toggleSidebar} />}
      
      <ChatSidebarContainer isOpen={isOpen}>
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mx-auto my-2 px-2">
              <TabsTrigger value="chats">Chat Rooms</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chats" className="flex-1 overflow-hidden flex flex-col">
              <ConversationsList 
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </TabsContent>
            
            <TabsContent value="messages" className="flex-1 overflow-hidden flex flex-col">
              <ChatContent
                isLoadingMessages={isLoadingMessages}
                messages={messages}
                isLoading={isLoadingMessages || isSendingMessage}
                formatTime={formatTime}
                onMessageEdit={handleEditMessage}
                onMessageDelete={handleDeleteMessage}
                onMessageReply={handleReplyToMessage}
                onReactionAdd={handleReactionAdd}
                onReactionRemove={handleReactionRemove}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                handleKeyDown={handleKeyDown}
                editingMessageId={editingMessageId}
                replyingToMessage={replyingToMessage}
                onCancelEdit={cancelEdit}
                onCancelReply={cancelReply}
                onEmojiSelect={handleEmojiSelect}
                onGifSelect={handleGifSelect}
                isAdmin={isAdmin}
                onAdminEffectSelect={handleAdminEffectSelect}
                messagesEndRef={messagesEndRef}
                currentUserId={user?.id || null}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
