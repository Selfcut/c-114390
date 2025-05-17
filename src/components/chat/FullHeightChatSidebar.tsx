
import React, { useRef, useEffect } from "react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { useChatMessages } from "@/hooks/useChatMessages";
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

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const { isAdmin } = useAdminStatus();
  
  // Use the existing useChatMessages hook with all its functionality
  const {
    messages,
    isLoading,
    message,
    setMessage,
    replyingToMessage,
    editingMessageId,
    handleSendMessage,
    handleMessageEdit,
    handleMessageDelete,
    handleMessageReply,
    handleReactionAdd,
    handleReactionRemove,
    handleKeyDown,
    fetchMessages,
    selectedConversation
  } = useChatMessages();
  
  const { handleSpecialEffect } = useSpecialEffects();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Real functionality to add a message
  const addMessage = (message: any) => {
    // In a real app, this would insert into the database
    // For now, we'll just scroll to bottom
    scrollToBottom();
  };

  // Use our custom hooks
  useRealtimeChatSubscription({ 
    isOpen, 
    addMessage, 
    scrollToBottom, 
    handleSpecialEffect 
  });
  
  useAutomatedMessages({ 
    isOpen, 
    messages, 
    addMessage, 
    scrollToBottom 
  });

  // Fetch messages when the sidebar is opened or conversation changes
  useEffect(() => {
    if (isOpen && selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [isOpen, selectedConversation, fetchMessages]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
  };

  // Handle GIF selection
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setMessage(message + " " + gifMarkdown);
  };

  // Handle admin effect selection
  const handleAdminEffectSelect = (effectType: string, content?: string) => {
    // This would be implemented if we had admin functionality
    console.log("Admin effect selected:", effectType, content);
  };

  const cancelEdit = () => {
    if (editingMessageId) {
      setMessage("");
      // Additional logic would be here in a real implementation
    }
  };

  const cancelReply = () => {
    if (replyingToMessage) {
      // Additional logic would be here in a real implementation
    }
  };

  return (
    <>
      {!isOpen && <CollapsedChatButton onClick={toggleSidebar} />}
      
      <ChatSidebarContainer isOpen={isOpen}>
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <ChatContent
          isLoadingMessages={isLoading}
          messages={messages}
          isLoading={isLoading}
          formatTime={(timestamp) => {
            try {
              return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch (e) {
              return 'Invalid time';
            }
          }}
          onMessageEdit={handleMessageEdit}
          onMessageDelete={handleMessageDelete}
          onMessageReply={handleMessageReply}
          onReactionAdd={handleReactionAdd}
          onReactionRemove={handleReactionRemove}
          inputMessage={message}
          setInputMessage={setMessage}
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
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
