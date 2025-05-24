
import React, { useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useLayout } from "@/contexts/LayoutContext";
import { CollapsedChatButton } from "./CollapsedChatButton";
import { ChatSidebarContainer } from "./ChatSidebarContainer";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatAnimationStyles } from "./ChatAnimationStyles";
import { ChatSidebarContent } from "./ChatSidebarContent";
import { useChatSidebarState } from "./hooks/useChatSidebarState";

export const FullHeightChatSidebar = () => {
  const { chatSidebarOpen, toggleChatSidebar } = useLayout();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our hook to manage all chat sidebar state
  const chatState = useChatSidebarState({
    isOpen: chatSidebarOpen,
    messagesEndRef
  });
  
  return (
    <>
      {!chatSidebarOpen && <CollapsedChatButton onClick={toggleChatSidebar} />}
      
      <ChatSidebarContainer isOpen={chatSidebarOpen}>
        <ChatSidebarHeader toggleSidebar={toggleChatSidebar} />
        
        <ChatSidebarContent 
          isOpen={chatSidebarOpen}
          messagesEndRef={messagesEndRef}
          currentUserId={user?.id || null}
          {...chatState}
        />
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
