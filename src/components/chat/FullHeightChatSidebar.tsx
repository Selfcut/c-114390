
import React, { useRef } from "react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatActions } from "./hooks/useChatActions";
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
import { formatTime } from "./utils/formatTime";
import { useState } from "react";

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const { isAdmin } = useAdminStatus();
  
  // Add local state for missing properties
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Use the existing useChatMessages hook
  const {
    messages,
    isLoading,
    message: inputMessage,
    setMessage: setInputMessage,
    replyingToMessage,
    editingMessageId,
    handleSendMessage,
    handleMessageEdit,
    handleMessageDelete,
    handleMessageReply,
    handleReactionAdd,
    handleReactionRemove,
    handleKeyDown
  } = useChatMessages();
  
  const { handleSpecialEffect } = useSpecialEffects();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mock the missing functions that were expected
  const fetchMessages = () => {
    setIsLoadingMessages(true);
    // Simulate fetching messages
    setTimeout(() => {
      setIsLoadingMessages(false);
    }, 500);
  };
  
  const addMessage = (message: any) => {
    // This would be implemented if we had real-time functionality
    console.log("Message would be added:", message);
    scrollToBottom();
  };

  // Use our custom hooks
  useRealtimeChatSubscription({ isOpen, addMessage, scrollToBottom, handleSpecialEffect });
  useAutomatedMessages({ isOpen, messages, addMessage, scrollToBottom });

  // Fetch messages when the sidebar is opened
  React.useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(inputMessage + emoji);
  };

  // Handle GIF selection
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(inputMessage + " " + gifMarkdown);
  };

  // Handle admin effect selection
  const handleAdminEffectSelect = (effectType: string, content?: string) => {
    // This would be implemented if we had admin functionality
    console.log("Admin effect selected:", effectType, content);
  };

  const cancelEdit = () => {
    // This would be implemented if we had edit functionality
  };

  const cancelReply = () => {
    // This would be implemented if we had reply functionality  
  };

  return (
    <>
      {!isOpen && <CollapsedChatButton onClick={toggleSidebar} />}
      
      <ChatSidebarContainer isOpen={isOpen}>
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <ChatContent
          isLoadingMessages={isLoadingMessages}
          messages={messages}
          isLoading={isLoading}
          formatTime={formatTime}
          onMessageEdit={handleMessageEdit}
          onMessageDelete={handleMessageDelete}
          onMessageReply={handleMessageReply}
          onReactionAdd={handleReactionAdd}
          onReactionRemove={handleReactionRemove}
          inputMessage={inputMessage || ""}
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
