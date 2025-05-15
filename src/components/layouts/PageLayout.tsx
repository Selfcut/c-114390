
import React, { useState, useEffect } from "react";
import { PromoBar } from "../PromoBar";
import { Sidebar } from "../Sidebar";
import Header from "../Header";

interface PageLayoutProps {
  children: React.ReactNode;
  showPromo?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export const PageLayout = ({ 
  children, 
  showPromo = true, 
  showSidebar = true, 
  showHeader = true 
}: PageLayoutProps) => {
  // Create a state to track if the chat sidebar is open
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Listen to a custom event that will be dispatched when the chat sidebar opens/closes
  useEffect(() => {
    const handleChatToggle = (e: CustomEvent) => {
      setIsChatOpen(e.detail.isOpen);
    };

    // TypeScript doesn't know about our custom event
    window.addEventListener('chatSidebarToggle' as any, handleChatToggle as EventListener);

    return () => {
      window.removeEventListener('chatSidebarToggle' as any, handleChatToggle as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showPromo && <PromoBar />}
      <div className={`flex flex-1 relative ${isChatOpen ? 'mr-[400px]' : ''}`}>
        {showSidebar && <Sidebar />}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'ml-64' : ''}`}>
          {showHeader && <Header />}
          <main className="flex-1 overflow-auto p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
