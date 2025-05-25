
import React, { useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLayout } from "@/contexts/LayoutContext";
import { CollapsedChatButton } from "./CollapsedChatButton";
import { ChatSidebarContainer } from "./ChatSidebarContainer";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatAnimationStyles } from "./ChatAnimationStyles";
import { SimplifiedChatSidebarContent } from "./SimplifiedChatSidebarContent";
import { useChatSidebarState } from "./hooks/useChatSidebarState";
import { useChatMessages } from "./hooks/useChatMessages";

export const FullHeightChatSidebar = () => {
  const { chatSidebarOpen, toggleChatSidebar } = useLayout();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our hooks to manage chat state
  const chatState = useChatSidebarState({
    isOpen: chatSidebarOpen,
    messagesEndRef
  });
  
  const { messages, isLoadingMessages, addMessage } = useChatMessages();

  const handleSendMessage = (content: string) => {
    if (!user) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      userId: user.id,
      createdAt: new Date().toISOString(),
      conversationId: chatState.selectedConversation,
      senderName: user.name || user.username || 'Anonymous',
      isCurrentUser: true,
      reactions: []
    };
    
    addMessage(newMessage);
  };
  
  return (
    <>
      {!chatSidebarOpen && <CollapsedChatButton onClick={toggleChatSidebar} />}
      
      <ChatSidebarContainer isOpen={chatSidebarOpen}>
        <ChatSidebarHeader toggleSidebar={toggleChatSidebar} />
        
        <SimplifiedChatSidebarContent 
          isOpen={chatSidebarOpen}
          messagesEndRef={messagesEndRef}
          currentUserId={user?.id || null}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          onSendMessage={handleSendMessage}
          {...chatState}
        />
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
