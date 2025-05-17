
import React, { useRef, useEffect } from "react";
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

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const { isAdmin } = useAdminStatus();
  
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
  
  useAutomatedMessages({ 
    isOpen, 
    messages, 
    addMessage, 
    scrollToBottom 
  });

  // Fetch messages when the sidebar is opened
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  // Handle GIF selection
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(prev => prev + " " + gifMarkdown);
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

  return (
    <>
      {!isOpen && <CollapsedChatButton onClick={toggleSidebar} />}
      
      <ChatSidebarContainer isOpen={isOpen}>
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <ChatContent
          isLoadingMessages={isLoadingMessages}
          messages={messages}
          isLoading={isLoadingMessages || isSendingMessage}
          formatTime={formatTime}
          onMessageEdit={handleEditMessage}
          onMessageDelete={handleDeleteMessage}
          onMessageReply={handleReplyToMessage}
          onReactionAdd={() => {}} // Not implemented yet
          onReactionRemove={() => {}} // Not implemented yet
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
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
