
import React, { useRef } from "react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { useAuth } from "@/lib/auth";
import { CollapsedChatButton } from "./CollapsedChatButton";
import { ChatSidebarContainer } from "./ChatSidebarContainer";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatAnimationStyles } from "./ChatAnimationStyles";
import { ChatSidebarContent } from "./ChatSidebarContent";
import { useChatSidebarState } from "./hooks/useChatSidebarState";

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our hook to manage all chat sidebar state
  const chatState = useChatSidebarState({
    isOpen,
    messagesEndRef
  });

  // Update CSS variable for chat sidebar width when open/closed
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--content-margin-right', 
      isOpen ? 'var(--chat-sidebar-width)' : '0'
    );
    return () => {
      document.documentElement.style.setProperty('--content-margin-right', '0');
    };
  }, [isOpen]);
  
  return (
    <>
      {!isOpen && <CollapsedChatButton onClick={toggleSidebar} />}
      
      <ChatSidebarContainer isOpen={isOpen}>
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <ChatSidebarContent 
          isOpen={isOpen}
          messagesEndRef={messagesEndRef}
          currentUserId={user?.id || null}
          {...chatState}
        />
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
