
import React, { ReactNode } from "react";

interface ChatSidebarContainerProps {
  isOpen: boolean;
  children: ReactNode;
}

export const ChatSidebarContainer = ({ isOpen, children }: ChatSidebarContainerProps) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-screen bg-background border-l border-border shadow-lg transition-all duration-300 z-40 flex flex-col chat-container ${
        isOpen ? 'translate-x-0 w-[var(--chat-sidebar-width)]' : 'translate-x-full w-0'
      }`}
    >
      {children}
    </div>
  );
};
